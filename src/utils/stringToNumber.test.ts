import { stringToNumber } from "./stringToNumber";

describe("stringToNumber", () => {
  it("正の整数を受け取って、number型に変換する", () => {
    expect(stringToNumber("1234")).toBe(1234);
  });

  it("負の整数を受け取って、number型に変換する", () => {
    expect(stringToNumber("-1234")).toBe(-1234);
  });

  it("負の整数（カンマつき）を受け取って、number型に変換する", () => {
    expect(stringToNumber("-1,234")).toBe(-1234);
  });

  it("3桁区切りのカンマを含む数値を受け取って、number型に変換する", () => {
    expect(stringToNumber("1,234,567.89")).toBe(1234567.89);
  });

  it("空文字列を受け取って、例外を投げる", () => {
    expect(() => {
      stringToNumber("");
    }).toThrowError("Invalid input: empty string");
  });

  it("数字とはみなせない文字列を受け取って、例外を投げる", () => {
    expect(() => {
      stringToNumber("123a");
    }).toThrowError("Invalid input: not a number");
    expect(() => {
      stringToNumber("hoo bar");
    }).toThrowError("Invalid input: not a number");
  });
});
