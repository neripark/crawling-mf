import { TOTP } from "totp-generator";
import { getEnv } from "../../utils/env";

export const getTotpCode = () => {
  const secret = getEnv("LOGIN_TOTP_SECRET");

  const { otp } = TOTP.generate(secret);
  return otp;
};
