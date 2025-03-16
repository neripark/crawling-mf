// import { messagingApi } from "@line/bot-sdk";
import { pushMessage } from "../../lib/lineMessagingAPI";

export const notifyToLine = async (message: string) => pushMessage(message);
