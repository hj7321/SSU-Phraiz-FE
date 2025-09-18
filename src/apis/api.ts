import { useAuthStore } from "@/stores/auth.store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const BASE_URL = "https://api.phraiz.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// 요청 인터셉터: 토큰 자동 부착
// 요청 인터셉터는 axios가 서버로 요청을 보내기 직전에 실행됨
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    const noAuthNeeded = ["/signUp", "/login", "/emails", "/checkId", "/findId", "/findPwd", "/resetPwd", "/oauth", "/oauth2", "/members/reissue"];

    // URL 파싱해서 pathname만 비교
    const fullUrl = new URL(config.url!, config.baseURL || BASE_URL);
    const isPublicRoute = noAuthNeeded.some((path) => fullUrl.pathname.startsWith(path));

    // headers가 없을 경우 초기화
    config.headers = config.headers || {};

    if (token && !isPublicRoute) {
      config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      console.log("✅ 요청에 토큰 붙임:", config.headers.Authorization);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 → 자동 재발급
// 응답 인터셉터는 서버로부터 응답을 받은 직후, .then()이나 .catch()로 넘어가기 직전에 실행됨
api.interceptors.response.use(
  (response) => response, // 응답이 성공한 경우는 그대로 응답 반환

  // 응답이 실패한 경우(에러일 때) 처리
  async (error: AxiosError) => {
    // 실패한 원래 요청을 가져오고, _retry라는 커스텀 플래그 추가 (재시도 여부 확인용)
    // error.config : Axios가 자동으로 넣어주는 실패한 요청의 설정 객체
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 Unauthorized + 아직 재시도 안 한 요청일 때만 수행
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 중복 재시도를 막기 위해 플래그 설정

      try {
        // 1. refresh-token 요청: httpOnly 쿠키로 보내기 때문에 withCredentials: true 설정
        // POST 구조: axios.post(url, data, config)
        // 인터셉터가 없는 순수한 axios 인스턴스 (무한루프 방지)
        const res = await axios.post(
          `${BASE_URL}/members/reissue`,
          {}, // 요청 바디는 비움
          { withCredentials: true } // 쿠키 자동 첨부
        );

        // 2. 서버가 새 accessToken 반환 → Zustand에 저장
        const { accessToken, id } = res.data;
        console.log("🔑 재발급된 accessToken:", accessToken);
        useAuthStore.getState().login(accessToken, id);

        // 3. 원래 실패한 요청의 Authorization 헤더를 새 토큰으로 덮어쓰기
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = accessToken;

        // 4. 원래 요청 재시도 → 새 토큰으로 요청 재전송
        // api(...)는 내부적으로 axios.request(...)와 같음
        // 즉, config를 통째로 넘기면 axios가 그것에 맞게 다시 요청을 보냄
        return api(originalRequest);
      } catch (refreshError) {
        // 5. 리프레시 토큰도 만료 or 서버 오류 → 강제 로그아웃
        console.error("❌ refresh 실패:", refreshError);
        useAuthStore.getState().logout();
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";

        // 에러를 그대로 밖으로 던짐 → 이후 catch에서 처리 가능
        return Promise.reject(refreshError);
      }
    }

    // 위 조건에 해당하지 않으면 일반 에러로 그대로 처리
    return Promise.reject(error);
  }
);
