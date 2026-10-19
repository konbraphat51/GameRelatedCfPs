// Filtering and sorting of venues according to the user's criteria.
import type { CfpStatus } from "../Types/CfpStatus";
import type { Field, GameScope, Region, Venue, VenueType } from "../Types/Venue";
import { findNextDeadline, resolveCfpStatus } from "./CfpStatusResolver";

/** Available orderings of the venue list. */
export type SortKey = "deadline" | "event" | "name";

/** User-selected filter criteria; empty arrays mean "no restriction". */
export interface FilterCriteria {
  keyword: string;
  venueTypes: VenueType[];
  regions: Region[];
  statuses: CfpStatus[];
  scopes: GameScope[];
  fields: Field[];
}

/** Returns criteria that match every venue. */
export function createEmptyCriteria(): FilterCriteria {
  return { keyword: "", venueTypes: [], regions: [], statuses: [], scopes: [], fields: [] };
}

/** Returns true when `selected` is empty or contains `value`. */
function matchesSelection<T>(selected: readonly T[], value: T): boolean {
  return selected.length === 0 || selected.includes(value);
}

/** Returns true when any searchable text field contains the keyword (case-insensitive). */
function matchesKeyword(venue: Venue, keyword: string): boolean {
  const needle = keyword.trim().toLowerCase();
  if (needle === "") {
    return true;
  }
  const haystack = [
    venue.acronym,
    venue.nameEn,
    venue.nameJa,
    venue.organizer,
    venue.trackName,
    venue.location,
  ]
    .filter((text): text is string => text !== null)
    .join("\n")
    .toLowerCase();
  return haystack.includes(needle);
}

/** Returns the venues that satisfy every criterion. */
export function filterVenues(
  venues: readonly Venue[],
  criteria: FilterCriteria,
  todayIso: string,
): Venue[] {
  return venues.filter(
    (venue) =>
      matchesKeyword(venue, criteria.keyword) &&
      matchesSelection(criteria.venueTypes, venue.venueType) &&
      matchesSelection(criteria.regions, venue.region) &&
      matchesSelection(criteria.statuses, resolveCfpStatus(venue, todayIso)) &&
      matchesSelection(criteria.scopes, venue.gameScope) &&
      (criteria.fields.length === 0 ||
        criteria.fields.some((field) => venue.fields.includes(field))),
  );
}

// Sorts missing dates after present ones, then by acronym for stability.
const FAR_FUTURE_ISO = "9999-12-31";

// Non-open statuses sort after every real date, in this order.
const STATUS_SORT_VALUES: Record<Exclude<CfpStatus, "open">, string> = {
  rolling: "9999-01-01",
  closed: "9999-06-01",
  unknown: FAR_FUTURE_ISO,
};

/** Returns the value used to order a venue under the deadline sort. */
function computeDeadlineSortValue(venue: Venue, todayIso: string): string {
  const status = resolveCfpStatus(venue, todayIso);
  if (status === "open") {
    return findNextDeadline(venue, todayIso)?.date ?? FAR_FUTURE_ISO;
  }
  return STATUS_SORT_VALUES[status];
}

/** Returns a new array of venues ordered by the given key. */
export function sortVenues(venues: readonly Venue[], sortKey: SortKey, todayIso: string): Venue[] {
  const valueOf = (venue: Venue): string => {
    switch (sortKey) {
      case "deadline":
        return computeDeadlineSortValue(venue, todayIso);
      case "event":
        return venue.eventStart ?? FAR_FUTURE_ISO;
      case "name":
        return venue.acronym.toLowerCase();
    }
  };
  return [...venues].sort(
    (a, b) => valueOf(a).localeCompare(valueOf(b)) || a.acronym.localeCompare(b.acronym),
  );
}
