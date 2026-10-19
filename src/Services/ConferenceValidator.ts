// Validates conference records so data mistakes are caught by tests rather than in the UI.
import { FIELD_VALUES, type Conference } from "../Types/Conference";
import { isValidIsoDate } from "./DateUtility";

/** Returns human-readable problems found in one conference record (empty when valid). */
export function validateConference(conference: Conference): string[] {
  const problems: string[] = [];
  const report = (message: string): void => {
    problems.push(`${conference.id}: ${message}`);
  };

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(conference.id)) {
    report("id must be kebab-case ASCII");
  }
  if (!["domestic", "international"].includes(conference.region)) {
    report(`invalid region "${conference.region}"`);
  }
  if (!["whole", "track"].includes(conference.gameScope)) {
    report(`invalid gameScope "${conference.gameScope}"`);
  }
  if (conference.gameScope === "track" && !conference.trackName) {
    report("trackName is required when gameScope is track");
  }
  for (const field of conference.fields) {
    if (!FIELD_VALUES.includes(field)) {
      report(`unknown field "${field}"`);
    }
  }
  if (!/^https?:\/\//.test(conference.url)) {
    report("url must be absolute");
  }
  for (const field of ["eventStart", "eventEnd"] as const) {
    const value = conference[field];
    if (value !== null && !isValidIsoDate(value)) {
      report(`${field} is not an ISO date`);
    }
  }
  if (conference.eventStart && conference.eventEnd && conference.eventEnd < conference.eventStart) {
    report("eventEnd is before eventStart");
  }
  if (conference.cfpPublished && conference.deadlines.length === 0) {
    report("cfpPublished requires at least one deadline");
  }
  for (const deadline of conference.deadlines) {
    if (!isValidIsoDate(deadline.date)) {
      report(`deadline "${deadline.label}" has invalid date "${deadline.date}"`);
    }
  }
  if (conference.sources.length === 0) {
    report("at least one source is required");
  }
  return problems;
}

/** Returns problems across all records, including duplicated ids. */
export function validateConferences(conferences: readonly Conference[]): string[] {
  const seenIds = new Set<string>();
  const problems: string[] = [];
  for (const conference of conferences) {
    if (seenIds.has(conference.id)) {
      problems.push(`${conference.id}: duplicated id`);
    }
    seenIds.add(conference.id);
    problems.push(...validateConference(conference));
  }
  return problems;
}
