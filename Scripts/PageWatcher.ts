// Detects which venues' CfP pages changed since their data was last verified, so only those need an LLM review.
import { resolveCfpStatus } from "../src/Services/CfpStatusResolver";
import type { CfpStatus } from "../src/Types/CfpStatus";
import type { Venue } from "../src/Types/Venue";
import { countDaysBetween } from "../src/Services/DateUtility";
import { extractSignalLines, hashLines } from "./PageSignal";

/** Fingerprint of a page's CfP-relevant text at the time its data was verified. */
export interface PageSnapshot {
  hash: string;
  lineCount: number;
  /** ISO date when this content was last reviewed (kept while the page stays unchanged). */
  checkedAt: string;
}

/** Snapshots keyed by URL. */
export type PageSnapshots = Record<string, PageSnapshot>;

/**
 * "unchanged": same text as the accepted snapshot; "changed": text differs; "new": no snapshot yet;
 * "stale": unchanged but not reviewed for too long; "thin": too little text to judge
 * (script-rendered or blocked page); "error": fetch failed.
 */
export type PageChange = "unchanged" | "changed" | "new" | "stale" | "thin" | "error";

/** Result for one venue. */
export interface PageCheckResult {
  id: string;
  status: CfpStatus;
  url: string;
  change: PageChange;
  /** Error message, or the number of lines mentioning the target year. */
  detail: string;
  /** Snapshot to accept once the venue has been reviewed (null on error). */
  snapshot: PageSnapshot | null;
}

/** A downloaded page: HTML text, or the content hash of a binary document such as a PDF. */
export type FetchedPage = { html: string } | { binaryHash: string };

/** Downloads a page; throws on failure. */
export type PageFetcher = (url: string) => Promise<FetchedPage>;

/** Pages with fewer CfP-relevant lines than this are reported as "thin". */
export const MIN_SIGNAL_LINES = 3;

/** Unchanged pages are reviewed anyway once their last review is older than this. */
export const MAX_REVIEW_AGE_DAYS = 180;

/** Returns the page to watch for a venue: its CfP page, else its website. */
export function selectWatchUrl(venue: Venue): string {
  return venue.cfpUrl ?? venue.url;
}

/** Returns the lines to fingerprint; a binary document is represented by its hash alone. */
function extractPageLines(page: FetchedPage): string[] {
  return "html" in page ? extractSignalLines(page.html) : [`document ${page.binaryHash}`];
}

/** Compares freshly extracted lines with the accepted snapshot. */
export function classifyPage(
  previous: PageSnapshot | undefined,
  lines: readonly string[],
  todayIso: string,
  minLines = MIN_SIGNAL_LINES,
): { change: PageChange; snapshot: PageSnapshot } {
  const snapshot = { hash: hashLines(lines), lineCount: lines.length, checkedAt: todayIso };
  if (lines.length < minLines) {
    return { change: "thin", snapshot };
  }
  if (!previous) {
    return { change: "new", snapshot };
  }
  if (previous.hash !== snapshot.hash) {
    return { change: "changed", snapshot };
  }
  if (countDaysBetween(previous.checkedAt, todayIso) > MAX_REVIEW_AGE_DAYS) {
    return { change: "stale", snapshot };
  }
  return { change: "unchanged", snapshot: previous };
}

/** Runs `task` over `items` with at most `limit` in flight, preserving order. */
async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array<R>(items.length);
  let nextIndex = 0;
  const worker = async (): Promise<void> => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await task(items[index] as T);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

/** Fetches every venue's watch URL once and classifies it against `snapshots`. */
export async function checkPages(
  venues: readonly Venue[],
  snapshots: PageSnapshots,
  fetcher: PageFetcher,
  todayIso: string,
  targetYear: string,
  concurrency = 8,
): Promise<PageCheckResult[]> {
  const urls = [...new Set(venues.map(selectWatchUrl))];
  const pages = await mapWithConcurrency(urls, concurrency, async (url) => {
    try {
      const fetched = await fetcher(url);
      return { url, lines: extractPageLines(fetched), isBinary: !("html" in fetched), error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { url, lines: [], isBinary: false, error: message };
    }
  });
  const pageByUrl = new Map(pages.map((page) => [page.url, page]));

  return venues.map((venue) => {
    const url = selectWatchUrl(venue);
    const page = pageByUrl.get(url);
    const status = resolveCfpStatus(venue, todayIso);
    if (!page || page.error !== null) {
      return {
        id: venue.id,
        status,
        url,
        change: "error",
        detail: page?.error ?? "",
        snapshot: null,
      };
    }
    const { change, snapshot } = classifyPage(
      snapshots[url],
      page.lines,
      todayIso,
      page.isBinary ? 1 : MIN_SIGNAL_LINES,
    );
    const yearLines = page.lines.filter((line) => line.includes(targetYear)).length;
    const detail = page.isBinary ? "binary document" : `${yearLines} line(s) with ${targetYear}`;
    return {
      id: venue.id,
      status,
      url,
      change,
      detail,
      snapshot,
    };
  });
}

/** Returns snapshots updated with every successfully fetched page in `results`. */
export function mergeSnapshots(
  previous: PageSnapshots,
  results: readonly PageCheckResult[],
): PageSnapshots {
  const merged: PageSnapshots = { ...previous };
  for (const result of results) {
    if (result.snapshot) {
      merged[result.url] = result.snapshot;
    }
  }
  return Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
}
