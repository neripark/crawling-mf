import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { notifyToLine } from "../repositories/postToLineNotify";
import { MfTable } from "./MfTable";
import { manipulateBrowser } from "./manipulateBrowser";
import { isDebugMode } from "../utils/isDebugMode";
import { ss } from "../utils/getScreenshot";

dotenv.config();

const main = async () => {
  if (
    !process.env.LOGIN_EMAIL ||
    !process.env.LOGIN_PASSWORD ||
    !process.env.LINE_NOTIFY_TOKEN
  ) {
    throw new Error("必要な環境変数がありません。");
  }

  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === "production" ? true : false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(
    // note: GitHub Actions 上でだけタイムアウトで落ちるため
    process.env.NODE_ENV === "production" ? 300000 : page.getDefaultTimeout(),
  );

  // note: GitHub Actions 上でだけ言語設定が英語になるため、明示的に日本語にする
  await page.setExtraHTTPHeaders({
    "Accept-Language": "ja-JP,ja;q=0.9",
  });

  // for debug
  await page.setViewport({ width: 1080, height: 1024 });

  // note: ユーザーエージェント偽装しないとサーバーに弾かれる
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  );

  let serializedTable;
  try {
    // ブラウザ操作してテーブルを取得する
    serializedTable = await manipulateBrowser({
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
  const mfTable = new MfTable(serializedTable);
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
