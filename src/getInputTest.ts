import { getGitHubActionsInput } from "./utils/getGitHubActionsInput";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const input = await getGitHubActionsInput("MONTHS");
  console.log("got input:", input);
  console.log("done.");
})();
