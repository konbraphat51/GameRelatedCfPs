// Provides the bundled venue dataset to the rest of the application.
import rawDataset from "../Data/Venues.json";
import type { VenueDataset } from "../Types/Venue";

/** Returns the venue dataset bundled at build time. */
export function loadVenueDataset(): VenueDataset {
  return rawDataset as VenueDataset;
}
