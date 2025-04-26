import type { Page } from "puppeteer";
import { getTimestamp } from "./getTimestamp";

export const ss = async (page: Page) => {
  await page.screenshot({ path: `tmp/${getTimestamp()}.png` });
};
