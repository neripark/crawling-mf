import { getGitHubActionsInput } from "./utils/getGitHubActionsInput";

(async () => {
  const input = await getGitHubActionsInput("gobackmonth");
  console.log("got input: ", input);
  console.log("done.");
})();
