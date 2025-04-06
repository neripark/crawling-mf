import dotenv from "dotenv";
import { notifyToLine } from "../repositories/postToLineNotify";
import { MfTable } from "./MfTable";
import { manipulateBrowser } from "./manipulateBrowser";
import { isDebugMode } from "../utils/isDebugMode";
import { ss } from "../utils/getScreenshot";
import { initializeBrowser } from "./initializeBrowser";

dotenv.config();

const main = async () => {
  if (
    !process.env.LOGIN_EMAIL ||
    !process.env.LOGIN_PASSWORD ||
    !process.env.LINE_MESSAGING_API_CHANNEL_ACCESS_TOKEN ||
    !process.env.LINE_GROUP_ID ||
    !process.env.LOGIN_TOTP_SECRET
  ) {
    throw new Error("必要な環境変数がありません。");
  }

  const { browser, page } = await initializeBrowser();

  let crawlResult: {
    serializedTable: string;
    targetMonth: string;
  };
  try {
    // ブラウザ操作してテーブルを取得する
    crawlResult = await manipulateBrowser({
      page,
      env: {
        LOGIN_EMAIL: process.env.LOGIN_EMAIL,
        LOGIN_PASSWORD: process.env.LOGIN_PASSWORD,
      },
    });
  } catch (error) {
    const msg = `Failed crawling: ${error}`;
    if (isDebugMode()) {
      await ss(page);
    }
    await notifyToLine(msg);
    throw new Error(msg);
  }

  // Puppeteer の終了
  await browser.close();

  console.log("[start] serialize target table and format message...");
  const mfTable = new MfTable(crawlResult);
  const msg = mfTable.getMessage();

  // todo: 長いと見切れるため、分割送信するかどうか決める
  await notifyToLine(msg ?? "テキストが見つかりませんでした。");

  console.log("----------------------------------");
  console.log("done.");
};

(async () => {
  try {
    await main();
  } catch (error) {
    const msg = `エラー: ${error}`;
    await notifyToLine(msg);
    throw new Error(msg);
  }
})();
