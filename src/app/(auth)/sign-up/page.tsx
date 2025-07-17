"use client";

import InputWithLabel from "@/components/ui/input/InputWithLabel";

export default function SignUpPage() {
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const id = formData.get("id") as string;
    const pw = formData.get("pw") as string;
    const pwCheck = formData.get("pw-check") as string;
    // TODO: 서버 요청, 에러 핸들링
  };

  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-[25px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.3))]"
      >
        <InputWithLabel
          id="email"
          name="email"
          type="email"
          label="이메일"
          placeholder="phraiz@gmail.com"
        />
        <InputWithLabel id="email-code" type="text" label="이메일 인증번호" />
        <InputWithLabel id="id" name="id" type="text" label="아이디" />
        <InputWithLabel id="pw" name="pw" type="password" label="비밀번호" />
        <InputWithLabel
          id="pw-check"
          name="pw-check"
          type="password"
          label="비밀번호 확인"
        />
        <button
          type="submit"
          className="text-[14px] w-[250px] bg-main/70 text-white py-[10px] rounded-[4px] hover:bg-main"
        >
          회원가입
        </button>
      </form>
    </section>
  );
}
