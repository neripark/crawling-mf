import { getGitHubActionsInput } from "../../../repositories/getGitHubActionsInput";

const DEFAULT_BACK_MONTHS = 1;

export const getNumberGoingBackMonths = async (): Promise<number> => {
  const input = await getGitHubActionsInput("months");

  if (input === "") {
    return DEFAULT_BACK_MONTHS;
  }

  if (isNaN(Number(input))) {
    throw new Error("数字ではない数が入力されました。");
  }

  const numberInput = Number(input);
  return numberInput < 0 ? DEFAULT_BACK_MONTHS : numberInput;
};
