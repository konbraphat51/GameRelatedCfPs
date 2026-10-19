// Provides the bundled conference dataset to the rest of the application.
import rawDataset from "../Data/Conferences.json";
import type { ConferenceDataset } from "../Types/Conference";

/** Returns the conference dataset bundled at build time. */
export function loadConferenceDataset(): ConferenceDataset {
  return rawDataset as ConferenceDataset;
}
