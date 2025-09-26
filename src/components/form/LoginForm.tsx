"use client";

import useLoginForm from "@/hooks/useLoginForm";
import React from "react";
import InputWithLabel from "../ui/input/InputWithLabel";
import clsx from "clsx";

const LoginForm = () => {
  const { id, setId, pw, setPw, handleLogin, isLoggingIn } = useLoginForm();

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-[25px]"
      aria-busy={isLoggingIn}
    >
      <InputWithLabel
        id="id"
        name="id"
        type="text"
        label="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
      />
      <InputWithLabel
        id="pw"
        name="pw"
        type="password"
        label="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        autoComplete="current-password"
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
  );
};

export default LoginForm;
