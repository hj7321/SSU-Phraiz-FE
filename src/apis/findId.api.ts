import axios from "axios";
import { api } from "./api";

// 아이디 찾기(이메일로 아이디 전송)
export const findId = async (email: string) => {
  const path = "/members/findId";

  try {
    const response = await api.post(path, {
      email: email,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error("[findId] Axios 에러: ", error.response.data.message);
        throw new Error(error.response.data.message);
      } else console.error("[findId] Axios 에러: ", error);
    } else {
      console.error("[findId] 일반 에러: ", error);
    }
    throw error;
  }
};
