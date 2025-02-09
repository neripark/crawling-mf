import { RequiredEnvironmentVariables } from "../types/env";

const environmentVariables: Readonly<
  Record<keyof RequiredEnvironmentVariables, string>
> = {
  LOGIN_EMAIL: process.env.LOGIN_EMAIL,
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD,
  LINE_NOTIFY_TOKEN: process.env.LINE_NOTIFY_TOKEN,
  LOGIN_TOTP_SECRET: process.env.LOGIN_TOTP_SECRET,
};

/**
 * 環境変数の存在を確認する関数
 *
 * @throws {Error} 必要な環境変数が存在しない場合
 */
export const validateEnvironmentVariables = (): void => {
  Object.entries(environmentVariables).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`必要な環境変数 '${key}' がありません。`);
    }
  });
};

/**
 * 環境変数を取得する関数。
 *
 * @param key 取得したい環境変数のキー。
 * @returns 環境変数の値。
 */
export const getEnv = (key: keyof RequiredEnvironmentVariables) =>
  environmentVariables[key];
