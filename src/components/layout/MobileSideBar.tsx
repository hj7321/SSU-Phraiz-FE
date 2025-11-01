"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { TabKey } from "../ui/sidebar/sidebar.tabs";
import SideBarInner from "../ui/sidebar/SideBarInner";
import { useSidebarBridge } from "@/stores/sidebarBridge.store";
import { useSidebar } from "@/components/sidebar/Sidebar";

const MobileSideBar = () => {
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const { open: bridgeOpen } = useSidebarBridge();
  const { setOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(bridgeOpen), [bridgeOpen, setOpen]);

  // ✅ 헤더 bottom을 CSS 변수로 유지
  useLayoutEffect(() => {
    const header =
      (document.querySelector("[data-mobile-header]") as HTMLElement) ||
      (document.querySelector("header") as HTMLElement) ||
      null;

    const apply = () => {
      const b = header ? Math.floor(header.getBoundingClientRect().bottom) : 72;
      document.documentElement.style.setProperty(
        "--mobile-header-bottom",
        `${b}px`
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

  if (!mounted) return null;

  return (
    <div
      className={`fixed right-0 z-[9999] w-[260px] sm:w-[300px]
        transition-transform duration-300 ease-out
        pointer-events-none
        ${bridgeOpen ? "translate-x-0" : "translate-x-full"}`}
      style={{
        // ✅ 뷰포트 기준으로 고정
        top: 0,
        height: "100dvh", // iOS 주소창 변동 대응
      }}
    >
      {/* ✅ 헤더 높이만큼만 안쪽 컨테이너를 내려서 '딱 붙게' */}
      <div
        className="pointer-events-auto h-full"
        style={{
          marginTop: "var(--mobile-header-bottom, 72px)",
          height: "calc(100dvh - var(--mobile-header-bottom, 72px))",
        }}
      >
        <SideBarInner activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default MobileSideBar;
