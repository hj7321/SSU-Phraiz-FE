"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Analytics() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const qs = search?.toString() ? `?${search}` : "";

    const pushEvent = () => {
      if (window.dataLayer && window.dataLayer.push) {
        window.dataLayer.push({
          event: "page_view",
          page_path: pathname + qs,
          page_location: window.location.href,
          page_title: document.title,
        });
        console.log("✅ page_view pushed:", window.location.href);
      } else {
        // GTM 아직 준비 안됨 → 100ms 후 재시도
        console.log("⏳ GTM not ready yet, retrying...");
        setTimeout(pushEvent, 100);
      }
    };

    pushEvent();
  }, [pathname, search]);

  return null;
}
