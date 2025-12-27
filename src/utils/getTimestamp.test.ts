import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { getTimestamp } from "./getTimestamp";

const testPattern: Array<{
  label: string;
  mockDate: Date;
  expected: string;
}> = [
  {
    // ミリ秒指定あり
    label: "2025年4月1日",
    mockDate: new Date(2025, 3, 1), // month は index 番号のため -1
    expected: "2025_04_01-00_00_00_000",
  },
  {
    // ミリ秒指定なし
    label: "2025年4月1日11時15分30.156秒",
    mockDate: new Date(2025, 3, 1, 11, 15, 30, 156),
    expected: "2025_04_01-11_15_30_156",
  },
  {
    // 月と日が2桁
    label: "2025年12月1日",
    mockDate: new Date(2025, 11, 15),
    expected: "2025_12_15-00_00_00_000",
  },
];

describe("getTimestamp", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  it.each(testPattern)(
    "現在の日付が$labelの場合、`$expected`が出力されること",
    ({ mockDate, expected }) => {
      vi.setSystemTime(mockDate);

      const result = getTimestamp();

      expect(result).toBe(expected);
    },
  );
});
