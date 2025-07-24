"use client";

import InputWithLabel from "@/components/ui/input/InputWithLabel";
import useSignupForm from "@/hooks/useSignupForm";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";

export default function SignUpPage() {
  const {
    email,
    setEmail,
    isEmailInvalid,
    emailErrorMessage,

    emailNum,
    setEmailNum,

    id,
    setId,
    isIdInvalid,
    idErrorMessage,

    pw,
    setPw,
    isPwInvalid,
    pwErrorMessage,

    pwCheck,
    setPwCheck,
    isPwCheckInvalid,
    pwCheckErrorMessage,

    handleSendEmail,
    handleVerifyEmailNum,
    handleCheckIdDuplicated,
    handleSignup,

    isSendingEmailNum,
    isEmailNumSendSuccessful,
    isEmailNumSendFailed,
    emailInputDisabled,

    remainingTime,
    isCheckingEmailNumber,
    isEmailVerifySuccessful,
    isEmailVerifyFailed,

    isVerifyButtonEnabled,
    isCheckingIdDuplicated,
    isIdAvailable,
    isCheckFailed,

    isSigningUp,
  } = useSignupForm();

  // 1. Ref 객체 생성
  const emailInputRef = useRef<HTMLInputElement>(null);
  const emailNumInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);

  // 2. Enter 키 이벤트 핸들러
  // 2-1. 이메일 입력 필드에서 Enter 키 눌렀을 때
  const handleEmailInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isSendingEmailNum && !isEmailInvalid && email) {
        handleSendEmail(e as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    }
  };

  // 2-2. 이메일 인증번호 입력 필드에서 Enter 키 눌렀을 때
  const handleEmailNumInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isVerifyButtonEnabled && emailNum) {
        handleVerifyEmailNum(
          e as unknown as React.MouseEvent<HTMLButtonElement>
        );
      }
    }
  };

  // 2-3. 아이디 입력 필드에서 Enter 키 눌렀을 때
  const handleIdInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isIdInvalid && isEmailVerifySuccessful && id) {
        handleCheckIdDuplicated(
          e as unknown as React.MouseEvent<HTMLButtonElement>
        );
      }
    }
  };

  // 3. 부수 효과 (useEffect)
  // 3-1. 인증번호 전송 실패 시 이메일 입력 필드에 포커스
  useEffect(() => {
    if (isEmailNumSendFailed && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isEmailNumSendFailed]);

  // 3-2. 인증번호 전송 성공 시 or 인증번호 인증 실패 시 인증번호 입력 필드에 포커스
  useEffect(() => {
    if (
      (isEmailNumSendSuccessful || isEmailVerifyFailed) &&
      emailNumInputRef.current
    ) {
      emailNumInputRef.current.focus();
    }
  }, [isEmailNumSendSuccessful, isEmailVerifyFailed]);

  // 3-3. 인증번호 인증 성공 시 or 아이디 중복 시 아이디 입력 필드에 포커스
  useEffect(() => {
    if ((isEmailVerifySuccessful || isCheckFailed) && idInputRef.current) {
      idInputRef.current.focus();
    }
  }, [isEmailVerifySuccessful, isCheckFailed]);

  // 3-4. 아이디 중복 확인 성공 시 비밀번호 입력 필드에 포커스
  useEffect(() => {
    if (isIdAvailable && pwInputRef.current) {
      pwInputRef.current.focus();
    }
  }, [isIdAvailable]);

  // 4. 시간 포맷 함수 (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-[25px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.4))] mt-[-90px]"
      >
        {/* 이메일 섹션 */}
        <div className="flex flex-col gap-[5px]">
          <InputWithLabel
            id="email"
            name="email"
            type="email"
            label="이메일"
            placeholder="phraiz@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={isEmailInvalid}
            disabled={emailInputDisabled}
            ref={emailInputRef}
            onKeyDown={handleEmailInputKeyPress}
          />
          {emailErrorMessage && (
            <small className="text-[11.5px] mt-[-3.5px] text-red-500">
              {emailErrorMessage}
            </small>
          )}
          <button
            type="button"
            onClick={handleSendEmail}
            className={clsx(
              "text-[11.5px] w-[255px] text-white py-[6px] rounded-[4px]",
              isSendingEmailNum ||
                isEmailInvalid ||
                !email ||
                isEmailNumSendSuccessful
                ? "bg-main/40"
                : "bg-main/70 hover:bg-main"
            )}
            disabled={
              isSendingEmailNum ||
              isEmailInvalid ||
              !email ||
              isEmailNumSendSuccessful
            }
          >
            {isSendingEmailNum ? "전송 중..." : "인증번호 전송"}
          </button>
        </div>

        {/* 이메일 인증번호 섹션 */}
        <div className="flex justify-between">
          <InputWithLabel
            id="email-code"
            name="email-code"
            type="text"
            label="이메일 인증번호"
            width={190}
            value={emailNum}
            onChange={(e) => setEmailNum(e.target.value)}
            disabled={!isEmailNumSendSuccessful || isEmailVerifySuccessful}
            ref={emailNumInputRef}
            onKeyDown={handleEmailNumInputKeyPress}
          />
          <div className="relative flex flex-col">
            <button
              type="button"
              onClick={handleVerifyEmailNum}
              className={clsx(
                "text-[11.5px] w-[60px] text-white py-[6px] rounded-[4px]",
                !emailNum || !isVerifyButtonEnabled
                  ? "bg-main/40"
                  : "bg-main/70 hover:bg-main"
              )}
              disabled={!emailNum || !isVerifyButtonEnabled}
            >
              {isCheckingEmailNumber ? (
                "확인 중..."
              ) : isEmailVerifySuccessful ? (
                "인증 완료"
              ) : (
                <>
                  <p>확인</p>
                </>
              )}
            </button>
            <p className="absolute top-[32px] left-[10px] text-[15px]">
              {formatTime(remainingTime)}
            </p>
          </div>
        </div>

        {/* 아이디 섹션 */}
        <div className="flex flex-col">
          <div className="flex justify-between">
            <InputWithLabel
              id="id"
              name="id"
              type="text"
              label="아이디"
              width={190}
              value={id}
              onChange={(e) => setId(e.target.value)}
              isInvalid={isIdInvalid}
              ref={idInputRef}
              onKeyDown={handleIdInputKeyPress}
            />
            <button
              type="button"
              onClick={handleCheckIdDuplicated}
              className={clsx(
                "text-[11.5px] w-[60px] text-white py-[6px] rounded-[4px]",
                !isEmailVerifySuccessful ||
                  !id ||
                  isCheckingIdDuplicated ||
                  isIdInvalid ||
                  isIdAvailable
                  ? "bg-main/40"
                  : "bg-main/70 hover:bg-main"
              )}
              disabled={
                !isEmailVerifySuccessful ||
                !id ||
                isCheckingIdDuplicated ||
                isIdInvalid ||
                isIdAvailable
              }
            >
              {isCheckingIdDuplicated ? (
                "확인 중..."
              ) : isIdAvailable ? (
                <>
                  <p>사용</p>
                  <p>가능</p>
                </>
              ) : (
                <>
                  <p>중복</p>
                  <p>확인</p>
                </>
              )}
            </button>
          </div>
          {idErrorMessage && (
            <small className="text-[11.5px] mt-[1.5px] mb-[-10px] text-red-500">
              {idErrorMessage}
            </small>
          )}
        </div>

        {/* 비밀번호 섹션 */}
        <div className="flex flex-col">
          <InputWithLabel
            id="pw"
            name="pw"
            type="password"
            label="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            isInvalid={isPwInvalid}
            ref={pwInputRef}
          />
          {pwErrorMessage && (
            <small className="text-[11.5px] mt-[1.5px] mb-[-10px] text-red-500">
              {pwErrorMessage}
            </small>
          )}
        </div>

        {/* 비밀번호 확인 섹션 */}
        <div className="flex flex-col">
          <InputWithLabel
            id="pw-check"
            name="pw-check"
            type="password"
            label="비밀번호 확인"
            value={pwCheck}
            onChange={(e) => setPwCheck(e.target.value)}
            isInvalid={isPwCheckInvalid}
          />
          {pwCheckErrorMessage && (
            <small className="text-[11.5px] mt-[1.5px] mb-[-10px] text-red-500">
              {pwCheckErrorMessage}
            </small>
          )}
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className={clsx(
            "text-[14px] w-[255px] text-white py-[10px] rounded-[4px]",
            !email ||
              !emailNum ||
              !id ||
              !pw ||
              !pwCheck ||
              isSigningUp ||
              isEmailInvalid ||
              isIdInvalid ||
              isPwInvalid ||
              isPwCheckInvalid ||
              !isEmailVerifySuccessful ||
              !isIdAvailable
              ? "bg-main/40"
              : "bg-main/70 hover:bg-main"
          )}
          disabled={
            !email ||
            !emailNum ||
            !id ||
            !pw ||
            !pwCheck ||
            isSigningUp ||
            isEmailInvalid ||
            isIdInvalid ||
            isPwInvalid ||
            isPwCheckInvalid ||
            !isEmailVerifySuccessful ||
            !isIdAvailable
          }
        >
          {isSigningUp ? "회원가입 중..." : "회원가입"}
        </button>
      </form>
    </section>
  );
}
