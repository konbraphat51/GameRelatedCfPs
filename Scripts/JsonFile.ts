// Reads and writes the repository's JSON data files, keeping Prettier formatting stable.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";

/** Absolute path of the venue dataset. */
export const DATASET_PATH = fileURLToPath(new URL("../src/Data/Venues.json", import.meta.url));

/** Absolute path of the list of researched-but-excluded series. */
export const EXCLUDED_PATH = fileURLToPath(
  new URL("../Maintenance/Excluded.json", import.meta.url),
);

/** Absolute path of the accepted page snapshots used for change detection. */
export const SNAPSHOTS_PATH = fileURLToPath(
  new URL("../Maintenance/PageSnapshots.json", import.meta.url),
);

/** Absolute path of snapshots from the last check, waiting to be accepted (git-ignored). */
export const PENDING_SNAPSHOTS_PATH = fileURLToPath(
  new URL("../Maintenance/PendingSnapshots.json", import.meta.url),
);

/** Parses a JSON file. */
export async function readJsonFile<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

/** Parses a JSON file, or returns `fallback` when it does not exist. */
export async function readJsonFileOr<T>(path: string, fallback: T): Promise<T> {
  try {
    return await readJsonFile<T>(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return fallback;
    }
    throw error;
  }
}

/** Writes `value` as Prettier-formatted JSON. */
export async function writeJsonFile(path: string, value: unknown): Promise<void> {
  const options = (await prettier.resolveConfig(path)) ?? {};
  const text = await prettier.format(JSON.stringify(value, null, 2), {
    ...options,
    parser: "json",
  });
  await writeFile(path, text, "utf8");
}
