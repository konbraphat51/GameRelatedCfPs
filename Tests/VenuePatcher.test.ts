// Tests for applying maintenance patches to the dataset.
import { describe, expect, it } from "vitest";
import { applyVenuePatches, type ExcludedList } from "../Scripts/VenuePatcher";
import type { VenueDataset } from "../src/Types/Venue";
import { createVenue } from "./Fixtures";

const DATASET: VenueDataset = {
  lastUpdated: "2026-10-19",
  venues: [createVenue({ id: "beta-2027", sources: ["https://a.example/"] })],
};
const EXCLUDED: ExcludedList = { series: [] };

describe("applyVenuePatches", () => {
  it("merges partial records and unions sources", () => {
    const result = applyVenuePatches(DATASET, EXCLUDED, [
      { lastUpdated: "2026-12-01", upsert: [{ id: "beta-2027", sources: ["https://b.example/"] }] },
    ]);
    expect(result.problems).toEqual([]);
    expect(result.dataset.lastUpdated).toBe("2026-12-01");
    expect(result.dataset.venues[0]?.sources).toEqual(["https://a.example/", "https://b.example/"]);
  });

  it("adds complete new records sorted by id and rejects incomplete ones", () => {
    const added = applyVenuePatches(DATASET, EXCLUDED, [
      { upsert: [createVenue({ id: "alpha-2027" })] },
    ]);
    expect(added.dataset.venues.map((venue) => venue.id)).toEqual(["alpha-2027", "beta-2027"]);
    const rejected = applyVenuePatches(DATASET, EXCLUDED, [{ upsert: [{ id: "gamma-2027" }] }]);
    expect(rejected.problems[0]).toMatch(/^gamma-2027: new record lacks/);
  });

  it("rejects new records whose CfP page an existing record already cites", () => {
    const cfpUrl = "https://a.example/special-issue";
    const dataset = { ...DATASET, venues: [createVenue({ id: "beta-2027", sources: [cfpUrl] })] };
    const result = applyVenuePatches(dataset, EXCLUDED, [
      { upsert: [createVenue({ id: "alpha-2027", cfpUrl })] },
    ]);
    expect(result.problems).toEqual([
      "alpha-2027: its CfP page is already used by beta-2027 (duplicate?)",
    ]);
  });

  it("rejects unknown keys, unknown removals and invalid results", () => {
    const result = applyVenuePatches(DATASET, EXCLUDED, [
      {
        upsert: [{ id: "beta-2027", typo: 1 } as never, { id: "beta-2027", deadlines: [] }],
        remove: ["missing"],
      },
    ]);
    expect(result.problems).toEqual([
      "beta-2027: unknown keys typo",
      "missing: cannot remove an unknown id",
      "beta-2027: cfpPublished requires a deadline or rolling submission",
    ]);
  });

  it("appends excluded series once", () => {
    const entry = { name: "X", venueType: "conference" as const, reason: "r", recheck: false };
    const result = applyVenuePatches(DATASET, EXCLUDED, [
      { exclude: [entry] },
      { exclude: [entry] },
    ]);
    expect(result.excluded.series).toEqual([entry]);
    expect(result.problems).toEqual(["X: already in the excluded list"]);
  });
});
