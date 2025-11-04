import { useAuthStore } from "@/stores/auth.store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const BASE_URL = "https://api.phraiz.com/api";
export const API_ORIGIN = "https://api.phraiz.com";

// 비인증(공개) 경로
const PUBLIC_PATHS = [
  "/signUp",
  "/login",
  "/emails",
  "/checkId",
  "/findId",
  "/findPwd",
  "/resetPwd",
  "/oauth",
  "/oauth2",
  "/members/reissue",
];

const getPathname = (cfg: InternalAxiosRequestConfig) => {
  try {
    return new URL(cfg.url!, cfg.baseURL || BASE_URL).pathname;
  } catch {
    return cfg.url || "/";
  }
};
const isPublicRoute = (cfg: InternalAxiosRequestConfig) =>
  PUBLIC_PATHS.some((p) => getPathname(cfg).startsWith(p));
const isReissueRequest = (cfg: InternalAxiosRequestConfig) =>
  getPathname(cfg).startsWith("/members/reissue");
const isOnLoginPage = () =>
  typeof window !== "undefined" &&
  window.location.pathname.startsWith("/login");

// 안전 숫자 변환 (NaN이면 fallback)
const toNumberOr = (v: string | number, fallback = 0) => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    const publicRoute = isPublicRoute(config);

    config.headers = config.headers || {};
    if (token && !publicRoute) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

type ReissueResponse = {
  accessToken: string;
  id: string;
  planId: string | number;
};
type NormalizedReissue = {
  accessToken: string;
  id: string;
  planId: number;
};

// 동시 401 대응용 리프레시 락
let refreshPromise: Promise<NormalizedReissue> | null = null;

const isBrowser = () => typeof window !== "undefined";

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    if (!originalRequest) return Promise.reject(error);
    if (status !== 401) return Promise.reject(error);

    // 공개 경로(로그인 등)에서의 401은 그냥 에러로 전달 (세션 만료 alert 금지)
    if (isPublicRoute(originalRequest)) {
      return Promise.reject(error);
    }

    // 재발급 요청 자체이거나 이미 재시도한 요청이면 중단
    if (isReissueRequest(originalRequest) || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 토큰이 아예 없으면 리프레시 불가
    const currentToken = useAuthStore.getState().accessToken;
    if (!currentToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // 하나의 네트워크 호출만 수행하도록 락 사용
      if (!refreshPromise) {
        refreshPromise = axios
          .post<ReissueResponse>(
            `${BASE_URL}/members/reissue`,
            {},
            { withCredentials: true }
          )
          .then((res) => {
            const d = res.data;
            return {
              accessToken: d.accessToken,
              id: d.id,
              planId: toNumberOr(d.planId, 0), // 숫자로 정규화
            };
          });
      }

      const { accessToken, id, planId } = await refreshPromise;

      // 상태 갱신
      useAuthStore.getState().login(accessToken, id, planId);

      // 실패했던 원 요청의 Authorization 헤더 갱신 후 재시도
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = accessToken.startsWith("Bearer ")
        ? accessToken
        : `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout();

      // 로그인 페이지에서 중복 얼럿/리다이렉트 방지
      if (isBrowser() && !isOnLoginPage()) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null; // 다음 401을 위해 락 해제
    }
  }
);
