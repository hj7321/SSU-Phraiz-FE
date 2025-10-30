import SocialButtons from "@/components/button/SocialButtons";
import LoginForm from "@/components/form/LoginForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "로그인",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.phraiz.com/login",
    title: "Phraiz",
    description: "로그인",
    images: ["/opengraph/login.jpg"],
  },
};

export default function LoginPage() {
  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center">
      <div className="flex flex-col gap-[25px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.4))] mt-[-90px]">
        <div className="flex flex-col gap-[14px] items-center">
          <p className="text-[13px]">간편 로그인</p>
          <SocialButtons />
        </div>
        <div className="flex items-center mt-[-5px] mb-[5px]">
          <div className="flex-grow border-t border-gray-300"></div>
          <p className="flex-shrink mx-[8px] text-gray-500 text-[14px]">or</p>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <LoginForm />
        <div className="text-[12px] flex justify-center gap-[6px]">
          <Link href="/find-id" className="text-[#595959] hover:text-black">
            아이디 찾기
          </Link>
          <div className="text-gray-500">│</div>
          <Link href="/reset-pw" className="text-[#595959] hover:text-black">
            비밀번호 재설정하기
          </Link>
        </div>
      </div>
    </section>
  );
}
