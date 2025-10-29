"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { requestOAuthToken } from "@/apis/login.api";

const OAuthRedirectPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  // URL 변화가 생겨도 code, error, error_description만 메모해 재계산 최소화
  const { code, oauthError, oauthErrorDesc } = useMemo(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDes = searchParams.get("error_description");
    return { code: code, oauthError: error, oauthErrorDesc: errorDes };
  }, [searchParams]);

  // StrictMode/탭 복구/리렌더 등에서 중복 mutate 방지
  const mutateStarted = useRef<boolean>(false);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: requestOAuthToken,
    retry: 1,
    onSuccess: (data) => {
      login(data.accessToken, data.id, data.planId ?? 1);
      alert(`${data.id}님, 안녕하세요!`);
      router.replace("/");
    },
    onError: (err) => {
      console.error("❌ 소셜 로그인 토큰 발급 실패", err);
      alert(`소셜 로그인에 실패했습니다: ${err.message || "알 수 없는 오류"}`);
      router.replace("/login");
    },
  });

  const handleStart = useCallback(() => {
    if (mutateStarted.current) return;
    mutateStarted.current = true;

    // 프로바이더가 오류를 전달한 경우 (사용자 취소 등)
    if (oauthError) {
      const msg = decodeURIComponent(oauthErrorDesc ?? oauthError);
      alert(`소셜 로그인이 완료되지 않았습니다: ${msg}`);
      router.replace("/login");
      return;
    }

    // 'code'가 없는 경우 (로그인 취소, 오류 발생 등)
    if (!code) {
      console.error("소셜 로그인 'code'가 URL에 없습니다.");
      alert("소셜 로그인 과정에서 오류가 발생했거나 취소되었습니다.");
      router.replace("/login");
      return;
    }

    mutate(code);
  }, [code, oauthError, oauthErrorDesc, mutate, router]);

  useEffect(() => {
    handleStart();
  }, [handleStart]);

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
