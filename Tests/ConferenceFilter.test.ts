// Tests for filtering and sorting conferences.
import { describe, expect, it } from "vitest";
import {
  createEmptyCriteria,
  filterConferences,
  sortConferences,
} from "../src/Services/ConferenceFilter";
import { createConference } from "./Fixtures";

const TODAY = "2026-10-19";

const openConference = createConference({ id: "open", acronym: "B-OPEN", fields: ["ai"] });
const unknownConference = createConference({
  id: "unknown",
  acronym: "A-UNKNOWN",
  nameJa: "未定学会",
  region: "domestic",
  cfpPublished: false,
  deadlines: [],
  eventStart: null,
  eventEnd: null,
  fields: ["game-studies", "education"],
});
const closedConference = createConference({
  id: "closed",
  acronym: "C-CLOSED",
  gameScope: "track",
  trackName: "Games",
  deadlines: [{ label: "Papers", date: "2026-09-01", note: null }],
  eventStart: "2027-01-10",
});
const all = [openConference, unknownConference, closedConference];

describe("filterConferences", () => {
  it("returns everything for empty criteria", () => {
    expect(filterConferences(all, createEmptyCriteria(), TODAY)).toHaveLength(3);
  });

  it("filters by status, region and scope", () => {
    const byStatus = { ...createEmptyCriteria(), statuses: ["unknown" as const] };
    expect(filterConferences(all, byStatus, TODAY).map((c) => c.id)).toEqual(["unknown"]);
    const byRegion = { ...createEmptyCriteria(), regions: ["domestic" as const] };
    expect(filterConferences(all, byRegion, TODAY).map((c) => c.id)).toEqual(["unknown"]);
    const byScope = { ...createEmptyCriteria(), scopes: ["track" as const] };
    expect(filterConferences(all, byScope, TODAY).map((c) => c.id)).toEqual(["closed"]);
  });

  it("matches any of the selected fields", () => {
    const criteria = { ...createEmptyCriteria(), fields: ["education" as const, "ai" as const] };
    expect(filterConferences(all, criteria, TODAY).map((c) => c.id)).toEqual(["open", "unknown"]);
  });

  it("searches the Japanese name case-insensitively", () => {
    const criteria = { ...createEmptyCriteria(), keyword: "未定" };
    expect(filterConferences(all, criteria, TODAY).map((c) => c.id)).toEqual(["unknown"]);
  });
});

describe("sortConferences", () => {
  it("orders by deadline: open, then closed, then unknown", () => {
    expect(sortConferences(all, "deadline", TODAY).map((c) => c.id)).toEqual([
      "open",
      "closed",
      "unknown",
    ]);
  });

  it("orders by event date with unknown dates last", () => {
    expect(sortConferences(all, "event", TODAY).map((c) => c.id)).toEqual([
      "closed",
      "open",
      "unknown",
    ]);
  });

  it("orders by name", () => {
    expect(sortConferences(all, "name", TODAY).map((c) => c.id)).toEqual([
      "unknown",
      "open",
      "closed",
    ]);
  });
});
