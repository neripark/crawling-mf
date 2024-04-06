import { getInput, setFailed } from "@actions/core";

export const getGitHubActionsInput = async (
  inputName: string,
): Promise<string> => {
  try {
    const input = getInput(inputName);
    console.log(`[INFO] input from GitHub Actions '${inputName}':`, input);
    return input;
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error);
    }
  }
  throw new Error("not reach here");
};
