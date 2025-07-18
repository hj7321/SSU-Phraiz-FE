"use client";

import { checkEmailNumber, sendEmail, signup } from "@/apis/signup.api";
import InputWithLabel from "@/components/ui/input/InputWithLabel";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();

  // 각 입력 필드의 상태 정의
  const [email, setEmail] = useState<string>("");
  const [emailNum, setEmailNum] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [pwCheck, setPwCheck] = useState<string>("");

  // 이메일 인증번호 전송 뮤테이션
  const {
    mutate: sendEmailMutate,
    isPending: isSendingEmail,
    // isError: isSendEmailError,
    // error: sendEmailError,
  } = useMutation({
    mutationKey: ["sendEmail"],
    mutationFn: sendEmail,
    onSuccess: (response) => {
      console.log("✅ 인증번호 전송 성공", response);
      alert("인증번호가 이메일로 전송되었습니다. 확인해주세요.");
      // 성공 시 추가적인 UI 업데이트 (예: 인증번호 입력 필드 활성화 등)
    },
    onError: (err) => {
      console.error("❌ 인증번호 전송 실패", err);
      alert(`인증번호 전송에 실패했습니다: ${err}`);
    },
  });

  // 이메일 인증번호 확인 뮤테이션
  const {
    mutate: checkEmailNumberMutate,
    isPending: isCheckingEmailNumber,
    // isError: isCheckEmailNumberError,
    // error: checkEmailNumberError,
    isSuccess: isEmailVerified, // 이메일 인증 성공 여부 상태
  } = useMutation({
    mutationKey: ["checkEmailNumber"],
    mutationFn: checkEmailNumber,
    onSuccess: (response) => {
      console.log("✅ 인증번호 일치", response);
      alert("이메일 인증이 완료되었습니다!");
      // 성공 시 추가적인 UI 업데이트 (예: 인증 완료 메시지 표시)
    },
    onError: (err) => {
      console.error("❌ 인증번호 불일치", err);
      alert(`이메일 인증번호 확인에 실패했습니다: ${err}`);
    },
  });

  // 회원가입 뮤테이션
  const {
    mutate: signupMutate,
    isPending: isSigningUp,
    // isError: isSignupError,
    // error: signupError,
  } = useMutation({
    mutationKey: ["signup"],
    mutationFn: signup,
    onSuccess: (response) => {
      console.log("✅ 회원가입 완료", response);
      alert("회원가입이 성공적으로 완료되었습니다!");
      router.push("/login"); // 회원가입 성공 시 로그인 페이지로 이동
    },
    onError: (err) => {
      console.error("❌ 회원가입 실패", err);
      alert(`회원가입에 실패했습니다: ${err}`);
    },
  });

  // 이메일 인증 버튼 클릭 핸들러
  const handleSendEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 폼 제출 방지
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    sendEmailMutate(email);
  };

  // 인증번호 확인 버튼 클릭 핸들러
  const handleVerifyEmailNum = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 폼 제출 방지
    if (!email || !emailNum) {
      alert("이메일과 인증번호를 모두 입력해주세요.");
      return;
    }
    checkEmailNumberMutate({ email, emailNum });
  };

  // 회원가입 폼 제출 핸들러
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드 입력 확인
    if (!email || !emailNum || !id || !pw || !pwCheck) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 비밀번호 일치 확인
    if (pw !== pwCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 이메일 인증이 완료되었는지 확인
    // 실제 서비스에서는 `isEmailVerified` 상태를 활용하여 이메일 인증이 완료된 후에만 회원가입이 가능하도록 제어하는 것이 좋습니다.
    // 현재는 단순히 상태를 통해 확인하고, 필요하다면 백엔드에서 다시 검증할 수 있습니다.
    // if (!isEmailVerified) {
    //   alert("이메일 인증을 먼저 완료해주세요.");
    //   return;
    // }

    signupMutate({ id, pw, email });
  };

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
            value={emailNum} // 상태와 연결
            onChange={(e) => setEmailNum(e.target.value)} // 상태 업데이트
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
