"use client";

import { useEffect, useState } from "react";
import { TabKey } from "../ui/sidebar/sidebar.tabs";
import SideBarInner from "../ui/sidebar/SideBarInner";

const HEADER_H = 72; // px

const DesktopSideBar = () => {
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);

  useEffect(() => {
    let ticking = false;

    const syncOffset = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const offset = Math.max(HEADER_H - window.scrollY, 0);
        document.documentElement.style.setProperty(
          "--header-offset",
          `${offset}px`
        );
        ticking = false;
      });
    };

    syncOffset(); // 첫 렌더에서 한 번
    window.addEventListener("scroll", syncOffset, { passive: true });
    return () => window.removeEventListener("scroll", syncOffset);
  }, []);

  return <SideBarInner activeTab={activeTab} setActiveTab={setActiveTab} />;
};

export default DesktopSideBar;
