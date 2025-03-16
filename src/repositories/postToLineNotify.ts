import { messagingApi } from "@line/bot-sdk";

export const notifyToLine = async (message: string) => {
  const channelAccessToken =
    process.env.LINE_MESSAGING_API_CHANNEL_ACCESS_TOKEN;
  const groupId = process.env.LINE_GROUP_ID;

  // todo: 型定義で undefined を排除する
  if (!channelAccessToken) {
    throw new Error("LINE_MESSAGING_API_CHANNEL_ACCESS_TOKEN is not set");
  }
  if (!groupId) {
    throw new Error("LINE_GROUP_ID is not set");
  }

  const config = { channelAccessToken };
  console.log("config", config);

  const client = new messagingApi.MessagingApiClient(config);

  return client.pushMessage({
    to: groupId,
    messages: [
      // todo: いい感じの見た目にする
      {
        type: "text",
        text: message,
      },
    ],
  });
};
