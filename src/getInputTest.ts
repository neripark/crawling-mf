import { getGitHubActionsInput } from "./utils/getGitHubActionsInput";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const input = await getGitHubActionsInput("MONTHS_TO_GO_BACK");
  console.log("got input:", input);
  console.log("done.");
})();
