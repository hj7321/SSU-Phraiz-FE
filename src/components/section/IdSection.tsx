"use client";

import React, { forwardRef, memo, useCallback, useMemo } from "react";
import InputWithLabel from "../ui/input/InputWithLabel";
import clsx from "clsx";

interface IdSectionProps {
  id: string;
  setId: (v: string) => void;
  isIdInvalid: boolean;
  idErrorMessage?: string;
  isEmailVerifySuccessful: boolean;
  isCheckingIdDuplicated: boolean;
  isIdAvailable: boolean;
  onCheckIdClick: () => void;
  onIdKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const IdSection = forwardRef<HTMLInputElement, IdSectionProps>(
  function IdSection(
    {
      id,
      setId,
      isIdInvalid,
      idErrorMessage,
      isEmailVerifySuccessful,
      isCheckingIdDuplicated,
      isIdAvailable,
      onCheckIdClick,
      onIdKeyDown,
    },
    ref
  ) {
    const isCheckDisabled = useMemo(
      () =>
        !isEmailVerifySuccessful ||
        !id ||
        isCheckingIdDuplicated ||
        isIdInvalid ||
        isIdAvailable,
      [
        isEmailVerifySuccessful,
        id,
        isCheckingIdDuplicated,
        isIdInvalid,
        isIdAvailable,
      ]
    );

    const onChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value),
      [setId]
    );

    return (
      <div className="flex flex-col">
        <div className="grid grid-cols-[190px_60px] gap-[5px] w-[255px]">
          <InputWithLabel
            id="id"
            name="id"
            type="text"
            label="아이디"
            width={190}
            value={id}
            onChange={onChange}
            isInvalid={isIdInvalid}
            ref={ref}
            onKeyDown={onIdKeyDown}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={onCheckIdClick}
            className={clsx(
              "text-[11.5px] w-[60px] text-white py-[6px] rounded-[4px]",
              isCheckDisabled
                ? "bg-main/40 cursor-not-allowed"
                : "bg-main/70 hover:bg-main"
            )}
            disabled={isCheckDisabled}
            aria-disabled={isCheckDisabled}
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
    );
  }
);

export default memo(IdSection);
