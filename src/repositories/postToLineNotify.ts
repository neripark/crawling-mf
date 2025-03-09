import { getEnv } from "../utils/env";

export const notifyToLine = async (message: string) => {
  return fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getEnv("LINE_NOTIFY_TOKEN")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      message,
    }).toString(),
  });
};
