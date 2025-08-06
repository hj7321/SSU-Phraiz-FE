"use client";

import { sendResetPwLink } from "@/apis/findpw.api";
import InputWithLabel from "@/components/ui/input/InputWithLabel";
import useSignupForm from "@/hooks/useSignupForm";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";

export default function ResetPwPage() {
  const { email, setEmail, isEmailInvalid, emailErrorMessage } =
    useSignupForm();

  const {
    mutate: sendResetPwLinkMutate,
    isPending: isSendingResetPwLink,
    isSuccess: isLinkSendSuccessful,
  } = useMutation({
    mutationKey: ["sendResetPwLink"],
    mutationFn: sendResetPwLink,
    onSuccess: (data) => {
      console.log("✅ 비밀번호 재설정 링크 전송 성공", data);
      alert("입력하신 이메일로 비밀번호 재설정 링크가 전송되었습니다.");
    },
    onError: (err) => {
      console.error("❌ 비밀번호 재설정 링크 전송 실패: ", err.message);
      alert(err.message);
    },
  });

  const handleSendResetPwLink = (e: React.FormEvent) => {
    e.preventDefault();
    sendResetPwLinkMutate(email);
  };

  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <form
        onSubmit={handleSendResetPwLink}
        className="flex flex-col gap-[35px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.4))] mt-[-100px] items-center"
      >
        <div className="flex flex-col items-center gap-[8px]">
          <h1 className="font-nanum-extrabold text-[22px]">
            비밀번호 재설정하기
          </h1>
          <div className="text-[13px] flex flex-col items-center">
            <p>회원가입 시 등록한 이메일을 입력해 주세요.</p>
            <p>해당 이메일로 비밀번호 재설정 링크를 전송해 드립니다.</p>
          </div>
        </div>

        <div className="flex flex-col gap-[10px]">
          <InputWithLabel
            id="email"
            name="email"
            type="email"
            label="이메일"
            placeholder="phraiz@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={isEmailInvalid}
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
              isSendingResetPwLink ||
                isEmailInvalid ||
                !email ||
                isLinkSendSuccessful
                ? "bg-main/40"
                : "bg-main/70 hover:bg-main"
            )}
            disabled={
              isSendingResetPwLink ||
              isEmailInvalid ||
              !email ||
              isLinkSendSuccessful
            }
          >
            {isSendingResetPwLink ? "전송 중..." : "비밀번호 재설정 링크 전송"}
          </button>
        </div>
        <Link
          href="/login"
          className="text-[12px] mt-[-15px] text-[#595959] hover:text-black"
        >
          로그인 페이지로 이동
        </Link>
      </form>
    </section>
  );
}
