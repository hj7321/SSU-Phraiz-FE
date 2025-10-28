"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Analytics() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    const qs = search?.toString() ? `?${search}` : "";
    window.dataLayer.push({
      event: "pageview",
      page_path: pathname + qs,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]); // ← 경로/쿼리 바뀔 때마다 pageview 전송

  return null;
}
