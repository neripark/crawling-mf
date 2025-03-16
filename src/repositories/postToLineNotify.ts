import { pushMessageClient } from "../../lib/lineMessagingAPI";

export const notifyToLine = async (message: string) =>
  pushMessageClient({
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  });
