"use client";

import InputWithLabel from "@/components/ui/input/InputWithLabel";
import useSignupForm from "@/hooks/useSignupForm";
import clsx from "clsx";

export default function SignUpPage() {
  const {
    email,
    setEmail,
    emailNum,
    setEmailNum,
    id,
    setId,
    pw,
    setPw,
    pwCheck,
    setPwCheck,
    handleSendEmail,
    handleVerifyEmailNum,
    handleSignup,
    isSendingEmail,
    isCheckingEmailNumber,
    isEmailVerified,
    isSigningUp,
  } = useSignupForm();

  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-[25px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.3))] mt-[-90px]"
      >
        <div className="flex flex-col gap-[5px]">
          <InputWithLabel
            id="email"
            name="email"
            type="email"
            label="이메일"
            placeholder="phraiz@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendEmail}
            className={clsx(
              "text-[11.5px] w-[250px] text-white py-[6px] rounded-[4px]",
              isSendingEmail ? "bg-main/40" : "bg-main/70 hover:bg-main"
            )}
            disabled={isSendingEmail}
          >
            {isSendingEmail ? "전송 중..." : "이메일 인증하기"}
          </button>
        </div>
        <div className="flex justify-between">
          <InputWithLabel
            id="email-code"
            name="email-code"
            type="text"
            label="이메일 인증번호"
            width={185}
            value={emailNum}
            onChange={(e) => setEmailNum(e.target.value)}
          />
          <button
            onClick={handleVerifyEmailNum}
            className={clsx(
              "text-[11.5px] w-[60px] text-white py-[6px] rounded-[4px]",
              isCheckingEmailNumber || isEmailVerified
                ? "bg-main/40"
                : "bg-main/70 hover:bg-main"
            )}
            disabled={isCheckingEmailNumber || isEmailVerified}
          >
            {isCheckingEmailNumber ? (
              "확인 중..."
            ) : isEmailVerified ? (
              "인증 완료"
            ) : (
              <>
                <p>인증</p>
                <p>확인</p>
              </>
            )}
          </button>
        </div>
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
        <InputWithLabel
          id="pw-check"
          name="pw-check"
          type="password"
          label="비밀번호 확인"
          value={pwCheck}
          onChange={(e) => setPwCheck(e.target.value)}
        />
        <button
          type="submit"
          className={clsx(
            "text-[14px] w-[250px] text-white py-[10px] rounded-[4px]",
            isSigningUp ? "bg-main/40" : "bg-main/70 hover:bg-main"
          )}
          disabled={isSigningUp}
        >
          {isSigningUp ? "회원가입 중..." : "회원가입"}
        </button>
      </form>
    </section>
  );
}
