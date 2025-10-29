"use client";

import React, { forwardRef, memo, useCallback, useMemo } from "react";
import InputWithLabel from "../ui/input/InputWithLabel";
import clsx from "clsx";

interface CodeSectionProps {
  emailNum: string;
  setEmailNum: (v: string) => void;
  isEmailNumSendSuccessful: boolean;
  isEmailVerifySuccessful: boolean;
  isVerifyButtonEnabled: boolean;
  isCheckingEmailNumber: boolean;
  remainingTime: number;
  onVerifyClick: () => void;
  onCodeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CodeSection = forwardRef<HTMLInputElement, CodeSectionProps>(
  function CodeSection(
    {
      emailNum,
      setEmailNum,
      isEmailNumSendSuccessful,
      isEmailVerifySuccessful,
      isVerifyButtonEnabled,
      isCheckingEmailNumber,
      remainingTime,
      onVerifyClick,
      onCodeKeyDown,
    },
    ref
  ) {
    const isInputDisabled =
      !isEmailNumSendSuccessful || isEmailVerifySuccessful;
    const isVerifyDisabled = useMemo(
      () => !emailNum || !isVerifyButtonEnabled,
      [emailNum, isVerifyButtonEnabled]
    );

    const onChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => setEmailNum(e.target.value),
      [setEmailNum]
    );

    const formatTime = useCallback((seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }, []);

    return (
      <div className="grid grid-cols-[190px_60px] gap-[5px] w-[255px]">
        <InputWithLabel
          id="email-code"
          name="email-code"
          type="text"
          label="이메일 인증번호"
          width={190}
          value={emailNum}
          onChange={onChange}
          disabled={isInputDisabled}
          ref={ref}
          onKeyDown={onCodeKeyDown}
          inputMode="numeric"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        <div className="relative flex flex-col">
          <button
            type="button"
            onClick={onVerifyClick}
            className={clsx(
              "text-[11.5px] w-[60px] text-white py-[6px] rounded-[4px]",
              isVerifyDisabled
                ? "bg-main/40 cursor-not-allowed"
                : "bg-main/70 hover:bg-main"
            )}
            disabled={isVerifyDisabled}
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
    );
  }
);

export default memo(CodeSection);
