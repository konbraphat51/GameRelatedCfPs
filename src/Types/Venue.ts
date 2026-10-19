// Domain types describing one game-related venue (conference edition or journal) and its call for papers.

/** Where the venue is organised relative to Japan. */
export type Region = "domestic" | "international";

/** Kind of publication venue. */
export type VenueType = "conference" | "journal";

/** Every venue type, in display order. */
export const VENUE_TYPE_VALUES: readonly VenueType[] = ["conference", "journal"];

/** "whole": the entire venue is about games; "track": only a game track or special issue is. */
export type GameScope = "whole" | "track";

/** Research fields (分野) a venue covers; one venue may span several. */
export type Field =
  | "hci"
  | "ai"
  | "graphics"
  | "engineering"
  | "game-studies"
  | "social-science"
  | "education"
  | "serious-games"
  | "gamification"
  | "health"
  | "narrative"
  | "design-art"
  | "music-audio"
  | "esports"
  | "simulation-gaming"
  | "analog";

/** Every field value, in display order. */
export const FIELD_VALUES: readonly Field[] = [
  "hci",
  "ai",
  "graphics",
  "engineering",
  "game-studies",
  "social-science",
  "education",
  "serious-games",
  "gamification",
  "health",
  "narrative",
  "design-art",
  "music-audio",
  "esports",
  "simulation-gaming",
  "analog",
];

/** One submission deadline in a call for papers. */
export interface Deadline {
  /** What is due, e.g. "Full papers". */
  label: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Extra detail such as the time zone ("AoE"). */
  note: string | null;
}

/** A 2027 conference edition or a journal (incl. special issues), as stored in Venues.json. */
export interface Venue {
  id: string;
  acronym: string;
  nameEn: string;
  nameJa: string | null;
  organizer: string;
  region: Region;
  venueType: VenueType;
  gameScope: GameScope;
  /** Name of the game track (conference) or special issue (journal) when gameScope is "track". */
  trackName: string | null;
  /** Research fields covered (multi-tag for interdisciplinary venues). */
  fields: Field[];
  url: string;
  cfpUrl: string | null;
  /** ISO start date of the event, if announced. */
  eventStart: string | null;
  /** ISO end date of the event, if announced. */
  eventEnd: string | null;
  /** Free-text date when only partially known, e.g. "Autumn 2027". */
  eventDateText: string | null;
  location: string | null;
  /** True when regular submissions are accepted at any time (journals). */
  rollingSubmission: boolean;
  /** False means the 2027 CfP has not been released yet (shown as "Unknown"). */
  cfpPublished: boolean;
  deadlines: Deadline[];
  /** Hint taken from the previous edition when the CfP is not published. */
  pastPatternEn: string | null;
  pastPatternJa: string | null;
  notesEn: string | null;
  notesJa: string | null;
  sources: string[];
}

/** Root object of Venues.json. */
export interface VenueDataset {
  /** ISO date when the dataset was last researched. */
  lastUpdated: string;
  venues: Venue[];
}
