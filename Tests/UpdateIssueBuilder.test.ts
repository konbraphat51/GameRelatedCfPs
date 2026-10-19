// Tests for the periodic data-update issue body.
import { describe, expect, it } from "vitest";
import { buildUpdateIssueBody, MAINTAINER } from "../Scripts/UpdateIssueBuilder";
import { createJournal, createVenue } from "./Fixtures";

const TODAY = "2026-12-20";

describe("buildUpdateIssueBody", () => {
  const body = buildUpdateIssueBody(
    {
      lastUpdated: "2026-10-19",
      venues: [
        createVenue({ id: "soon", acronym: "SOON" }),
        createVenue({ id: "unknown", acronym: "UNKNOWN", cfpPublished: false, deadlines: [] }),
        createVenue({
          id: "closed",
          acronym: "CLOSED",
          deadlines: [{ label: "Papers", date: "2026-11-01", note: null }],
        }),
        createJournal({ id: "journal", acronym: "JOURNAL" }),
      ],
    },
    TODAY,
  );

  it("mentions the maintainer so they get notified", () => {
    expect(body.startsWith(`@${MAINTAINER} `)).toBe(true);
  });

  it("lists each venue in the section matching its status", () => {
    expect(body).toContain("### CfP not yet published (Unknown) (1)");
    expect(body).toContain("[UNKNOWN](https://example.org/)");
    expect(body).toContain("### Open calls closing within two months (1)");
    expect(body).toContain("[SOON](https://example.org/) (conference) — next: 2027-02-20");
    expect(body).toContain("### All deadlines passed (1)");
    expect(body).toContain("### Journals with rolling submission (1)");
  });
});
