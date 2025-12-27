import { getGitHubActionsInput } from "../../repositories/getGitHubActionsInput";
import { getNumberGoingBackMonths } from "./getNumberGoingBackMonths";

vi.mock("../../repositories/getGitHubActionsInput");
const mockedGetGitHubActionsInput = vi.mocked(getGitHubActionsInput);

describe("getNumberGoingBackMonths", () => {
  test("GitHub Actionsから正の数が取得された場合、そのまま返すこと", async () => {
    mockedGetGitHubActionsInput.mockResolvedValue("5");
    const result = await getNumberGoingBackMonths();
    expect(result).toBe(5);
  });

  test("GitHub Actionsから0が取得された場合、そのまま返すこと", async () => {
    mockedGetGitHubActionsInput.mockResolvedValue("0");
    const result = await getNumberGoingBackMonths();
    expect(result).toBe(0);
  });

  test("GitHub Actionsから0未満の数値が取得された場合、デフォルト値である1を返すこと", async () => {
    mockedGetGitHubActionsInput.mockResolvedValue("-1");
    const result = await getNumberGoingBackMonths();
    expect(result).toBe(1);
  });

  test("GitHub Actionsから空文字が取得された場合、デフォルト値である1を返すこと", async () => {
    mockedGetGitHubActionsInput.mockResolvedValue("");
    const result = await getNumberGoingBackMonths();
    expect(result).toBe(1);
  });

  test("GitHub Actionsから数字とみなすことができない文字列が取得された場合、例外をスローすること", async () => {
    mockedGetGitHubActionsInput.mockResolvedValue("invalid");
    await expect(() => getNumberGoingBackMonths()).rejects.toThrow(
      "数字ではない数が入力されました。",
    );
  });
});
