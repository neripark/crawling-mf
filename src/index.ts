import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { notifyToLine } from "./postToLineNotify";
import { MfTable } from "./MfTable";
import { manimulateBrowser } from "./manimulateBrowser";

dotenv.config();

(async () => {
  if (
    !process.env.LOGIN_EMAIL ||
    !process.env.LOGIN_PASSWORD ||
    !process.env.LINE_NOTIFY_TOKEN
  ) {
    throw new Error("必要な環境変数がありません。");
  }

  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === "production" ? "new" : false,
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(
    // note: GitHub Actions 上でだけタイムアウトで落ちるため
    process.env.NODE_ENV === "production" ? 300000 : page.getDefaultTimeout(),
  );

  // note: ユーザーエージェント偽装しないとサーバーに弾かれる
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  );

  let serializedTable;
  try {
    // ブラウザ操作してテーブルを取得する
    serializedTable = await manimulateBrowser({
      page,
      env: {
        LOGIN_EMAIL: process.env.LOGIN_EMAIL,
        LOGIN_PASSWORD: process.env.LOGIN_PASSWORD,
      },
    });
  } catch (error) {
    const msg = `エラーで結果が取得できませんでした。: ${error}`;
    await notifyToLine(msg);
    throw new Error(msg);
  }

  // Puppeteer の終了
  await browser.close();

  console.log("[start] serialize target table and format message...");
  const mfTable = new MfTable(serializedTable);
  const msg = mfTable.getMessage();

  // todo: 長いと見切れるため、分割送信するかどうか決める
  await notifyToLine(msg ?? "テキストが見つかりませんでした。");

  console.log("----------------------------------");
  console.log("done.");
})();
