// Shared test fixtures for conference records.
import type { Conference } from "../src/Types/Conference";

/** Returns a valid conference record, optionally overriding fields. */
export function createConference(overrides: Partial<Conference> = {}): Conference {
  return {
    id: "sample-2027",
    acronym: "SAMPLE 2027",
    nameEn: "Sample Conference on Games",
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
