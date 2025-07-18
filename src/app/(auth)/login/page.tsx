"use client";

import { BASE_URL } from "@/apis/api";
import { selfLogin } from "@/apis/login.api";
import InputWithLabel from "@/components/ui/input/InputWithLabel";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");

  const login = useAuthStore((s) => s.login);

  // 로그인 뮤테이션
  const { mutate: loginMutate, isPending: isLoggingIn } = useMutation({
    mutationKey: ["selfLogin"],
    mutationFn: selfLogin,
    onSuccess: (response) => {
      login(response.data.id);
      console.log("✅ 로그인 완료", response);
      alert("로그인이 성공적으로 완료되었습니다!");
      router.push("/"); // 로그인 성공 시 홈페이지로 이동
    },
    onError: (err) => {
      console.error("❌ 로그인 실패", err);
      alert(`로그인에 실패했습니다: ${err}`);
    },
  });

  // 로그인 폼 제출 핸들러
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 모든 필드 입력 확인
    if (!id || !pw) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    loginMutate({ id, pw });
  };

  // 소셜 로그인 핸들러
  const handleSocialLogin = (provider: "google" | "naver" | "kakao") => {
    const redirectUrl = encodeURIComponent(
      `https://ssu-phraiz-fe.vercel.app/login/oauth`
    );

    // 백엔드의 소셜 로그인 인증 시작 URL
    const socialLoginUrl = `${BASE_URL}/oauth2/authorization/${provider}?redirectUrl=${redirectUrl}`;

    // 사용자를 해당 URL로 리다이렉션
    //  Next.js 환경에서는 window.location.origin을 사용하여 현재 도메인을 가져오는 것이 안전함
    window.location.href = socialLoginUrl;
  };

  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <div className="flex flex-col gap-[25px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.3))] mt-[-90px]">
        <div className="flex flex-col gap-[14px] items-center">
          <p className="text-[13px]">간편 로그인</p>
          <div className="flex gap-[20px]">
            <button onClick={() => handleSocialLogin("google")}>
              <Image
                src="/images/button_google.svg"
                alt="google"
                width={55}
                height={55}
              />
            </button>
            <button onClick={() => handleSocialLogin("naver")}>
              <Image
                src="/images/button_naver.svg"
                alt="naver"
                width={55}
                height={55}
              />
            </button>
            <button onClick={() => handleSocialLogin("kakao")}>
              <Image
                src="/images/button_kakao.svg"
                alt="kakao"
                width={55}
                height={55}
              />
            </button>
          </div>
        </div>
        <div className="flex items-center mt-[-5px] mb-[5px]">
          <div className="flex-grow border-t border-gray-300"></div>
          <p className="flex-shrink mx-[8px] text-gray-500 text-sm">or</p>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-[25px]">
          <InputWithLabel
            id="id"
            name="id"
            type="text"
            label="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <InputWithLabel
            id="pw"
            name="pw"
            type="password"
            label="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <button
            type="submit"
            className={clsx(
              "text-[14px] w-[250px]  text-white py-[10px] rounded-[4px] ",
              isLoggingIn ? "bg-main/40" : "bg-main/70 hover:bg-main"
            )}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </section>
  );
}
