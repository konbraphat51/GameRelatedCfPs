// Validates venue records so data mistakes are caught by tests rather than in the UI.
import { FIELD_VALUES, type Venue } from "../Types/Venue";
import { isValidIsoDate } from "./DateUtility";

/** Returns human-readable problems found in one venue record (empty when valid). */
export function validateVenue(venue: Venue): string[] {
  const problems: string[] = [];
  const report = (message: string): void => {
    problems.push(`${venue.id}: ${message}`);
  };

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(venue.id)) {
    report("id must be kebab-case ASCII");
  }
  if (!["domestic", "international"].includes(venue.region)) {
    report(`invalid region "${venue.region}"`);
  }
  if (!["whole", "track"].includes(venue.gameScope)) {
    report(`invalid gameScope "${venue.gameScope}"`);
  }
  if (venue.gameScope === "track" && !venue.trackName) {
    report("trackName is required when gameScope is track");
  }
  for (const field of venue.fields) {
    if (!FIELD_VALUES.includes(field)) {
      report(`unknown field "${field}"`);
    }
  }
  if (!/^https?:\/\//.test(venue.url)) {
    report("url must be absolute");
  }
  for (const field of ["eventStart", "eventEnd"] as const) {
    const value = venue[field];
    if (value !== null && !isValidIsoDate(value)) {
      report(`${field} is not an ISO date`);
    }
  }
  if (venue.eventStart && venue.eventEnd && venue.eventEnd < venue.eventStart) {
    report("eventEnd is before eventStart");
  }
  if (venue.cfpPublished && venue.deadlines.length === 0) {
    report("cfpPublished requires at least one deadline");
  }
  for (const deadline of venue.deadlines) {
    if (!isValidIsoDate(deadline.date)) {
      report(`deadline "${deadline.label}" has invalid date "${deadline.date}"`);
    }
  }
  if (venue.sources.length === 0) {
    report("at least one source is required");
  }
  return problems;
}

/** Returns problems across all records, including duplicated ids. */
export function validateVenues(venues: readonly Venue[]): string[] {
  const seenIds = new Set<string>();
  const problems: string[] = [];
  for (const venue of venues) {
    if (seenIds.has(venue.id)) {
      problems.push(`${venue.id}: duplicated id`);
    }
    seenIds.add(venue.id);
    problems.push(...validateVenue(venue));
  }
  return problems;
}
