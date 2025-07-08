import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="z-50 flex px-[30px] py-[10px] justify-between items-center bg-main">
      <Link
        href="/"
        className="font-ghanachoco text-[34px] text-white [text-shadow:2px_4px_4px_rgba(0,0,0,0.5)]"
      >
        Phraiz
      </Link>
      <div className="flex gap-[10px] text-black text-[14px]">
        <Link href="/login" className="hover:font-nanum-extrabold">
          <div className="bg-gradient-to-r from-white to-main backdrop-blur-md border-[0.2px] border-white/60 rounded-full py-[6px] px-[24px]">
            로그인
          </div>
        </Link>
        <Link href="/sign-up" className="hover:font-nanum-extrabold">
          <div className="bg-gradient-to-r from-white to-main backdrop-blur-md border-[0.2px] border-white/60 rounded-full py-[6px] px-[24px]">
            회원가입
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
