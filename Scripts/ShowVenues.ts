// CLI entry: `pnpm data:show <id>...` prints full records for the given ids only.
import { DATASET_PATH, readJsonFile } from "./JsonFile";
import { selectVenues } from "./VenueDigest";
import type { VenueDataset } from "../src/Types/Venue";

const ids = process.argv.slice(2);
if (ids.length === 0) {
  console.error("Usage: pnpm data:show <id> [more ids ...]   (list ids with pnpm data:known)");
  process.exit(2);
}

const dataset = await readJsonFile<VenueDataset>(DATASET_PATH);
const { selected, missing } = selectVenues(dataset.venues, ids);
console.log(JSON.stringify(selected, null, 2));
if (missing.length > 0) {
  console.error(`Unknown id(s): ${missing.join(", ")}`);
  process.exit(1);
}
