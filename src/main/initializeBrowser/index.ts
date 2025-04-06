import puppeteer from "puppeteer";

export const initializeBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === "production" ? true : false,
    args: [
      // note: GitHub Actions 上でLinuxの制限がかかるためsandboxを無効にする
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // note: GitHub Actions 上で英語になるため、明示的に日本語を指定する
      "--lang=ja-JP",
    ],
  });
  const page = await browser.newPage();

  page.setDefaultTimeout(
    // note: GitHub Actions 上でだけタイムアウトで落ちるため
    process.env.NODE_ENV === "production" ? 300000 : page.getDefaultTimeout(),
  );

  // note: GitHub Actions 上でだけ言語設定が英語になるため、明示的に日本語にする
  await page.setExtraHTTPHeaders({
    // 実際にブラウザの優先言語設定を変え、Networkタブで確認した結果を記述
    "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
  });

  // for debug
  await page.setViewport({ width: 1080, height: 1024 });

  // note: ユーザーエージェント偽装しないとサーバーに弾かれる
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  );

  return { browser, page };
};
