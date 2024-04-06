import type { Page } from "puppeteer";
import { getGitHubActionsInput } from "../../repositories/getGitHubActionsInput";
import { generateDateLabelOnMf } from "./generateDateLabel";

/**
 * 指定の数だけ対象の月を遡る関数
 *
 * @param page puppeteerのpageオブジェクト
 * @param numberToBack 何ヶ月遡るか。デフォルト:1
 */
export const backDisplayMonthToTarget = async (page: Page) => {
  const input = await getGitHubActionsInput("months");
  if (isNaN(Number(input))) {
    throw new Error("数字ではない数が入力されました。");
  }

  const numberToBack = Number(input);

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
