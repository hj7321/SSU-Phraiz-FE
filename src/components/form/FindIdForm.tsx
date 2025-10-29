"use client";

import { findId } from "@/apis/findId.api";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import InputWithLabel from "../ui/input/InputWithLabel";
import clsx from "clsx";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FindIdForm = () => {
  const [email, setEmail] = useState<string>("");
  const isEmailInvalid = !!email && !emailRegex.test(email);

  const {
    mutate: findIdMutate,
    isPending: isSendingId,
    isSuccess: isIdSendSuccessful,
  } = useMutation({
    mutationKey: ["findId", email],
    mutationFn: findId,
    onSuccess: () => {
      alert("입력하신 이메일로 아이디가 전송되었습니다.");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isEmailInvalid) return;
    findIdMutate(email);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[10px] items-center">
      <div className="flex flex-col gap-[10px] items-center">
        <InputWithLabel
          id="email"
          name="email"
          type="email"
          label="이메일"
          placeholder="phraiz@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={isEmailInvalid}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        {isEmailInvalid && (
          <small className="text-[11.5px] mt-[-4.5px] text-red-500">
            이메일 형식이 올바르지 않습니다.
          </small>
        )}
        <button
          type="submit"
          disabled={
            isSendingId || isEmailInvalid || !email || isIdSendSuccessful
          }
          className={clsx(
            "text-[14px] w-[255px]  text-white py-[10px] rounded-[4px]",
            isSendingId || isEmailInvalid || !email || isIdSendSuccessful
              ? "bg-main/40"
              : "bg-main/70 hover:bg-main"
          )}
        >
          {isSendingId ? "전송 중..." : "아이디 전송"}
        </button>
      </div>
    </form>
  );
};

export default FindIdForm;
