import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="flex px-[20px] py-[10px] justify-between items-center bg-main border-b border-b-sub">
      <Link
        href="/"
        className="font-ghanachoco text-[34px] text-white [text-shadow:2px_4px_4px_rgba(0,0,0,0.5)]"
      >
        Phraiz
      </Link>
      <div className="flex gap-[30px] text-white text-[14px]">
        <Link href="/login" className="hover:font-nanum-extrabold">
          로그인
        </Link>
        <Link href="/sign-up" className="hover:font-nanum-extrabold">
          회원가입
        </Link>
      </div>
    </header>
  );
};

export default Header;
