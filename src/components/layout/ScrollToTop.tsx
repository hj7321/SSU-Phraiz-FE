"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
  // 이 컴포넌트는 UI 요소를 렌더링하지 않으므로 null을 반환함
  // React 컴포넌트에서 null을 반환하면, DOM에 아무것도 그리지 않음
}
