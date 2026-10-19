// Tests for CfP status derivation.
import { describe, expect, it } from "vitest";
import { findNextDeadline, resolveCfpStatus } from "../src/Services/CfpStatusResolver";
import { createVenue } from "./Fixtures";

describe("resolveCfpStatus", () => {
  it("returns unknown when the CfP is not published", () => {
    const venue = createVenue({ cfpPublished: false, deadlines: [] });
    expect(resolveCfpStatus(venue, "2026-10-19")).toBe("unknown");
  });

  it("returns open while a deadline remains, including on the deadline day", () => {
    expect(resolveCfpStatus(createVenue(), "2027-03-01")).toBe("open");
  });

  it("returns closed after the last deadline", () => {
    expect(resolveCfpStatus(createVenue(), "2027-03-02")).toBe("closed");
  });
});

describe("findNextDeadline", () => {
  it("picks the earliest upcoming deadline regardless of input order", () => {
    expect(findNextDeadline(createVenue(), "2026-10-19")?.label).toBe("Abstracts");
    expect(findNextDeadline(createVenue(), "2027-02-21")?.label).toBe("Full papers");
  });
});
