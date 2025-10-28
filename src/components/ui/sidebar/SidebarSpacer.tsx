"use client";
import { ReactNode, useEffect, useState } from "react";
import { useSidebar } from "@/components/sidebar/Sidebar";

function useMediaQuery(q: string) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return m;
}

export default function SidebarSpacer({ children }: { children: ReactNode }) {
  const { open } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 1024px)"); // <lg

  return (
    <main
      className="w-full flex min-h-0"
      style={{
        // 모바일: 항상 0 (overlay)
        // 데스크톱: 열렸을 때만 패널폭만큼 밀고, 닫히면 rail 만큼만(원하면 0으로 바꿔도 됨)
        paddingRight: isMobile
          ? 0
          : open
          ? "var(--sb-w)"
          : "var(--sb-rail-w, 48px)",
        transition: "padding-right 320ms cubic-bezier(.22,.8,.22,1)",
      }}
    >
      {children}
    </main>
  );
}
