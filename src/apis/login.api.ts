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
