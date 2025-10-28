"use client";

import { SidebarProvider } from "@/components/sidebar/Sidebar";
import { ReactNode, useEffect, useState } from "react";

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

export default function ResponsiveSidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const isMobile = useMediaQuery("(min-width: 768px)");

  return (
    <SidebarProvider
      defaultOpen={false}
      panelWidth={270} // 펼쳤을 때 폭 (데스크탑 기준)
      railWidth={isMobile ? 44 : 56} // ← 모바일 레일 유지
    >
      {children}
    </SidebarProvider>
  );
}
