import { useAuthStore } from "@/stores/auth.store";
import axios, { InternalAxiosRequestConfig } from "axios";

export const BASE_URL = "http://52.79.34.104/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 토큰 자동 부착
// 요청 인터셉터는 axios가 서버로 요청을 보내기 직전에 실행됨
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    const noAuthNeeded = ["/signUp", "/login", "/emails", "/oauth", "/oauth2"];

    // URL 파싱해서 pathname만 비교
    const fullUrl = new URL(config.url!, config.baseURL || BASE_URL);
    const isPublicRoute = noAuthNeeded.some((path) =>
      fullUrl.pathname.startsWith(path)
    );

    // headers가 없을 경우 초기화
    config.headers = config.headers || {};

    if (token && !isPublicRoute) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      console.log("✅ 요청에 토큰 붙임:", config.headers.Authorization);
    }

    return config;
  },
  (error) => Promise.reject(error)
);
