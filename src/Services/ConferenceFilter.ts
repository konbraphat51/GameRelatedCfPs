// Filtering and sorting of conferences according to the user's criteria.
import type { CfpStatus } from "../Types/CfpStatus";
import type { Conference, GameScope, Region, Field } from "../Types/Conference";
import { findNextDeadline, resolveCfpStatus } from "./CfpStatusResolver";

/** Available orderings of the conference list. */
export type SortKey = "deadline" | "event" | "name";

/** User-selected filter criteria; empty arrays mean "no restriction". */
export interface FilterCriteria {
  keyword: string;
  regions: Region[];
  statuses: CfpStatus[];
  scopes: GameScope[];
  fields: Field[];
}

/** Returns criteria that match every conference. */
export function createEmptyCriteria(): FilterCriteria {
  return { keyword: "", regions: [], statuses: [], scopes: [], fields: [] };
}

/** Returns true when `selected` is empty or contains `value`. */
function matchesSelection<T>(selected: readonly T[], value: T): boolean {
  return selected.length === 0 || selected.includes(value);
}

/** Returns true when any searchable text field contains the keyword (case-insensitive). */
function matchesKeyword(conference: Conference, keyword: string): boolean {
  const needle = keyword.trim().toLowerCase();
  if (needle === "") {
    return true;
  }
  const haystack = [
    conference.acronym,
    conference.nameEn,
    conference.nameJa,
    conference.organizer,
    conference.trackName,
    conference.location,
  ]
    .filter((text): text is string => text !== null)
    .join("\n")
    .toLowerCase();
  return haystack.includes(needle);
}

/** Returns the conferences that satisfy every criterion. */
export function filterConferences(
  conferences: readonly Conference[],
  criteria: FilterCriteria,
  todayIso: string,
): Conference[] {
  return conferences.filter(
    (conference) =>
      matchesKeyword(conference, criteria.keyword) &&
      matchesSelection(criteria.regions, conference.region) &&
      matchesSelection(criteria.statuses, resolveCfpStatus(conference, todayIso)) &&
      matchesSelection(criteria.scopes, conference.gameScope) &&
      (criteria.fields.length === 0 ||
        criteria.fields.some((field) => conference.fields.includes(field))),
  );
}

// Sorts missing dates after present ones, then by acronym for stability.
const FAR_FUTURE_ISO = "9999-12-31";

/** Returns the date used to order a conference under the deadline sort. */
function computeDeadlineSortValue(conference: Conference, todayIso: string): string {
  const status = resolveCfpStatus(conference, todayIso);
  if (status === "open") {
    return findNextDeadline(conference, todayIso)?.date ?? FAR_FUTURE_ISO;
  }
  // Closed calls go after open ones but before unknown ones.
  return status === "closed" ? "9999-01-01" : FAR_FUTURE_ISO;
}

/** Returns a new array of conferences ordered by the given key. */
export function sortConferences(
  conferences: readonly Conference[],
  sortKey: SortKey,
  todayIso: string,
): Conference[] {
  const valueOf = (conference: Conference): string => {
    switch (sortKey) {
      case "deadline":
        return computeDeadlineSortValue(conference, todayIso);
      case "event":
        return conference.eventStart ?? FAR_FUTURE_ISO;
      case "name":
        return conference.acronym.toLowerCase();
    }
  };
  return [...conferences].sort(
    (a, b) => valueOf(a).localeCompare(valueOf(b)) || a.acronym.localeCompare(b.acronym),
  );
}
