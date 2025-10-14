import FindIdForm from "@/components/form/FindIdForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "아이디 찾기",
  robots: { index: false, follow: false },
  alternates: { canonical: "/find-id" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://ssu-phraiz-fe.vercel.app/find-id",
    title: "Phraiz",
    description: "아이디 찾기",
    images: ["/opengraph/find-id.jpg"],
  },
};

export default function FindIdPage() {
  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <div className="flex flex-col gap-[35px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.4))] mt-[-100px] items-center">
        <div className="flex flex-col items-center gap-[8px]">
          <h1 className="font-nanum-extrabold text-[22px]">아이디 찾기</h1>
          <div className="text-[13px] flex flex-col items-center">
            <p>회원가입 시 등록한 이메일을 입력해 주세요.</p>
            <p>해당 이메일로 아이디 정보를 전송해 드립니다.</p>
          </div>
        </div>
        <FindIdForm />
        <Link
          href="/login"
          className="text-[12px] mt-[-15px] text-[#595959] hover:text-black"
        >
          로그인 페이지로 이동
        </Link>
      </div>
    </section>
  );
}
