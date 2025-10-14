import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const ResetPwForm = dynamic(() => import("@/components/form/ResetPwForm"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "비밀번호 재설정하기",
  robots: { index: false, follow: false },
  alternates: { canonical: "/reset-pw" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://ssu-phraiz-fe.vercel.app/reset-pw",
    title: "Phraiz",
    description: "비밀번호 재설정하기",
    images: ["/opengraph/reset-pw.jpg"],
  },
};

export default function ResetPwPage() {
  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <div className="flex flex-col gap-[35px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.4))] mt-[-100px] items-center">
        <div className="flex flex-col items-center gap-[8px]">
          <h1 className="font-nanum-extrabold text-[22px]">
            비밀번호 재설정하기
          </h1>
          <div className="text-[13px] flex flex-col items-center">
            <p>회원가입 시 등록한 이메일을 입력해 주세요.</p>
            <p>해당 이메일로 비밀번호 재설정 링크를 전송해 드립니다.</p>
          </div>
        </div>
        <ResetPwForm />
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
