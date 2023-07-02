import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { notifyToLine } from "./postToLineNotify";
import { generateDateLabelOnMf } from "./generateDateLabel";
import { MfTable } from "./MfTable";

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
    process.env.NODE_ENV === "production" ? 300000 : page.getDefaultTimeout()
  );

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
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // 7. パスワードのインプットボックスにパスワードを入力して次へ
  console.log("[start] input password...");
  await page.type("input[type='password']", process.env.LOGIN_PASSWORD);
  await page.click("input.VwFkbeOc.submitBtn.homeDomain[type=submit]");

  // // 8. 生体認証を勧められるので`あとで登録`をクリックする
  // await page.waitForNavigation({ waitUntil: "networkidle0" });
  // await page.click("a[data-ga-mfid=passkey_rejected]");

  // 9. 画面遷移を待つ
  console.log("[start] wait for navigation...");
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // 10. 表示を先月に切り替える
  console.log("[start] change view to last month...");
  const SELECTOR_BUTTON =
    "button.btn.fc-button.fc-button-prev.spec-fc-button-click-attached";
  await page.waitForSelector(SELECTOR_BUTTON);
  await page.click(SELECTOR_BUTTON);

  // 11. 特定の要素のテキストが `前月1日〜前月末日`となっていることを確認する
  const SELECTOR_DATE_LABEL = ".fc-header-title.in-out-header-title h2";
  await page.waitForSelector(SELECTOR_DATE_LABEL);
  // note: ブラウザ側に渡される関数だが、使用する変数は連れて行ってはくれないので、第3引数に記述して渡す必要がある
  console.log("[start] wait for display last month...");
  const pastMonthLabel = await page.evaluate(
    (label) => label,
    generateDateLabelOnMf()
  );
  await page.waitForFunction(
    (expectedLabel, selector) => {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent!.trim();
        return text === expectedLabel;
      }
      return false;
    },
    { timeout: 50000 },
    pastMonthLabel,
    SELECTOR_DATE_LABEL
  );

  // 12. 特定のtable要素が表示されるのを待つ
  console.log("[start] wait for display target table...");
  const SELECTOR_TABLE = "table#cf-detail-table";
  await page.waitForSelector(SELECTOR_TABLE);

  const serializedTable = await page.evaluate((selector) => {
    // todo: MfTableクラス側に寄せる
    const table = document.querySelector(selector);
    if (table === null) throw new Error("対象テーブルが見つかりませんでした。");
    // note: DOMのままではNode.jsに渡せないためいったん文字列にする
    return table.outerHTML;
  }, SELECTOR_TABLE);

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
