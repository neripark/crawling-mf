import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { notifyToLine } from "./postToLineNotify";

dotenv.config();

(async () => {
  if (process.env.URL === undefined || process.env.SELECTOR === undefined) {
    throw new Error("必要な環境変数がありません。");
  }

  const url = process.env.URL;
  const selector = process.env.SELECTOR;

  // Puppeteer の起動
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 特定の URL にアクセス
  await page.goto(url);

  // DOM からテキストを取得
  const element = await page.$(selector);
  const text = await page.evaluate((element) => element!.textContent, element);

  console.log(text);
  await notifyToLine(text || "テキストが見つかりませんでした。");

  // Puppeteer の終了
  await browser.close();
})();
