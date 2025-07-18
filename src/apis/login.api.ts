import { LoginType } from "@/types/auth.type";
import { api } from "./api";
import axios from "axios";

// 자체 로그인
export const selfLogin = async ({ id, pw }: LoginType) => {
  const path = "/members/login";

  try {
    const response = await api.post(path, {
      id: id,
      pwd: pw,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[selfLogin] Axios 에러: ", error);
    } else {
      console.error("[selfLogin] 일반 에러: ", error);
    }
    throw error;
  }
};

interface OAuthTokenResponseData {
  accessToken: string;
  memberId: number;
  id: string;
  email: string;
  role: string;
}

// 소셜 로그인 토큰 발급
export const requestOAuthToken = async (
  code: string
): Promise<OAuthTokenResponseData> => {
  const path = "/oauth/token";

  try {
    const response = await api.post<OAuthTokenResponseData>(path, {
      code: code,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[requestOAuthToken] Axios 에러: ", error);
    } else {
      console.error("[requestOAuthToken] 일반 에러: ", error);
    }
    throw error;
  }
};
