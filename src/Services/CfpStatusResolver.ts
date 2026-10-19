// Derives CfP status and upcoming deadlines of a conference relative to a reference date.
import type { CfpStatus } from "../Types/CfpStatus";
import type { Conference, Deadline } from "../Types/Conference";

/** Returns deadlines sorted chronologically (stable for equal dates). */
export function sortDeadlines(deadlines: readonly Deadline[]): Deadline[] {
  return [...deadlines].sort((a, b) => a.date.localeCompare(b.date));
}

/** Returns the earliest deadline on or after `todayIso`, or null when none remains. */
export function findNextDeadline(conference: Conference, todayIso: string): Deadline | null {
  return sortDeadlines(conference.deadlines).find((deadline) => deadline.date >= todayIso) ?? null;
}

/** Returns true when the deadline date is strictly before `todayIso`. */
export function isDeadlinePassed(deadline: Deadline, todayIso: string): boolean {
  return deadline.date < todayIso;
}

/** Resolves the CfP status: unpublished CfPs are "unknown", otherwise open/closed by deadlines. */
export function resolveCfpStatus(conference: Conference, todayIso: string): CfpStatus {
  if (!conference.cfpPublished || conference.deadlines.length === 0) {
    return "unknown";
  }
  return findNextDeadline(conference, todayIso) === null ? "closed" : "open";
}
