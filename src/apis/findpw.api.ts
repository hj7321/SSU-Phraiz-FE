import axios from "axios";
import { api } from "./api";
import { ResetPasswordType } from "@/types/auth.type";
import { SuccessResponseData } from "@/types/common.type";

// 비밀번호 재설정 링크 전송
export const sendResetPwLink = async (
  email: string
): Promise<SuccessResponseData> => {
  const path = "/members/findPwd";

  try {
    const response = await api.post<SuccessResponseData>(path, {
      email: email,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[sendResetPwLink] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[sendResetPwLink] Axios 에러: ", error);
    } else {
      console.error("[sendResetPwLink] 일반 에러: ", error);
    }
    throw error;
  }
};

// 비밀번호 재설정
export const resetPassword = async ({
  token,
  newPwd,
}: ResetPasswordType): Promise<SuccessResponseData> => {
  const path = "/members/resetPwd";

  try {
    const response = await api.post<SuccessResponseData>(path, {
      token: token,
      newPwd: newPwd,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[resetPassword] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[resetPassword] Axios 에러: ", error);
    } else {
      console.error("[resetPassword] 일반 에러: ", error);
    }
    throw error;
  }
};
