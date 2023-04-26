import { getMessageByDiff } from "./getMessageByDiff";

describe("calcDiff のテスト", () => {
  test("両方正の数の場合、例外を投げる", () => {
    expect(() => {
      getMessageByDiff({ key: "x", price: 1 }, { key: "y", price: 1 });
    }).toThrowError(
      "小計が正の数になっている絵文字があります。支出なので、必ず負の数のはずです。"
    );
  });
  test("片方が負の数の場合、例外を投げる", () => {
    expect(() => {
      getMessageByDiff({ key: "x", price: -1 }, { key: "y", price: 1 });
    }).toThrowError(
      "小計が正の数になっている絵文字があります。支出なので、必ず負の数のはずです。"
    );
  });
  describe("両方負の数の場合、正しく計算されてメッセージが返る", () => {
    test("1つ目のほうが多い場合", () => {
      expect(
        getMessageByDiff(
          { key: "💰", price: -2000 },
          { key: "💸", price: -500 }
        )
      ).toBe("💰のほうが1,500円多いです。\n💸が💰に750円払いましょう！");
    });
    test("2つ目のほうが多い場合", () => {
      expect(
        getMessageByDiff(
          { key: "💰", price: -2000 },
          { key: "💸", price: -5000 }
        )
      ).toBe("💸のほうが3,000円多いです。\n💰が💸に1,500円払いましょう！");
    });
    test("値が同じ場合", () => {
      expect(
        getMessageByDiff(
          { key: "💰", price: -2000 },
          { key: "💸", price: -2000 }
        )
      ).toBe("💰も💸も、ぴったり同じ金額です。");
    });
    test("片方がゼロの場合", () => {
      expect(
        getMessageByDiff({ key: "💰", price: -2900 }, { key: "💸", price: 0 })
      ).toBe("💰のほうが2,900円多いです。\n💸が💰に1,450円払いましょう！");
    });
  });
});
