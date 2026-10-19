// Domain types describing one game-related conference edition and its call for papers.

/** Where the conference is organised relative to Japan. */
export type Region = "domestic" | "international";

/** "whole": the entire conference is about games; "track": only a dedicated game track is. */
export type GameScope = "whole" | "track";

/** Research fields (分野) a conference covers; one conference may span several. */
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

/** One 2027 edition of a game-related conference, as stored in Conferences.json. */
export interface Conference {
  id: string;
  acronym: string;
  nameEn: string;
  nameJa: string | null;
  organizer: string;
  region: Region;
  gameScope: GameScope;
  /** Name of the game track when gameScope is "track". */
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

/** Root object of Conferences.json. */
export interface ConferenceDataset {
  /** ISO date when the dataset was last researched. */
  lastUpdated: string;
  conferences: Conference[];
}
