// Formats compact, token-cheap views of the dataset for maintainers and agents.
import { findNextDeadline, resolveCfpStatus } from "../src/Services/CfpStatusResolver";
import type { CfpStatus } from "../src/Types/CfpStatus";
import type { Venue } from "../src/Types/Venue";
import type { ExcludedSeries } from "./VenuePatcher";

/** Returns the host name of `url`, or the raw string when it cannot be parsed. */
function extractHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** Returns the venues whose id is in `ids` (all venues when `ids` is empty) plus the ids not found. */
export function selectVenues(
  venues: readonly Venue[],
  ids: readonly string[],
): { selected: Venue[]; missing: string[] } {
  if (ids.length === 0) {
    return { selected: [...venues], missing: [] };
  }
  const byId = new Map(venues.map((venue) => [venue.id, venue]));
  const selected = ids.flatMap((id) => byId.get(id) ?? []);
  return { selected, missing: ids.filter((id) => !byId.has(id)) };
}

/** Returns one tab-separated line per venue: id, type, status, next deadline, acronym, name, host. */
export function formatKnownVenues(venues: readonly Venue[], todayIso: string): string[] {
  return venues.map((venue) => {
    const status: CfpStatus = resolveCfpStatus(venue, todayIso);
    const next = findNextDeadline(venue, todayIso)?.date ?? "-";
    const name = venue.trackName ? `${venue.nameEn} / ${venue.trackName}` : venue.nameEn;
    return [venue.id, venue.venueType, status, next, venue.acronym, name, extractHost(venue.url)]
      .join("\t")
      .replace(/\s*\n\s*/g, " ");
  });
}

/** Returns one tab-separated line per excluded series: type, recheck flag, name, reason. */
export function formatExcludedSeries(series: readonly ExcludedSeries[]): string[] {
  return series.map((entry) =>
    [entry.venueType, entry.recheck ? "recheck" : "final", entry.name, entry.reason].join("\t"),
  );
}
