"use client";

import InputWithLabel from "@/components/ui/input/InputWithLabel";
import useLoginForm from "@/hooks/useLoginForm";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const { id, setId, pw, setPw, handleLogin, handleSocialLogin, isLoggingIn } =
    useLoginForm();

  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <div className="flex flex-col gap-[25px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.4))] mt-[-90px]">
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
          <p className="flex-shrink mx-[8px] text-gray-500 text-[14px]">or</p>
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
              "text-[14px] w-[255px] text-white py-[10px] rounded-[4px] ",
              isLoggingIn ? "bg-main/40" : "bg-main/70 hover:bg-main"
            )}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div className="text-[12px] flex justify-center gap-[6px]">
          <Link href="/find-id" className="text-[#595959] hover:text-black">
            아이디 찾기
          </Link>
          <div className="text-gray-500">│</div>
          <Link href="/reset-pw" className="text-[#595959] hover:text-black">
            비밀번호 재설정하기
          </Link>
        </div>
      </div>
    </section>
  );
}
