"use client";

import { useEffect, useState } from "react";
import DesktopSideBar from "./DesktopSideBar";
import MobileSideBar from "./MobileSideBar";

const SideBar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? <MobileSideBar /> : <DesktopSideBar />;
};

export default SideBar;
