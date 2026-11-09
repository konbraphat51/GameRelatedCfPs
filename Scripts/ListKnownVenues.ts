// CLI entry: `pnpm data:known` prints a one-line-per-venue digest plus the excluded series, for de-duplication.
import { toIsoDate } from "../src/Services/DateUtility";
import { DATASET_PATH, EXCLUDED_PATH, readJsonFile, readJsonFileOr } from "./JsonFile";
import { formatExcludedSeries, formatKnownVenues } from "./VenueDigest";
import type { ExcludedList } from "./VenuePatcher";
import type { VenueDataset } from "../src/Types/Venue";

const dataset = await readJsonFile<VenueDataset>(DATASET_PATH);
const excluded = await readJsonFileOr<ExcludedList>(EXCLUDED_PATH, { series: [] });

console.log(`# Listed venues (${dataset.venues.length}); lastUpdated ${dataset.lastUpdated}`);
console.log("# id\ttype\tstatus\tnext\tacronym\tname\thost");
formatKnownVenues(dataset.venues, toIsoDate(new Date())).forEach((line) => console.log(line));
console.log(`\n# Excluded series (${excluded.series.length})`);
console.log("# type\trecheck\tname\treason");
formatExcludedSeries(excluded.series).forEach((line) => console.log(line));
