import SignUpForm from "@/components/form/SignUpForm";
// import SignUpShell from "@/components/shell/SignUpShell";
import { Metadata } from "next";
// import dynamic from "next/dynamic";
import React from "react";

export const metadata: Metadata = {
  title: "회원가입",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sign-up" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://ssu-phraiz-fe.vercel.app/sign-up",
    title: "Phraiz",
    description: "회원가입",
    images: ["/opengraph/sign-up.jpg"],
  },
};

// const SignUpForm = dynamic(() => import("@/components/form/SignUpForm"), {
//   suspense: true,
// });

export default function SignUpPage() {
  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center overflow-hidden">
      <div className="flex flex-col gap-[25px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.4))] mt-[-90px]">
        {/* <Suspense fallback={<SignUpShell />}> */}
        <SignUpForm />
        {/* </Suspense> */}
      </div>
    </section>
  );
}
