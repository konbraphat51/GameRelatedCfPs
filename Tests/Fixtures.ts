// Shared test fixtures for venue records.
import type { Venue } from "../src/Types/Venue";

/** Returns a valid venue record, optionally overriding fields. */
export function createVenue(overrides: Partial<Venue> = {}): Venue {
  return {
    id: "sample-2027",
    acronym: "SAMPLE 2027",
    nameEn: "Sample Venue on Games",
    nameJa: null,
    organizer: "Sample Society",
    region: "international",
    gameScope: "whole",
    trackName: null,
    fields: ["hci"],
    url: "https://example.org/",
    cfpUrl: null,
    eventStart: "2027-10-01",
    eventEnd: "2027-10-03",
    eventDateText: null,
    location: "Tokyo, Japan",
    cfpPublished: true,
    deadlines: [
      { label: "Full papers", date: "2027-03-01", note: "AoE" },
      { label: "Abstracts", date: "2027-02-20", note: null },
    ],
    pastPatternEn: null,
    pastPatternJa: null,
    notesEn: null,
    notesJa: null,
    sources: ["https://example.org/cfp"],
    ...overrides,
  };
}
