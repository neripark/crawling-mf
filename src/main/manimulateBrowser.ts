import type { Page } from "puppeteer";
import { generateDateLabelOnMf } from "./functions/generateDateLabel";
import { getGitHubActionsInput } from "../utils/getGitHubActionsInput";

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
  const numberToBackMonths = await getNumberToBackMonths();
  await backMonths(page, numberToBackMonths);

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

const getNumberToBackMonths = async (): Promise<number> => {
  const input = await getGitHubActionsInput("months");
  if (isNaN(Number(input))) {
    throw new Error("数字ではない数が入力されました。");
  }
  return Number(input);
};

/**
 *
 * 指定の数だけ対象の月を遡る関数
 *
 * @param page puppeteerのpageオブジェクト
 * @param numberToBack 何ヶ月遡るか。デフォルト:1
 * @todo 別のファイルに切り出す
 */
const backMonths = async (page: Page, numberToBack: number) => {
  for (let i = 1; i <= numberToBack; i++) {
    // 10. 1ヶ月前に戻る
    await backToLastMonth(page);
    // 11. ラベルが変わるまで待つ
    const targetLabel = generateDateLabelOnMf(i);
    await waitLabelToBeTargetLabel(page, targetLabel);
  }
};

const backToLastMonth = async (page: Page) => {
  const SELECTOR_BUTTON =
    "button.btn.fc-button.fc-button-prev.spec-fc-button-click-attached";
  await page.waitForSelector(SELECTOR_BUTTON);
  await page.click(SELECTOR_BUTTON);
};

const waitLabelToBeTargetLabel = async (page: Page, targetLabel: string) => {
  const SELECTOR_DATE_LABEL = ".fc-header-title.in-out-header-title h2";
  await page.waitForSelector(SELECTOR_DATE_LABEL);
  // note: ブラウザ側に渡される関数だが、使用する変数は連れて行ってはくれないので、第3引数に記述して渡す必要がある
  console.log("[start] wait for display target month...");
  const pastMonthLabel = await page.evaluate((label) => label, targetLabel);
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
};
