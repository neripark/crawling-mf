import { TOTP } from "totp-generator";

export const getTotpCode = () => {
  // todo: 型注釈を追加してundefinedを考慮しないで済むようにする
  if (!process.env.LOGIN_TOTP_SECRET) {
    throw new Error("LOGIN_TOTP_SECRET is not defined");
  }
  const secret = process.env.LOGIN_TOTP_SECRET;

  const { otp } = TOTP.generate(secret);
  return otp;
};
