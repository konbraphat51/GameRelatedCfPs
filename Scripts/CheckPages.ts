// CLI entry: `pnpm data:check` lists venues whose CfP page changed; `pnpm data:check --accept` records the reviewed state.
import { toIsoDate } from "../src/Services/DateUtility";
import type { VenueDataset } from "../src/Types/Venue";
import {
  DATASET_PATH,
  PENDING_SNAPSHOTS_PATH,
  SNAPSHOTS_PATH,
  readJsonFile,
  readJsonFileOr,
  writeJsonFile,
} from "./JsonFile";
import { fetchPage } from "./PageFetcher";
import {
  checkPages,
  mergeSnapshots,
  type PageCheckResult,
  type PageSnapshots,
} from "./PageWatcher";
import { selectVenues } from "./VenueDigest";

// Year whose CfPs the dataset tracks.
const TARGET_YEAR = "2027";

// Review order: unknown first, open last.
const STATUS_PRIORITY = ["unknown", "closed", "rolling", "open"];

/** Fetches pages, stores the results as pending and prints those that need review. */
async function runCheck(ids: string[], showAll: boolean): Promise<void> {
  const dataset = await readJsonFile<VenueDataset>(DATASET_PATH);
  const { selected, missing } = selectVenues(dataset.venues, ids);
  if (missing.length > 0) {
    throw new Error(`Unknown id(s): ${missing.join(", ")}`);
  }
  const snapshots = await readJsonFileOr<PageSnapshots>(SNAPSHOTS_PATH, {});
  const results = await checkPages(
    selected,
    snapshots,
    fetchPage,
    toIsoDate(new Date()),
    TARGET_YEAR,
  );
  await writeJsonFile(PENDING_SNAPSHOTS_PATH, results);

  const shown = results
    .filter((result) => showAll || result.change !== "unchanged")
    .sort(
      (a, b) =>
        STATUS_PRIORITY.indexOf(a.status) - STATUS_PRIORITY.indexOf(b.status) ||
        a.id.localeCompare(b.id),
    );
  console.log("# status\tchange\tid\tdetail\turl");
  shown.forEach((r) => console.log([r.status, r.change, r.id, r.detail, r.url].join("\t")));

  const counts = new Map<string, number>();
  results.forEach((r) => counts.set(r.change, (counts.get(r.change) ?? 0) + 1));
  const summary = [...counts].map(([change, count]) => `${change} ${count}`).join(", ");
  console.log(
    `\n# ${results.length} venue(s): ${summary}. Review the rows above, then run --accept.`,
  );
}

/** Moves pending snapshots (all, or only `ids`) into the accepted snapshot file. */
async function runAccept(ids: string[]): Promise<void> {
  const pending = await readJsonFileOr<PageCheckResult[]>(PENDING_SNAPSHOTS_PATH, []);
  if (pending.length === 0) {
    throw new Error("No pending results; run pnpm data:check first.");
  }
  const accepted = ids.length === 0 ? pending : pending.filter((r) => ids.includes(r.id));
  const snapshots = await readJsonFileOr<PageSnapshots>(SNAPSHOTS_PATH, {});
  await writeJsonFile(SNAPSHOTS_PATH, mergeSnapshots(snapshots, accepted));
  console.log(`Accepted ${accepted.filter((r) => r.snapshot).length} page snapshot(s).`);
}

const args = process.argv.slice(2);
const ids = args.filter((arg) => !arg.startsWith("--"));
try {
  if (args.includes("--accept")) {
    await runAccept(ids);
  } else {
    await runCheck(ids, args.includes("--all"));
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
