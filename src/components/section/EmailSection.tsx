"use client";

import React, { forwardRef, memo, useCallback, useMemo } from "react";
import InputWithLabel from "../ui/input/InputWithLabel";
import clsx from "clsx";

interface EmailSectionProps {
  email: string;
  setEmail: (v: string) => void;
  isEmailInvalid: boolean;
  emailErrorMessage?: string;
  emailInputDisabled: boolean;
  isSendingEmailNum: boolean;
  isEmailNumSendSuccessful: boolean;
  onSendEmailClick: () => void;
  onEmailKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const EmailSection = forwardRef<HTMLInputElement, EmailSectionProps>(
  function EmailSection(
    {
      email,
      setEmail,
      isEmailInvalid,
      emailErrorMessage,
      emailInputDisabled,
      isSendingEmailNum,
      isEmailNumSendSuccessful,
      onSendEmailClick,
      onEmailKeyDown,
    },
    ref
  ) {
    const isSendDisabled = useMemo(
      () =>
        isSendingEmailNum ||
        isEmailInvalid ||
        !email ||
        isEmailNumSendSuccessful,
      [isSendingEmailNum, isEmailInvalid, email, isEmailNumSendSuccessful]
    );

    const onChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
      },
      [setEmail]
    );
    return (
      <div className="flex flex-col gap-[5px] w-[255px]">
        <InputWithLabel
          id="email"
          name="email"
          type="email"
          label="이메일"
          placeholder="phraiz@gmail.com"
          value={email}
          onChange={onChange}
          isInvalid={isEmailInvalid}
          disabled={emailInputDisabled}
          ref={ref}
          onKeyDown={onEmailKeyDown}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        {emailErrorMessage && (
          <small className="text-[11.5px] mt-[-3.5px] text-red-500">
            {emailErrorMessage}
          </small>
        )}
        <button
          type="button"
          onClick={onSendEmailClick}
          className={clsx(
            "text-[11.5px] w-[255px] text-white py-[6px] rounded-[4px]",
            isSendDisabled
              ? "bg-main/40 cursor-not-allowed"
              : "bg-main/70 hover:bg-main"
          )}
          disabled={isSendDisabled}
        >
          {isSendingEmailNum ? "전송 중..." : "인증번호 전송"}
        </button>
      </div>
    );
  }
);

export default memo(EmailSection);
