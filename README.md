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

# デバッグ

## GitHub Actions 上でスクリーンショットを撮り、確認する

- `.github/workflows/run-crawler-production.yml` の artifact の設定をコメント解除する
  - 必要に応じて `continue-on-error: true` もコメント解除する
    - workflow がエラーで終了する場合はスクリーンショットをダウンロードするステップまでたどり着かないので、無視するオプション
- `src/getMessageByDiff.ts` から `ss` を import して使う
