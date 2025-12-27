import { describe, it, expect, vi } from "vitest";
import { generateTargetMonthLabel } from "./generateTargetMonthLabel";

describe("generateTargetMonthLabel", () => {
  vi.useFakeTimers();
  it.each([
    [1, "2024年02月"],
    [2, "2024年01月"],
    [3, "2023年12月"],
  ])("遡る月数が%dの場合、%sになること", (numberToBack, expected) => {
    vi.setSystemTime(new Date(2024, 2, 1)); // month は index 番号のため -1
    expect(generateTargetMonthLabel(numberToBack)).toBe(expected);
  });
});
