// Tests for ISO date helpers.
import { describe, expect, it } from "vitest";
import {
  countDaysBetween,
  formatIsoDate,
  formatIsoDateRange,
  isValidIsoDate,
  toIsoDate,
} from "../src/Services/DateUtility";

describe("DateUtility", () => {
  it("formats a local date as ISO", () => {
    expect(toIsoDate(new Date(2027, 0, 5))).toBe("2027-01-05");
  });

  it("rejects malformed and impossible dates", () => {
    expect(isValidIsoDate("2027-02-28")).toBe(true);
    expect(isValidIsoDate("2027-02-30")).toBe(false);
    expect(isValidIsoDate("2027-2-3")).toBe(false);
  });

  it("counts days across months", () => {
    expect(countDaysBetween("2026-12-30", "2027-01-02")).toBe(3);
    expect(countDaysBetween("2027-01-02", "2026-12-30")).toBe(-3);
  });
});

describe("formatIsoDateRange", () => {
  it("collapses identical dates and joins distinct ones", () => {
    expect(formatIsoDateRange("2027-06-08", null, "en-US")).toBe(
      formatIsoDate("2027-06-08", "en-US"),
    );
    expect(formatIsoDateRange("2027-06-08", "2027-06-11", "ja-JP")).toBe(
      "2027年6月8日 – 2027年6月11日",
    );
  });
});
