import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { notifyToLine } from "./postToLineNotify";
import { generateDateLabelOnMf } from "./generateDateLabel";
import { MfTable } from "./MfTable";

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
  // note: ユーザーエージェント偽装しないとサーバーに弾かれる
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
  );
  console.log("[start] visit site...");
  await page.goto("https://moneyforward.com/cf#daily_info");
  await page.click('a[href^="/sign_in/email"]');

  // 2. email のインプットボックスにメールアドレスを入力して次へ
  console.log("[start] input email...");
  await page.waitForSelector("input[type='email']");
  await page.type("input[type='email']", process.env.LOGIN_EMAIL);
  await page.click("input.submitBtn.homeDomain[type=submit]");
  await page.waitForNavigation();

  // 7. パスワードのインプットボックスにパスワードを入力して次へ
  console.log("[start] input password...");
  await page.type("input[type='password']", process.env.LOGIN_PASSWORD);
  await page.click("input.VwFkbeOc.submitBtn.homeDomain[type=submit]");

  // 9. 画面遷移を待つ
  console.log("[start] wait for navigation...");
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // 10. 表示を先月に切り替える
  console.log("[start] change view to last month...");
  await page.click(
    "button.btn.fc-button.fc-button-prev.spec-fc-button-click-attached"
  );

  // 11. 特定の要素のテキストが `前月1日〜前月末日`となっていることを確認する
  await page.waitForSelector(".fc-header-title.in-out-header-title h2");

  // note: ブラウザ側に渡される関数だが、使用する変数は連れて行ってはくれないので、第3引数に記述して渡す必要がある
  console.log("[start] wait for display last month...");
  const pastMonthLabel = await page.evaluate(
    (label) => label,
    generateDateLabelOnMf()
  );
  await page.waitForFunction(
    (expectedLabel) => {
      const element = document.querySelector(
        ".fc-header-title.in-out-header-title h2"
      );
      if (element) {
        const text = element.textContent!.trim();
        return text === expectedLabel;
      }
      return false;
    },
    { timeout: 50000 },
    pastMonthLabel
  );

  // 12. 特定のtable要素が表示されるのを待つ
  console.log("[start] wait for display target table...");
  await page.waitForSelector("table#cf-detail-table");

  const serializedTable = await page.evaluate(() => {
    // todo: MfTableクラス側に寄せる
    const table = document.querySelector("table#cf-detail-table");
    if (table === null) throw new Error("対象テーブルが見つかりませんでした。");
    // note: DOMのままではNode.jsに渡せないためいったん文字列にする
    return table.outerHTML;
  });

  // Puppeteer の終了
  await browser.close();

  console.log("[start] serialize target table and format message...");
  const mfTable = new MfTable(serializedTable);
  const msg = mfTable.getRowsSimpleString();

  console.log(msg);

  // todo: 長いと見切れるため、分割送信するかどうか決める
  await notifyToLine(msg ?? "テキストが見つかりませんでした。");

  console.log("----------------------------------");
  console.log("done.");
})();
