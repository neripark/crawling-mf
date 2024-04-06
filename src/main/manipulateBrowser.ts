import type { Page } from "puppeteer";
import { backDisplayMonthToTarget } from "./functions/backDisplayMonthToTarget";

interface Props {
  page: Page;
  env: {
    LOGIN_EMAIL: string;
    LOGIN_PASSWORD: string;
  };
}

export const manipulateBrowser = async ({ page, env }: Props) => {
  console.log("[start] visit site...");
  await page.goto("https://moneyforward.com/cf#daily_info");
  // note: ログイン方法を選択する画面がなくなっていたのでコメントアウト
  // await page.click('a[href^="/sign_in/email"]');

  // 2. email のインプットボックスにメールアドレスを入力して次へ
  console.log("[start] input email...");
  await page.waitForSelector("input[type='email']");
  await page.type("input[type='email']", env.LOGIN_EMAIL);
  await page.click("button#submitto");

  // 7. パスワードのインプットボックスにパスワードを入力して次へ
  console.log("[start] input password...");
  const SELECTOR_SUBMIT_BUTTON_PASSWORD = "button#submitto";
  await page.waitForSelector(SELECTOR_SUBMIT_BUTTON_PASSWORD);
  await page.type("input[type='password']", env.LOGIN_PASSWORD);
  await page.click(SELECTOR_SUBMIT_BUTTON_PASSWORD);

  // 8. 生体認証を勧められるので`あとで登録`をクリックする
  // note: ローカル（というか日本語ページ）でしか現れないページのため分ける
  if (process.env.NODE_ENV !== "production") {
    console.log("[start] skip recommendation biometrics page...");
    const SELECTOR_SUBMIT_PASSKEY_REJECT =
      "a[href^='/passkey_promotion/finalize_passkey_setup']";
    await page.waitForSelector(SELECTOR_SUBMIT_PASSKEY_REJECT);
    await page.click(SELECTOR_SUBMIT_PASSKEY_REJECT);
  }

  // 10. 表示月を遡る
  console.log("[start] change view to target month...");
  // todo: `months` をもう少し具体的な名前に改善する
  await backDisplayMonthToTarget(page);

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
