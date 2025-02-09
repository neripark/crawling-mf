declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly LINE_NOTIFY_TOKEN: string;
        readonly LOGIN_EMAIL: string;
        readonly LOGIN_PASSWORD: string;
        readonly LOGIN_TOTP_SECRET: string;
      }
    }
  }
}
