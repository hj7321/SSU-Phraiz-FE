"use client";

import InputWithLabel from "@/components/ui/input/InputWithLabel";

export default function LoginPage() {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const id = formData.get("id") as string;
    const pw = formData.get("pw") as string;
    // TODO: 서버 요청, 에러 핸들링
  };

  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-[25px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.3))]"
      >
        <InputWithLabel id="id" name="id" type="text" label="아이디" />
        <InputWithLabel id="pw" name="pw" type="password" label="비밀번호" />
        <button
          type="submit"
          className="text-[14px] w-[250px] bg-main/70 text-white py-[10px] rounded-[4px] hover:bg-main"
        >
          로그인
        </button>
      </form>
    </section>
  );
}
