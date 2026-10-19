// Integrity checks for the bundled dataset and the validator itself.
import { describe, expect, it } from "vitest";
import { loadConferenceDataset } from "../src/Services/ConferenceRepository";
import { validateConference, validateConferences } from "../src/Services/ConferenceValidator";
import { isValidIsoDate } from "../src/Services/DateUtility";
import { createConference } from "./Fixtures";

describe("Conferences.json", () => {
  const dataset = loadConferenceDataset();

  it("has a valid lastUpdated date", () => {
    expect(isValidIsoDate(dataset.lastUpdated)).toBe(true);
  });

  it("contains only valid records", () => {
    expect(validateConferences(dataset.conferences)).toEqual([]);
  });
});

describe("validateConference", () => {
  it("accepts the fixture", () => {
    expect(validateConference(createConference())).toEqual([]);
  });

  it("requires a track name for track-scoped conferences", () => {
    expect(validateConference(createConference({ gameScope: "track" }))).toHaveLength(1);
  });

  it("requires deadlines when the CfP is published", () => {
    expect(validateConference(createConference({ deadlines: [] }))).toHaveLength(1);
  });

  it("detects duplicated ids", () => {
    const record = createConference();
    expect(validateConferences([record, record])).toContain("sample-2027: duplicated id");
  });
});
