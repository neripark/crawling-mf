import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { notifyToLine } from "./postToLineNotify";

dotenv.config();

(async () => {
  if (
    process.env.LOGIN_EMAIL === undefined ||
    process.env.LOGIN_PASSWORD === undefined ||
    process.env.LINE_NOTIFY_TOKEN === undefined
  ) {
    throw new Error("必要な環境変数がありません。");
  }

  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === "production",
  });
  const page = await browser.newPage();
  // page.setDefaultTimeout(5000);

  // 1. 目的の画面に遷移
  await page.goto("https://moneyforward.com/cf#daily_info");
  await page.click('a[href^="/sign_in/email"]');

  // 2. email のインプットボックスにメールアドレスを入力して次へ
  await page.waitForSelector("input[type='email']");
  await page.type("input[type='email']", process.env.LOGIN_EMAIL);
  await page.click("input.submitBtn.homeDomain[type=submit]");
  await page.waitForNavigation();

  // 7. パスワードのインプットボックスにパスワードを入力して次へ
  await page.type("input[type='password']", process.env.LOGIN_PASSWORD);
  await page.click("input.VwFkbeOc.submitBtn.homeDomain[type=submit]");

  // 9. 画面遷移を待つ
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // 10. 表示を先月に切り替える
  await page.click(
    "button.btn.fc-button.fc-button-prev.spec-fc-button-click-attached"
  );

  // 11. 特定の要素のテキストが `前月1日〜前月末日`となっていることを確認する
  await page.waitForSelector(".fc-header-title.in-out-header-title h2");
  await page.waitForFunction(
    () => {
      const element = document.querySelector(
        ".fc-header-title.in-out-header-title h2"
      );
      if (element) {
        const text = element.textContent!.trim();
        return text === "2023/03/01 - 2023/03/31";
      }
      return false;
    },
    { timeout: 5000 }
  );

  // 12. 特定のtable要素が表示されるのを待つ
  await page.waitForSelector("table#cf-detail-table");

  // いったん固定で取得
  const date = await page.$eval(
    "#js-transaction-15326002005 > td.date.form-switch-td > div.noform > span",
    (element) => element.textContent
  );
  const title = await page.$eval(
    "table#cf-detail-table td.content.form-switch-td > div.noform > span",
    (element) => element.textContent
  );

  console.log(date, title);

  await notifyToLine(
    title
      ? `3月の一番最初のレコードは、${date} の 「${title}」 にゃー`
      : "テキストが見つかりませんでした。"
  );

  // Puppeteer の終了
  await browser.close();

  console.log("done.");
})();
