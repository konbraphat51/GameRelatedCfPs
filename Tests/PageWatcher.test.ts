// Tests for CfP page change detection.
import { describe, expect, it } from "vitest";
import { decodeBody, extractSignalLines } from "../Scripts/PageSignal";
import { checkPages, classifyPage, mergeSnapshots } from "../Scripts/PageWatcher";
import { createVenue } from "./Fixtures";

const PAGE = `<html><head><style>.a{}</style><script>var t = "2027 deadline";</script></head><body>
<nav>Home</nav><p>Call for Papers 2027</p><p>Paper deadline: March 1, 2027</p>
<p>Notification&nbsp;of acceptance: May 2027</p><footer>© 2026 Society</footer></body></html>`;

describe("extractSignalLines", () => {
  it("keeps CfP-related lines and drops scripts, navigation and copyright noise", () => {
    expect(extractSignalLines(PAGE)).toEqual([
      "Call for Papers 2027",
      "Paper deadline: March 1, 2027",
      "Notification of acceptance: May 2027",
    ]);
  });
});

describe("decodeBody", () => {
  it("uses the charset declared in a meta tag", () => {
    const html = '<meta charset="shift_jis">';
    // "締切" encoded in Shift_JIS.
    const bytes = new Uint8Array([...new TextEncoder().encode(html), 0x92, 0xf7, 0x90, 0xd8]);
    expect(decodeBody(bytes.buffer, null)).toBe(`${html}締切`);
  });
});

describe("classifyPage", () => {
  const lines = ["a 2027", "b deadline", "c submission"];

  it("does not treat a single-line binary fingerprint as thin when allowed", () => {
    expect(classifyPage(undefined, ["document abc"], "2026-11-10", 1).change).toBe("new");
  });

  it("reports new, unchanged, changed and thin pages", () => {
    const first = classifyPage(undefined, lines, "2026-11-10");
    expect(first.change).toBe("new");
    const again = classifyPage(first.snapshot, lines, "2027-01-01");
    expect(again).toEqual({ change: "unchanged", snapshot: first.snapshot });
    expect(classifyPage(first.snapshot, lines, "2027-06-01").change).toBe("stale");
    expect(classifyPage(first.snapshot, [...lines, "d"], "2027-01-01").change).toBe("changed");
    expect(classifyPage(first.snapshot, ["a 2027"], "2027-01-01").change).toBe("thin");
  });
});

describe("checkPages", () => {
  it("fetches shared URLs once, reports errors and merges only successful snapshots", async () => {
    const fetched: string[] = [];
    const venues = [
      createVenue({ id: "a", cfpUrl: "https://ok.example/" }),
      createVenue({ id: "b", cfpUrl: "https://ok.example/" }),
      createVenue({ id: "c", cfpUrl: "https://down.example/" }),
    ];
    const results = await checkPages(
      venues,
      {},
      async (url) => {
        fetched.push(url);
        if (url.includes("down")) {
          throw new Error("HTTP 503");
        }
        return { html: PAGE };
      },
      "2026-11-10",
      "2027",
    );
    expect(fetched).toHaveLength(2);
    expect(results.map((r) => r.change)).toEqual(["new", "new", "error"]);
    expect(results[0]?.detail).toBe("3 line(s) with 2027");
    expect(Object.keys(mergeSnapshots({}, results))).toEqual(["https://ok.example/"]);
  });
});
