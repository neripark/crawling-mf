import type { Page } from "puppeteer";
import { generateDateLabelOnMf } from "./generateDateLabel";

interface Props {
  page: Page;
  env: {
    LOGIN_EMAIL: string;
    LOGIN_PASSWORD: string;
  };
}

export const manimulateBrowser = async ({ page, env }: Props) => {
  console.log("[start] visit site...");
  await page.goto("https://moneyforward.com/cf#daily_info");
  await page.click('a[href^="/sign_in/email"]');

  // 2. email のインプットボックスにメールアドレスを入力して次へ
  console.log("[start] input email...");
  await page.waitForSelector("input[type='email']");
  await page.type("input[type='email']", env.LOGIN_EMAIL);
  await page.click("input.submitBtn.homeDomain[type=submit]");

  // 7. パスワードのインプットボックスにパスワードを入力して次へ
  console.log("[start] input password...");
  const SELECTOR_SUBMIT_BUTTON_PASSWORD =
    "input.VwFkbeOc.submitBtn.homeDomain[type=submit]";
  await page.waitForSelector(SELECTOR_SUBMIT_BUTTON_PASSWORD);
  await page.type("input[type='password']", env.LOGIN_PASSWORD);
  await page.click(SELECTOR_SUBMIT_BUTTON_PASSWORD);

  // 8. 生体認証を勧められるので`あとで登録`をクリックする
  // note: ローカル（というか日本語ページ）でしか現れないページのため分ける
  if (process.env.NODE_ENV !== "production") {
    console.log("[start] skip recommendation biometrics page...");
    const SELECTOR_SUBMIT_PASSKEY_REJECT = "a[data-ga-mfid=passkey_rejected]";
    await page.waitForSelector(SELECTOR_SUBMIT_PASSKEY_REJECT);
    await page.click(SELECTOR_SUBMIT_PASSKEY_REJECT);
  }

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
    generateDateLabelOnMf(),
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
    SELECTOR_DATE_LABEL,
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

  return serializedTable;
};
