import { calcDiff } from "./calcDiff";

describe("calcDiff のテスト", () => {
  test("両方正の数の場合、例外を投げる", () => {
    expect(() => {
      calcDiff({ key: "x", price: 1 }, { key: "y", price: 1 });
    }).toThrowError(
      "価格が正の数になっているレコードがあります。支出なので、必ず負の数のはずです。"
    );
  });
  test("片方が負の数の場合、例外を投げる", () => {
    expect(() => {
      calcDiff({ key: "x", price: -1 }, { key: "y", price: 1 });
    }).toThrowError(
      "価格が正の数になっているレコードがあります。支出なので、必ず負の数のはずです。"
    );
  });
  describe("両方負の数の場合、正しく計算されてメッセージが返る", () => {
    test("1つ目のほうが多い場合", () => {
      expect(
        calcDiff({ key: "💰", price: -2000 }, { key: "💸", price: -500 })
      ).toBe("💰のほうが1,500円多いです。");
    });
    test("2つ目のほうが多い場合", () => {
      expect(
        calcDiff({ key: "💰", price: -2000 }, { key: "💸", price: -5000 })
      ).toBe("💸のほうが3,000円多いです。");
    });
    test("値が同じ場合", () => {
      expect(
        calcDiff({ key: "💰", price: -2000 }, { key: "💸", price: -2000 })
      ).toBe("💰も💸も、ぴったり同じ金額です。");
    });
  });
});
