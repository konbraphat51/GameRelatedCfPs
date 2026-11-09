// Applies small JSON patches to the dataset so maintainers never need to load or hand-edit the whole file.
import { validateVenues } from "../src/Services/VenueValidator";
import type { Venue, VenueDataset } from "../src/Types/Venue";

/** One researched-but-excluded series, kept so discovery does not research it again. */
export interface ExcludedSeries {
  /** Display name of the series, conference or journal. */
  name: string;
  venueType: "conference" | "journal";
  /** Why it is not listed. */
  reason: string;
  /** True when the reason may change (e.g. dormant series), so discovery should glance at it again. */
  recheck: boolean;
}

/** Root object of Maintenance/Excluded.json. */
export interface ExcludedList {
  series: ExcludedSeries[];
}

/** A change set written by a maintainer or an agent. */
export interface VenuePatch {
  /** New research date for the dataset. */
  lastUpdated?: string;
  /** Partial records merged into existing ids, or complete records for new ids. */
  upsert?: Array<Partial<Venue> & { id: string }>;
  /** Ids to delete (e.g. a cancelled edition). */
  remove?: string[];
  /** Series to append to the excluded list. */
  exclude?: ExcludedSeries[];
}

/** Outcome of applying patches; nothing should be written when `problems` is non-empty. */
export interface PatchResult {
  dataset: VenueDataset;
  excluded: ExcludedList;
  problems: string[];
  /** One human-readable line per change. */
  changes: string[];
}

/** Every key of a venue record; new records must provide all of them. */
export const VENUE_KEYS: readonly (keyof Venue)[] = [
  "id",
  "acronym",
  "nameEn",
  "nameJa",
  "organizer",
  "region",
  "venueType",
  "gameScope",
  "trackName",
  "fields",
  "url",
  "cfpUrl",
  "eventStart",
  "eventEnd",
  "eventDateText",
  "location",
  "rollingSubmission",
  "cfpPublished",
  "deadlines",
  "pastPatternEn",
  "pastPatternJa",
  "notesEn",
  "notesJa",
  "sources",
];

/** Returns keys of `record` that are not venue keys. */
function findUnknownKeys(record: object): string[] {
  return Object.keys(record).filter((key) => !VENUE_KEYS.includes(key as keyof Venue));
}

/** Merges a partial record into an existing one; `sources` are unioned instead of replaced. */
function mergeVenue(existing: Venue, partial: Partial<Venue>): Venue {
  const merged = { ...existing, ...partial };
  merged.sources = [...new Set([...existing.sources, ...(partial.sources ?? [])])];
  return merged;
}

/** Applies `patches` in order to copies of the dataset and the excluded list. */
export function applyVenuePatches(
  dataset: VenueDataset,
  excluded: ExcludedList,
  patches: readonly VenuePatch[],
): PatchResult {
  const venues = new Map(dataset.venues.map((venue) => [venue.id, venue]));
  const series = [...excluded.series];
  const problems: string[] = [];
  const changes: string[] = [];
  let lastUpdated = dataset.lastUpdated;

  for (const patch of patches) {
    for (const partial of patch.upsert ?? []) {
      const unknownKeys = findUnknownKeys(partial);
      if (unknownKeys.length > 0) {
        problems.push(`${partial.id}: unknown keys ${unknownKeys.join(", ")}`);
        continue;
      }
      const existing = venues.get(partial.id);
      if (existing) {
        venues.set(partial.id, mergeVenue(existing, partial));
        const keys = Object.keys(partial).filter((key) => key !== "id");
        changes.push(`updated ${partial.id}: ${keys.join(", ")}`);
        continue;
      }
      const missingKeys = VENUE_KEYS.filter((key) => !(key in partial));
      if (missingKeys.length > 0) {
        problems.push(`${partial.id}: new record lacks ${missingKeys.join(", ")}`);
        continue;
      }
      venues.set(partial.id, partial as Venue);
      changes.push(`added ${partial.id}`);
    }
    for (const id of patch.remove ?? []) {
      if (venues.delete(id)) {
        changes.push(`removed ${id}`);
      } else {
        problems.push(`${id}: cannot remove an unknown id`);
      }
    }
    for (const entry of patch.exclude ?? []) {
      if (series.some((existing) => existing.name === entry.name)) {
        problems.push(`${entry.name}: already in the excluded list`);
        continue;
      }
      series.push(entry);
      changes.push(`excluded ${entry.name}`);
    }
    lastUpdated = patch.lastUpdated ?? lastUpdated;
  }

  const sortedVenues = [...venues.values()].sort((a, b) => a.id.localeCompare(b.id));
  problems.push(...validateVenues(sortedVenues));
  if (lastUpdated !== dataset.lastUpdated) {
    changes.push(`lastUpdated ${dataset.lastUpdated} -> ${lastUpdated}`);
  }
  return {
    dataset: { lastUpdated, venues: sortedVenues },
    excluded: { series },
    problems,
    changes,
  };
}
