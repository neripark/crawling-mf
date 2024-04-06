import { generateDateLabelOnMf } from "./generateDateLabel";

describe("generateDateLabelOnMf のテスト", () => {
  describe("遡る月数を渡さなかった場合", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    test("実行日が1月1日", () => {
      jest.setSystemTime(new Date(2023, 0, 1)); // month は index 番号のため -1
      expect(generateDateLabelOnMf()).toBe("2022/12/01 - 2022/12/31");
    });
    test("実行日が3月15日", () => {
      jest.setSystemTime(new Date(2023, 2, 15));
      expect(generateDateLabelOnMf()).toBe("2023/02/01 - 2023/02/28");
    });
    test("実行日が3月15日（うるう年）", () => {
      jest.setSystemTime(new Date(2024, 2, 15));
      expect(generateDateLabelOnMf()).toBe("2024/02/01 - 2024/02/29");
    });
  });
  describe("遡る月数を渡した場合", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 4, 20));
    });
    test("1の場合、1ヶ月前になる", () => {
      expect(generateDateLabelOnMf(1)).toBe("2024/04/01 - 2024/04/30");
    });
    test("2の場合、2ヶ月前になる", () => {
      expect(generateDateLabelOnMf(2)).toBe("2024/03/01 - 2024/03/31");
    });
    test("3の場合、3ヶ月前になる", () => {
      expect(generateDateLabelOnMf(3)).toBe("2024/02/01 - 2024/02/29");
    });
  });
});
