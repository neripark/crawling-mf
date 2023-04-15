import { generateDateLabelOnMf } from "./generateDateLabel";

describe("generateDateLabelOnMf のテスト", () => {
  test("実行日が1月1日", () => {
    const mockDate = new Date(2023, 0, 1); // month は index 番号のため -1
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    expect(generateDateLabelOnMf()).toBe("2022/12/01 - 2022/12/31");
  });
  test("実行日が3月15日", () => {
    const mockDate = new Date(2023, 2, 15);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    expect(generateDateLabelOnMf()).toBe("2023/02/01 - 2023/02/28");
  });
  test("実行日が3月15日（うるう年）", () => {
    const mockDate = new Date(2024, 2, 15);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    expect(generateDateLabelOnMf()).toBe("2024/02/01 - 2024/02/29");
  });
});
