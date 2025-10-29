"use client";

import React, { memo, useCallback } from "react";
import InputWithLabel from "../ui/input/InputWithLabel";

interface PasswordSectionProps {
  pw: string;
  setPw: (v: string) => void;
  isPwInvalid: boolean;
  pwErrorMessage?: string;
  pwCheck: string;
  setPwCheck: (v: string) => void;
  isPwCheckInvalid: boolean;
  pwCheckErrorMessage?: string;
}

const PasswordSection = ({
  pw,
  setPw,
  isPwInvalid,
  pwErrorMessage,
  pwCheck,
  setPwCheck,
  isPwCheckInvalid,
  pwCheckErrorMessage,
}: PasswordSectionProps) => {
  const onPwChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPw(e.target.value),
    [setPw]
  );

  const onPwCheckChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPwCheck(e.target.value),
    [setPwCheck]
  );

  return (
    <>
      <div className="flex flex-col w-[255px]">
        <InputWithLabel
          id="pw"
          name="pw"
          type="password"
          label="비밀번호"
          value={pw}
          onChange={onPwChange}
          isInvalid={isPwInvalid}
          autoComplete="new-password"
        />
        {pwErrorMessage && (
          <small className="text-[11.5px] mt-[1.5px] mb-[-10px] text-red-500">
            {pwErrorMessage}
          </small>
        )}
      </div>

      <div className="flex flex-col w-[255px]">
        <InputWithLabel
          id="pw-check"
          name="pw-check"
          type="password"
          label="비밀번호 확인"
          value={pwCheck}
          onChange={onPwCheckChange}
          isInvalid={isPwCheckInvalid}
          autoComplete="new-password"
        />
        {pwCheckErrorMessage && (
          <small className="text-[11.5px] mt-[1.5px] mb-[-10px] text-red-500">
            {pwCheckErrorMessage}
          </small>
        )}
      </div>
    </>
  );
};

export default memo(PasswordSection);
