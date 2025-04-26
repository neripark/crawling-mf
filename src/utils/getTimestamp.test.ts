import { getTimestamp } from "./getTimestamp";

const testPattern = [
  {
    label: "2025年4月1日",
    mockDate: new Date(2025, 3, 1), // month は index 番号のため -1
    expected: "2025_04_01-00_00_00_000",
  },
  {
    label: "2025年4月1日11時15分30秒",
    mockDate: new Date(2025, 3, 1, 11, 15, 30),
    expected: "2025_04_01-11_15_30_000",
  },
  {
    label: "2025年4月1日11時15分30.156秒",
    mockDate: new Date(2025, 3, 1, 11, 15, 30, 156),
    expected: "2025_04_01-11_15_30_156",
  }
];

describe("getTimestamp", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it.each(testPattern)("現在の日付が$labelの場合、`$expected`が出力されること", ({mockDate, expected}) => {
    jest.setSystemTime(mockDate);

    const result = getTimestamp();

    expect(result).toBe(expected);
  });
});
