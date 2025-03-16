/**
 * @file LINE Messaging API のクライアント関数を生成する。
 * @todo クライアント関数の初期化と pushMessageClient の生成でファイルを分割する
 */
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

  // todo: 型定義で undefined を排除する
  if (!channelAccessToken) {
    throw new Error("LINE_MESSAGING_API_CHANNEL_ACCESS_TOKEN is not set");
  }

  const config = { channelAccessToken };
  const nativeClient: Client = new messagingApi.MessagingApiClient(config);

  return nativeClient;
};

// _______________________________________________________________

type PushMessage = Client["pushMessage"];
type PushMessageArgs = Parameters<PushMessage>;

type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;
type Rest<T extends any[]> = T extends [any, ...infer R] ? R : never;

type PushMessageArgs0 = First<PushMessageArgs>;
type PushMessageArgsRest = Rest<PushMessageArgs>;

type H = Omit<PushMessageArgs0, "to">;

const createPushMessageClient = (client: Client) => {
  const groupId = process.env.LINE_GROUP_ID;
  if (!groupId) {
    throw new Error("LINE_GROUP_ID is not set");
  }

  return async (args: H, rest?: PushMessageArgsRest) =>
    client.pushMessage(
      {
        to: groupId,
        messages: args.messages,
      },
      ...(rest ?? []),
    );
};

export const pushMessageClient = createPushMessageClient(initialize());
