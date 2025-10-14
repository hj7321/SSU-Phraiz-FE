"use client";

import { sendResetPwLink } from "@/apis/findpw.api";
import useSignupForm from "@/hooks/useSignupForm";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useMemo } from "react";
import InputWithLabel from "../ui/input/InputWithLabel";
import clsx from "clsx";

const ResetPwForm = () => {
  const { email, setEmail, isEmailInvalid, emailErrorMessage } =
    useSignupForm();

  const {
    mutate: sendResetPwLinkMutate,
    isPending: isSendingResetPwLink,
    isSuccess: isLinkSendSuccessful,
  } = useMutation({
    mutationKey: ["sendResetPwLink"],
    mutationFn: sendResetPwLink,
    retry: 1,
    onSuccess: () => {
      alert("입력하신 이메일로 비밀번호 재설정 링크가 전송되었습니다.");
    },
    onError: (err) => {
      console.error("❌ 비밀번호 재설정 링크 전송 실패: ", err.message);
      alert(err.message);
    },
  });

  const isSubmitDisabled = useMemo(
    () =>
      isSendingResetPwLink || isEmailInvalid || !email || isLinkSendSuccessful,
    [isSendingResetPwLink, isEmailInvalid, email, isLinkSendSuccessful]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitDisabled) return;
      sendResetPwLinkMutate(email);
    },
    [email, isSubmitDisabled, sendResetPwLinkMutate]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    [setEmail]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[10px] items-center w-full"
      aria-busy={isSendingResetPwLink}
    >
      <div className="flex flex-col gap-[10px] items-center w-full">
        <InputWithLabel
          id="email"
          name="email"
          type="email"
          label="이메일"
          placeholder="phraiz@gmail.com"
          value={email}
          onChange={handleChange}
          isInvalid={isEmailInvalid}
          autoComplete="email"
          inputMode="email"
        />
        {emailErrorMessage && (
          <small className="text-[11.5px] mt-[-4.5px] text-red-500">
            {emailErrorMessage}
          </small>
        )}
        <button
          type="submit"
          className={clsx(
            "text-[14px] w-[255px]  text-white py-[10px] rounded-[4px]",
            isSubmitDisabled
              ? "bg-main/40 cursor-not-allowed"
              : "bg-main/70 hover:bg-main"
          )}
          disabled={isSubmitDisabled}
          aria-disabled={isSubmitDisabled}
        >
          {isSendingResetPwLink
            ? "전송 중..."
            : isLinkSendSuccessful
            ? "전송 완료"
            : "비밀번호 재설정 링크 전송"}
        </button>
      </div>
    </form>
  );
};

export default ResetPwForm;
