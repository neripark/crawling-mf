# 家計簿アプリをクローリングする

- 月イチで財布から現金で払った金額の精算を家族と行う運用なので、それを自動化する
  - この運用自体微妙なのでなんとかしたいが...
- 計算したら LINE に通知
- 完全に自分用

# Setup

```
$ cp .env.example .env # and edit
$ npm ci
```

依存パッケージのインストールスクリプトは、`package.json` の `allowScripts` でパッケージ名単位で許可している。許可はバージョン更新後も引き継がれる。
esbuild は実行バイナリのセットアップ、Puppeteer はブラウザのダウンロード、fsevents は tsx / Vite が依存する macOS 向けのファイル変更監視パッケージとして登録している。
依存更新後に未承認スクリプトの Warning が出た場合は、`npm install-scripts ls` で対象を特定する。
追加された経緯、スクリプトの実装と実行目的を確認し、実行が必要かつ信頼できると判断したものだけを `npm install-scripts approve --no-allow-scripts-pin <パッケージ名>` で許可する。Warning の解消だけを目的に許可しない。

# デバッグ

## GitHub Actions 上でスクリーンショットを撮り、確認する

- `.github/workflows/run-crawler-production.yml` の artifact の設定をコメント解除する
  - 必要に応じて `continue-on-error: true` もコメント解除する
    - workflow がエラーで終了する場合はスクリーンショットをダウンロードするステップまでたどり着かないので、無視するオプション
- `src/getMessageByDiff.ts` から `ss` を import して使う
