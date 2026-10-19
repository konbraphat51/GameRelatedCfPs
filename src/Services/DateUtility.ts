// Pure helpers for ISO (YYYY-MM-DD) calendar dates, which compare correctly as strings.

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/** Matches a strict ISO calendar date (YYYY-MM-DD). */
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Returns the given local date as an ISO date string. */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Returns true when the string is a real ISO calendar date. */
export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

/** Counts whole days from `fromIso` to `toIso` (negative when `toIso` is earlier). */
export function countDaysBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(`${fromIso}T00:00:00Z`);
  const to = Date.parse(`${toIso}T00:00:00Z`);
  return Math.round((to - from) / MILLISECONDS_PER_DAY);
}

/** Formats an ISO date for display in the given BCP 47 locale, e.g. "Feb 14, 2027". */
export function formatIsoDate(iso: string, locale: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

/** Formats an inclusive ISO date range, collapsing to one date when start equals end. */
export function formatIsoDateRange(
  startIso: string,
  endIso: string | null,
  locale: string,
): string {
  if (endIso === null || endIso === startIso) {
    return formatIsoDate(startIso, locale);
  }
  // Both ends are formatted separately because Intl.formatRange falls back to numeric dates in ja.
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const start = formatter.format(new Date(`${startIso}T00:00:00Z`));
  const end = formatter.format(new Date(`${endIso}T00:00:00Z`));
  return `${start} – ${end}`;
}
