declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv extends RequiredEnvironmentVariables {}
    }
  }
}

/**
 * アプリケーションで必要な環境変数の型。
 *
 * @remarks .env と同期されている必要がある。
 */
interface RequiredEnvironmentVariables {
  readonly LINE_NOTIFY_TOKEN: string;
  readonly LOGIN_EMAIL: string;
  readonly LOGIN_PASSWORD: string;
  readonly LOGIN_TOTP_SECRET: string;
}
