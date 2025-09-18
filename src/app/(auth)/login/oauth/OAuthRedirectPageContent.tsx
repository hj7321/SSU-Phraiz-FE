"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { requestOAuthToken } from "@/apis/login.api";

const OAuthRedirectPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: requestOAuthToken,
    onSuccess: (data) => {
      login(data.accessToken, data.id, 1);
      alert(`${data.id}님, 안녕하세요!`);
      router.push("/");
    },
    onError: (err) => {
      console.error("❌ 소셜 로그인 토큰 발급 실패", err);
      alert(`소셜 로그인에 실패했습니다: ${err.message || "알 수 없는 오류"}`);
      router.push("/login");
    },
  });

  useEffect(() => {
    // 1. URL에서 'code' 파라미터 추출
    const code = searchParams.get("code");

    if (code) {
      // 2. 'code'가 있으면 토큰 발급 API 호출
      mutate(code); // useMutation의 mutate 함수 호출
    } else {
      // 3. 'code'가 없는 경우 (예: 로그인 취소, 오류 발생 등)
      console.error("소셜 로그인 'code'가 URL에 없습니다.");
      alert("소셜 로그인 과정에서 오류가 발생했거나 취소되었습니다.");
      router.push("/login"); // 로그인 페이지로 돌아감
    }
  }, [searchParams, mutate, router, login]); // 의존성 배열에 mutate, router, login 추가

  // 로딩 중임을 사용자에게 알리는 UI
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">
        소셜 로그인 처리 중...
      </h1>
      {isPending && <p className="text-gray-600 mt-4">잠시만 기다려 주세요.</p>}
      {isError && (
        <p className="text-red-500 mt-4">
          오류가 발생했습니다: {error?.message}
        </p>
      )}
    </div>
  );
};

export default OAuthRedirectPageContent;
