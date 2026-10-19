// Tests for filtering and sorting venues.
import { describe, expect, it } from "vitest";
import { createEmptyCriteria, filterVenues, sortVenues } from "../src/Services/VenueFilter";
import { createJournal, createVenue } from "./Fixtures";

const TODAY = "2026-10-19";

const openVenue = createVenue({ id: "open", acronym: "B-OPEN", fields: ["ai"] });
const unknownVenue = createVenue({
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
const closedVenue = createVenue({
  id: "closed",
  acronym: "C-CLOSED",
  gameScope: "track",
  trackName: "Games",
  deadlines: [{ label: "Papers", date: "2026-09-01", note: null }],
  eventStart: "2027-01-10",
});
const all = [openVenue, unknownVenue, closedVenue];

describe("filterVenues", () => {
  it("returns everything for empty criteria", () => {
    expect(filterVenues(all, createEmptyCriteria(), TODAY)).toHaveLength(3);
  });

  it("filters by status, region and scope", () => {
    const byStatus = { ...createEmptyCriteria(), statuses: ["unknown" as const] };
    expect(filterVenues(all, byStatus, TODAY).map((c) => c.id)).toEqual(["unknown"]);
    const byRegion = { ...createEmptyCriteria(), regions: ["domestic" as const] };
    expect(filterVenues(all, byRegion, TODAY).map((c) => c.id)).toEqual(["unknown"]);
    const byScope = { ...createEmptyCriteria(), scopes: ["track" as const] };
    expect(filterVenues(all, byScope, TODAY).map((c) => c.id)).toEqual(["closed"]);
  });

  it("matches any of the selected fields", () => {
    const criteria = { ...createEmptyCriteria(), fields: ["education" as const, "ai" as const] };
    expect(filterVenues(all, criteria, TODAY).map((c) => c.id)).toEqual(["open", "unknown"]);
  });

  it("searches the Japanese name case-insensitively", () => {
    const criteria = { ...createEmptyCriteria(), keyword: "未定" };
    expect(filterVenues(all, criteria, TODAY).map((c) => c.id)).toEqual(["unknown"]);
  });
});

describe("favourites", () => {
  it("keeps only favourite ids when favoritesOnly is set", () => {
    const criteria = { ...createEmptyCriteria(), favoritesOnly: true };
    const favorites = new Set(["closed"]);
    expect(filterVenues(all, criteria, TODAY, favorites).map((c) => c.id)).toEqual(["closed"]);
    expect(filterVenues(all, criteria, TODAY)).toEqual([]);
  });

  it("ignores favourites when favoritesOnly is off", () => {
    expect(filterVenues(all, createEmptyCriteria(), TODAY, new Set(["closed"]))).toHaveLength(3);
  });
});

describe("venue type", () => {
  const journal = createJournal({ id: "journal", acronym: "D-JOURNAL" });

  it("filters journals", () => {
    const criteria = { ...createEmptyCriteria(), venueTypes: ["journal" as const] };
    expect(filterVenues([...all, journal], criteria, TODAY).map((c) => c.id)).toEqual(["journal"]);
  });

  it("orders rolling journals between open and closed calls", () => {
    expect(sortVenues([...all, journal], "deadline", TODAY).map((c) => c.id)).toEqual([
      "open",
      "journal",
      "closed",
      "unknown",
    ]);
  });
});

describe("sortVenues", () => {
  it("orders by deadline: open, then closed, then unknown", () => {
    expect(sortVenues(all, "deadline", TODAY).map((c) => c.id)).toEqual([
      "open",
      "closed",
      "unknown",
    ]);
  });

  it("orders by event date with unknown dates last", () => {
    expect(sortVenues(all, "event", TODAY).map((c) => c.id)).toEqual(["closed", "open", "unknown"]);
  });

  it("orders by name", () => {
    expect(sortVenues(all, "name", TODAY).map((c) => c.id)).toEqual(["unknown", "open", "closed"]);
  });
});
