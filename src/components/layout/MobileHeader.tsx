"use client";

import { useNavbarStore } from "@/stores/navbar.store";
import { LucideHistory } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarBridge } from "@/stores/sidebarBridge.store"; // ✅
import { useLayoutEffect } from "react";

const MobileHeader = () => {
  const openNavbar = useNavbarStore((s) => s.openNavbar);
  const pathname = usePathname();
  const { toggle } = useSidebarBridge(); // ✅ 토글 사용

  const servicePaths = ["/ai-paraphrase", "/ai-summarize", "/create-citation"];
  const showHistoryIcon = servicePaths.some((p) => pathname.startsWith(p));

  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-mobile-header]");
    const apply = () => {
      const b = header?.getBoundingClientRect().bottom ?? 72;
      document.documentElement.style.setProperty(
        "--mobile-header-bottom",
        `${Math.floor(b)}px`
      );
    };
    apply();
    const ro = header ? new ResizeObserver(apply) : null;
    if (header && ro) ro.observe(header);
    window.addEventListener("resize", apply);
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("orientationchange", apply);
    return () => {
      if (header && ro) ro.disconnect();
      window.removeEventListener("resize", apply);
      window.removeEventListener("scroll", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  return (
    <header
      data-mobile-header // ✅ 헤더 높이 동기화용
      className="relative z-[9000] flex py-[10px] justify-center items-center bg-main"
    >
      <button onClick={openNavbar} className="absolute left-[5%] top-[33%]">
        <Image src="/icons/menu.svg" alt="menu" width={25} height={25} />
      </button>

      <Link
        href="/"
        className="font-ghanachoco text-[28px] text-white [text-shadow:2px_4px_4px_rgba(0,0,0,0.5)]"
      >
        Phraiz
      </Link>

      {showHistoryIcon && (
        <button
          onClick={toggle} // ✅ 열려있으면 닫히고, 닫혀있으면 열림
          data-mobile-history-icon // (옵션) 필요 시 outside 클릭 구분용
          className="absolute right-[5%] top-[33%] text-white"
        >
          <LucideHistory className="w-[25px] h-[25px]" />
        </button>
      )}
    </header>
  );
};

export default MobileHeader;
