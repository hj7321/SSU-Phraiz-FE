"use client";

import useLoginForm from "@/hooks/useLoginForm";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

const SocialButtons = () => {
  const { handleSocialLogin, isLoggingIn } = useLoginForm();

  return (
    <div className="flex gap-[20px]">
      <button
        type="button"
        onClick={() => !isLoggingIn && handleSocialLogin("google")}
        aria-label="구글로 로그인"
        disabled={isLoggingIn}
        className={clsx(isLoggingIn && "opacity-60 cursor-not-allowed")}
      >
        <Image
          src="/images/button_google.svg"
          alt="google"
          width={55}
          height={55}
        />
      </button>
      <button
        type="button"
        onClick={() => !isLoggingIn && handleSocialLogin("naver")}
        aria-label="네이버로 로그인"
        disabled={isLoggingIn}
        className={clsx(isLoggingIn && "opacity-60 cursor-not-allowed")}
      >
        <Image
          src="/images/button_naver.svg"
          alt="naver"
          width={55}
          height={55}
        />
      </button>
      <button
        type="button"
        onClick={() => !isLoggingIn && handleSocialLogin("kakao")}
        aria-label="카카오로 로그인"
        disabled={isLoggingIn}
        className={clsx(isLoggingIn && "opacity-60 cursor-not-allowed")}
      >
        <Image
          src="/images/button_kakao.svg"
          alt="kakao"
          width={55}
          height={55}
        />
      </button>
    </div>
  );
};

export default SocialButtons;
