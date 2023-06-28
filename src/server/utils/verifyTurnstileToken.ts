import axios from "axios";
import { env } from "~/env.mjs";

interface VerifyTokenResponse {
  data: {
    success: string;
    "error-codes": string[];
    messages: string[];
  };
}
type getVerifyStatusReturnType = "SUCCESS" | "FAILED";
export const getVerifyStatus = async (
  token: string
): Promise<getVerifyStatusReturnType> => {
  const VERIFY_URL =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  let status: getVerifyStatusReturnType = "FAILED";

  try {
    const response: VerifyTokenResponse = await axios.post(VERIFY_URL, {
      secret: env.TURNSTILE_SECRET,
      response: token,
    });

    const { success } = response.data;
    if (success) {
      status = "SUCCESS";
    }
  } catch (error) {}
  return status;
};
