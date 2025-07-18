import { BASE_URL } from "@/apis/api";
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
    onSuccess: (response) => {
      login(response.data.accessToken, response.data.id);
      console.log("✅ 로그인 완료", response);
      alert("로그인이 성공적으로 완료되었습니다!");
      router.push("/"); // 로그인 성공 시 홈페이지로 이동
    },
    onError: (err) => {
      console.error("❌ 로그인 실패", err);
      alert(`로그인에 실패했습니다: ${err}`);
    },
  });

  // 3. 핸들러 정의
  // 3-1. 로그인 폼 제출 핸들러
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 모든 필드 입력 확인
    if (!id || !pw) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    loginMutate({ id, pw });
  };

  // 3-2. 소셜 로그인 핸들러
  const handleSocialLogin = (provider: "google" | "naver" | "kakao") => {
    const redirectUrl = encodeURIComponent(
      `https://ssu-phraiz-fe.vercel.app/login/oauth`
    );

    // 백엔드의 소셜 로그인 인증 시작 URL
    const socialLoginUrl = `${BASE_URL}/oauth2/authorization/${provider}?redirectUrl=${redirectUrl}`;

    // 사용자를 해당 URL로 리다이렉션
    // Next.js 환경에서는 window.location.origin을 사용하여 현재 도메인을 가져오는 것이 안전함
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
