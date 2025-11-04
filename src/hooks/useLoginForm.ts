import { API_ORIGIN, BASE_URL } from "@/apis/api";
import { selfLogin } from "@/apis/login.api";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormState {
  id: string;
  pw: string;
}

interface LoginFormActions {
  setId: (id: string) => void;
  setPw: (pw: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleSocialLogin: (provider: "google" | "naver" | "kakao") => void;
  isLoggingIn: boolean;
}

const useLoginForm = (): LoginFormState & LoginFormActions => {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  // 1. 상태 정의
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");

  // 2. 뮤테이션 정의
  // 2-1. 로그인 뮤테이션
  const { mutate: loginMutate, isPending: isLoggingIn } = useMutation({
    mutationKey: ["selfLogin", id],
    mutationFn: selfLogin,
    onSuccess: (data) => {
      login(data.accessToken, data.id, data.planId);

      // ✅ GTM 이벤트 푸시
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "login_success",
        feature: "auth",
        method: "self",
        user_id: data.id,
      });

      alert(`${data.id}님, 안녕하세요!`);
      router.push("/"); // 로그인 성공 시 홈페이지로 이동
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  // 3. 핸들러 정의
  // 3-1. 로그인 폼 제출 핸들러
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 모든 필드 입력 확인
    if (!id || !id.trim() || !pw || !pw.trim()) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    loginMutate({ id, pw });
  };

  // 3-2. 소셜 로그인 핸들러
  const handleSocialLogin = (provider: "google" | "naver" | "kakao") => {
    // window.location.origin을 사용하여 현재 프론트엔드의 도메인을 가져옴
    const origin = window.location.origin;
    const redirectUrl = encodeURIComponent(`${origin}/login/oauth`);
    // const redirectUrl = encodeURIComponent(
    //   `https://www.phraiz.com/login/oauth`
    // );

    // 백엔드의 소셜 로그인 인증 시작 URL
    const socialLoginUrl = `${API_ORIGIN}/oauth2/authorization/${provider}?redirectUrl=${redirectUrl}`;

    window.location.href = socialLoginUrl;
  };

  // 4. 컴포넌트에서 사용할 상태와 함수 반환
  return {
    id,
    setId,
    pw,
    setPw,
    handleLogin,
    handleSocialLogin,
    isLoggingIn,
  };
};

export default useLoginForm;
