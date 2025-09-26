"use client";

import useSignupForm from "@/hooks/useSignupForm";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import EmailSection from "../section/EmailSection";
import CodeSection from "../section/CodeSection";
import IdSection from "../section/IdSection";
import PasswordSection from "../section/PasswordSection";
import clsx from "clsx";

const SignUpForm = () => {
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
  const sendEmailBtnRef = useRef<HTMLButtonElement>(null);
  const verifyBtnRef = useRef<HTMLButtonElement>(null);
  const checkIdBtnRef = useRef<HTMLButtonElement>(null);

  // 2. Enter 키 이벤트 핸들러
  // 2-1. 이메일 입력 필드에서 Enter 키 눌렀을 때
  const onEmailKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (
        !(
          isSendingEmailNum ||
          isEmailInvalid ||
          !email ||
          isEmailNumSendSuccessful
        )
      ) {
        sendEmailBtnRef.current?.click();
      }
    },
    [isSendingEmailNum, isEmailInvalid, email, isEmailNumSendSuccessful]
  );

  // 2-2. 이메일 인증번호 입력 필드에서 Enter 키 눌렀을 때
  const onCodeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (isVerifyButtonEnabled && emailNum) {
        verifyBtnRef.current?.click();
      }
    },
    [isVerifyButtonEnabled, emailNum]
  );

  // 2-3. 아이디 입력 필드에서 Enter 키 눌렀을 때
  const onIdKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (!isIdInvalid && isEmailVerifySuccessful && id) {
        checkIdBtnRef.current?.click();
      }
    },
    [isIdInvalid, isEmailVerifySuccessful, id]
  );

  // 3. 부수 효과 (useEffect)
  // 3-1. 인증번호 전송 실패 시 이메일 입력 필드에 포커스
  useEffect(() => {
    if (isEmailNumSendFailed) emailInputRef.current?.focus();
  }, [isEmailNumSendFailed]);

  // 3-2. 인증번호 전송 성공 시 or 인증번호 인증 실패 시 인증번호 입력 필드에 포커스
  useEffect(() => {
    if (isEmailNumSendSuccessful || isEmailVerifyFailed)
      emailNumInputRef.current?.focus();
  }, [isEmailNumSendSuccessful, isEmailVerifyFailed]);

  // 3-3. 인증번호 인증 성공 시 or 아이디 중복 시 아이디 입력 필드에 포커스
  useEffect(() => {
    if (isEmailVerifySuccessful || isCheckFailed) idInputRef.current?.focus();
  }, [isEmailVerifySuccessful, isCheckFailed]);

  // 3-4. 아이디 중복 확인 성공 시 비밀번호 입력 필드에 포커스
  useEffect(() => {
    if (isIdAvailable) pwInputRef.current?.focus();
  }, [isIdAvailable]);

  // 4. 최종 제출 비활성화 조건 메모화
  const isSubmitDisabled = useMemo(
    () =>
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
      !isIdAvailable,
    [
      email,
      emailNum,
      id,
      pw,
      pwCheck,
      isSigningUp,
      isEmailInvalid,
      isIdInvalid,
      isPwInvalid,
      isPwCheckInvalid,
      isEmailVerifySuccessful,
      isIdAvailable,
    ]
  );

  // 5. 폼 제출 함수 (회원가입)
  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitDisabled) return;
      handleSignup(e);
    },
    [isSubmitDisabled, handleSignup]
  );

  // 6. 버튼 클릭 핸들러를 안정화
  const onSendEmailClick = useCallback(() => {
    sendEmailBtnRef.current?.blur();
    // @ts-expect-error
    handleSendEmail();
  }, [handleSendEmail]);

  const onVerifyClick = useCallback(() => {
    verifyBtnRef.current?.blur();
    // @ts-expect-error
    handleVerifyEmailNum();
  }, [handleVerifyEmailNum]);

  const onCheckIdClick = useCallback(() => {
    checkIdBtnRef.current?.blur();
    // @ts-expect-error
    handleCheckIdDuplicated();
  }, [handleCheckIdDuplicated]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[25px] items-center">
      {/* 이메일 섹션 */}
      <EmailSection
        ref={emailInputRef}
        email={email}
        setEmail={setEmail}
        isEmailInvalid={isEmailInvalid}
        emailErrorMessage={emailErrorMessage}
        emailInputDisabled={emailInputDisabled}
        isSendingEmailNum={isSendingEmailNum}
        isEmailNumSendSuccessful={isEmailNumSendSuccessful}
        onSendEmailClick={onSendEmailClick}
        onEmailKeyDown={onEmailKeyDown}
      />
      {/* 이메일 인증번호 섹션 */}
      <CodeSection
        ref={emailNumInputRef}
        emailNum={emailNum}
        setEmailNum={setEmailNum}
        isEmailNumSendSuccessful={isEmailNumSendSuccessful}
        isEmailVerifySuccessful={isEmailVerifySuccessful}
        isVerifyButtonEnabled={isVerifyButtonEnabled}
        isCheckingEmailNumber={isCheckingEmailNumber}
        remainingTime={remainingTime}
        onVerifyClick={onVerifyClick}
        onCodeKeyDown={onCodeKeyDown}
      />
      {/* 아이디 섹션 */}
      <IdSection
        ref={idInputRef}
        id={id}
        setId={setId}
        isIdInvalid={isIdInvalid}
        idErrorMessage={idErrorMessage}
        isEmailVerifySuccessful={isEmailVerifySuccessful}
        isCheckingIdDuplicated={isCheckingIdDuplicated}
        isIdAvailable={isIdAvailable}
        onCheckIdClick={onCheckIdClick}
        onIdKeyDown={onIdKeyDown}
      />
      {/* 비밀번호 및 비밀번호 확인 섹션 */}
      <PasswordSection
        pw={pw}
        setPw={setPw}
        isPwInvalid={isPwInvalid}
        pwErrorMessage={pwErrorMessage}
        pwCheck={pwCheck}
        setPwCheck={setPwCheck}
        isPwCheckInvalid={isPwCheckInvalid}
        pwCheckErrorMessage={pwCheckErrorMessage}
      />
      {/* 회원가입 버튼 */}
      <button
        type="submit"
        className={clsx(
          "text-[14px] w-[255px] text-white py-[10px] rounded-[4px]",
          isSubmitDisabled
            ? "bg-main/40 cursor-not-allowed"
            : "bg-main/70 hover:bg-main"
        )}
        disabled={isSubmitDisabled}
      >
        {isSigningUp ? "회원가입 중..." : "회원가입"}
      </button>
    </form>
  );
};

export default SignUpForm;
