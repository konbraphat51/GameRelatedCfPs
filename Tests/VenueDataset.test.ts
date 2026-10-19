// Integrity checks for the bundled dataset and the validator itself.
import { describe, expect, it } from "vitest";
import { loadVenueDataset } from "../src/Services/VenueRepository";
import { validateVenue, validateVenues } from "../src/Services/VenueValidator";
import { isValidIsoDate } from "../src/Services/DateUtility";
import { createVenue } from "./Fixtures";

describe("Venues.json", () => {
  const dataset = loadVenueDataset();

  it("has a valid lastUpdated date", () => {
    expect(isValidIsoDate(dataset.lastUpdated)).toBe(true);
  });

  it("contains only valid records", () => {
    expect(validateVenues(dataset.venues)).toEqual([]);
  });
});

describe("validateVenue", () => {
  it("accepts the fixture", () => {
    expect(validateVenue(createVenue())).toEqual([]);
  });

  it("requires a track name for track-scoped venues", () => {
    expect(validateVenue(createVenue({ gameScope: "track" }))).toHaveLength(1);
  });

  it("requires deadlines when the CfP is published", () => {
    expect(validateVenue(createVenue({ deadlines: [] }))).toHaveLength(1);
  });

  it("detects duplicated ids", () => {
    const record = createVenue();
    expect(validateVenues([record, record])).toContain("sample-2027: duplicated id");
  });
});
