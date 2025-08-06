"use client";

import { useNavbarStore } from "@/stores/navbar.store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MobileHeader = () => {
  const openNavbar = useNavbarStore((s) => s.openNavbar);

  return (
    <header className="relative z-50 flex py-[10px] justify-center items-center bg-main">
      <button onClick={openNavbar} className="absolute left-[5%] top-[33%]">
        <Image src="/icons/menu.svg" alt="menu" width={25} height={25} />
      </button>
      <Link
        href="/"
        className="font-ghanachoco text-[28px] text-white [text-shadow:2px_4px_4px_rgba(0,0,0,0.5)]"
      >
        Phraiz
      </Link>
    </header>
  );
};

export default MobileHeader;
