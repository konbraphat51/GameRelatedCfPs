// Tests for the compact dataset views used during maintenance.
import { describe, expect, it } from "vitest";
import { formatExcludedSeries, formatKnownVenues, selectVenues } from "../Scripts/VenueDigest";
import { createJournal, createVenue } from "./Fixtures";

const VENUES = [createVenue(), createJournal({ id: "journal", trackName: "Play" })];

describe("selectVenues", () => {
  it("returns requested ids in order and reports missing ones", () => {
    const { selected, missing } = selectVenues(VENUES, ["journal", "nope"]);
    expect(selected.map((venue) => venue.id)).toEqual(["journal"]);
    expect(missing).toEqual(["nope"]);
  });
});

describe("formatKnownVenues", () => {
  it("prints id, type, status, next deadline, acronym, name and host", () => {
    const [line] = formatKnownVenues(VENUES, "2027-01-01");
    expect(line).toBe(
      "sample-2027\tconference\topen\t2027-02-20\tSAMPLE 2027\tSample Venue on Games\texample.org",
    );
  });
});

describe("formatExcludedSeries", () => {
  it("prints the recheck flag", () => {
    const lines = formatExcludedSeries([
      { name: "X", venueType: "journal", reason: "ceased", recheck: false },
    ]);
    expect(lines).toEqual(["journal\tfinal\tX\tceased"]);
  });
});
