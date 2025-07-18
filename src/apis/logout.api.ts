import axios from "axios";
import { api } from "./api";

// 로그아웃
export const logout = async () => {
  const path = "/members/logout";

  try {
    const response = await api.post(path);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[logout] Axios 에러: ", error);
    } else {
      console.error("[logout] 일반 에러: ", error);
    }
    throw error;
  }
};
