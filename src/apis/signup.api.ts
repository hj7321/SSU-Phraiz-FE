import axios from "axios";
import { api } from "./api";
import { CheckEmailNumberType, SignupType } from "@/types/auth.type";

// 이메일로 인증번호 전송
export const sendEmail = async (email: string) => {
  const path = "/members/emails/mailSend";

  try {
    const response = await api.post(path, { email: email });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error("[sendEmail] Axios 에러: ", error.response.data.message);
        throw new Error(error.response.data.message);
      } else console.error("[sendEmail] Axios 에러: ", error);
    } else {
      console.error("[sendEmail] 일반 에러: ", error);
    }
    throw error;
  }
};

// 이메일 인증번호 확인
export const checkEmailNumber = async ({
  email,
  emailNum,
}: CheckEmailNumberType) => {
  const path = "/members/emails/mailAuthCheck";

  try {
    const response = await api.post(path, {
      email: email,
      authNum: emailNum,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[checkEmailNumber] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[checkEmailNumber] Axios 에러: ", error);
    } else {
      console.error("[checkEmailNumber] 일반 에러: ", error);
    }
    throw error;
  }
};

// 아이디 중복 확인
export const checkIdDuplicated = async (id: string) => {
  const path = "/members/checkId";

  try {
    const response = await api.post(path, { id: id });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[checkIdDuplicated] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[checkIdDuplicated] Axios 에러: ", error);
    } else {
      console.error("[checkIdDuplicated] 일반 에러: ", error);
    }
    throw error;
  }
};

// 회원가입
export const signup = async ({ id, pw, email }: SignupType) => {
  const path = "/members/signUp";

  try {
    const response = await api.post(path, {
      id: id,
      pwd: pw,
      email: email,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error("[signup] Axios 에러: ", error.response.data.message);
        throw new Error(error.response.data.message);
      } else console.error("[signup] Axios 에러: ", error);
    } else {
      console.error("[signup] 일반 에러: ", error);
    }
    throw error;
  }
};
