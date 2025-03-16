import { messagingApi } from "@line/bot-sdk";
import dotenv from "dotenv";

// Note: main関数実行前に読み込まれるため必要
dotenv.config();

type Client = InstanceType<typeof messagingApi.MessagingApiClient>;

let messagingApiClient: (() => Client) | undefined = undefined;

const initialize = () => {
  if (messagingApiClient !== undefined) {
    return messagingApiClient;
  }
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
  const nativeClient: Client = new messagingApi.MessagingApiClient(config);
  const client = createPushMessageClient(groupId, nativeClient);

  return client;
};

const createPushMessageClient = (groupId: string, client: Client) => {
  return async (message: string) =>
    client.pushMessage({
      to: groupId,
      messages: [
        {
          type: "text",
          text: message,
        },
      ],
    });
};

export const pushMessage = initialize();
