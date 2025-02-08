import { TOTP } from "totp-generator";

export const getTotpPassPhrase = () => {
  if (!process.env.LOGIN_TOTP_SECRET) {
    throw new Error("LOGIN_TOTP_SECRET is not defined");
  }
  const secret = process.env.LOGIN_TOTP_SECRET;

  const { otp } = TOTP.generate(secret);
  return otp;
};
