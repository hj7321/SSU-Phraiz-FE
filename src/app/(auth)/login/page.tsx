import InputWithLabel from "@/components/ui/input/InputWithLabel";

export default function LoginPage() {
  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <div className="flex flex-col gap-[25px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.3))]">
        <InputWithLabel id="id" type="text" label="아이디" />
        <InputWithLabel id="pw" type="password" label="비밀번호" />
      </div>
    </section>
  );
}
