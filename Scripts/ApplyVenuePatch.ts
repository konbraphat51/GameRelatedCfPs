// CLI entry: `pnpm data:patch <patch.json>... [--dry-run]` validates and applies patches to Venues.json and Excluded.json.
import {
  DATASET_PATH,
  EXCLUDED_PATH,
  readJsonFile,
  readJsonFileOr,
  writeJsonFile,
} from "./JsonFile";
import { applyVenuePatches, type ExcludedList, type VenuePatch } from "./VenuePatcher";
import type { VenueDataset } from "../src/Types/Venue";

const args = process.argv.slice(2);
const patchPaths = args.filter((arg) => !arg.startsWith("--"));
const isDryRun = args.includes("--dry-run");
if (patchPaths.length === 0) {
  console.error("Usage: pnpm data:patch <patch.json> [more.json ...] [--dry-run]");
  process.exit(2);
}

const dataset = await readJsonFile<VenueDataset>(DATASET_PATH);
const excluded = await readJsonFileOr<ExcludedList>(EXCLUDED_PATH, { series: [] });
const patches = await Promise.all(patchPaths.map((path) => readJsonFile<VenuePatch>(path)));
const result = applyVenuePatches(dataset, excluded, patches);

if (result.problems.length > 0) {
  console.error("Patch rejected; nothing was written:");
  result.problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}
result.changes.forEach((change) => console.log(change));
if (isDryRun) {
  console.log(`${result.changes.length} change(s) valid; nothing written (dry run).`);
} else {
  await writeJsonFile(DATASET_PATH, result.dataset);
  await writeJsonFile(EXCLUDED_PATH, result.excluded);
  console.log(`${result.changes.length} change(s) written.`);
}
