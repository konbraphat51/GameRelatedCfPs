// Builds the Markdown body of the periodic "data update" GitHub issue from the dataset.
import { findNextDeadline, resolveCfpStatus } from "../src/Services/CfpStatusResolver";
import { countDaysBetween } from "../src/Services/DateUtility";
import type { Venue, VenueDataset } from "../src/Types/Venue";

/** GitHub account notified by the issue. */
export const MAINTAINER = "konbraphat51";

// Open calls closing within this many days are highlighted.
const SOON_DAYS = 62;

/** Returns one checklist line linking to the venue's CfP page (or website). */
function formatVenueLine(venue: Venue, suffix = ""): string {
  const kind = venue.venueType === "journal" ? "journal" : "conference";
  return `- [ ] [${venue.acronym}](${venue.cfpUrl ?? venue.url}) (${kind})${suffix}`;
}

/** Returns a Markdown section, or nothing when there are no lines. */
function formatSection(title: string, hint: string, lines: string[]): string[] {
  if (lines.length === 0) {
    return [];
  }
  return [`### ${title} (${lines.length})`, "", hint, "", ...lines, ""];
}

/** Builds the issue body listing what to re-check as of `todayIso`. */
export function buildUpdateIssueBody(dataset: VenueDataset, todayIso: string): string {
  const byAcronym = [...dataset.venues].sort((a, b) => a.acronym.localeCompare(b.acronym));
  const unknown = byAcronym.filter((venue) => resolveCfpStatus(venue, todayIso) === "unknown");
  const closed = byAcronym.filter((venue) => resolveCfpStatus(venue, todayIso) === "closed");
  const rolling = byAcronym.filter((venue) => resolveCfpStatus(venue, todayIso) === "rolling");
  const closingSoon = byAcronym
    .map((venue) => ({ venue, next: findNextDeadline(venue, todayIso) }))
    .filter(
      ({ venue, next }) =>
        resolveCfpStatus(venue, todayIso) === "open" &&
        next !== null &&
        countDaysBetween(todayIso, next.date) <= SOON_DAYS,
    );

  return [
    `@${MAINTAINER} It is time for the bimonthly data update (dataset last researched: ${dataset.lastUpdated}).`,
    "",
    "Update `src/Data/Venues.json` following [Docs/DataGuide.md](../blob/main/Docs/DataGuide.md), set `lastUpdated`, run `pnpm test`, and close this issue with the commit.",
    "",
    ...formatSection(
      "CfP not yet published (Unknown)",
      "Check whether the 2027 call, dates or venue have been announced.",
      unknown.map((venue) => formatVenueLine(venue)),
    ),
    ...formatSection(
      "Open calls closing within two months",
      "Check for deadline extensions or additional calls.",
      closingSoon.map(({ venue, next }) => formatVenueLine(venue, ` — next: ${next?.date ?? ""}`)),
    ),
    ...formatSection(
      "All deadlines passed",
      "Check for late-breaking/poster calls, and replace past special issues with new ones.",
      closed.map((venue) => formatVenueLine(venue)),
    ),
    ...formatSection(
      "Journals with rolling submission",
      "Check for new special-issue calls.",
      rolling.map((venue) => formatVenueLine(venue)),
    ),
    "### Discovery",
    "",
    "- [ ] Search for new game-related conferences, journals and special issues not yet listed",
    "- [ ] Re-check excluded series in the latest `ResearchNotes/` file",
    "",
  ].join("\n");
}
