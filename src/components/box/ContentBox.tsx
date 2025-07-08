"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import { useSidebar } from "../ui/sidebar/sidebar";

const HEADER_H = 72; // px

const ContentBox = () => {
  const { open } = useSidebar();

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

  return (
    <div
      className={clsx(
        "flex rounded-md shadow-md overflow-hidden border my-[10px] mx-[20px]",
        open ? "w-[calc(100vw_-_437px)]" : "w-[calc(100vw_-_223px)]"
      )}
    >
      {/* 왼쪽 영역 */}
      <div className="w-1/2 border-r p-4 flex flex-col">
        <textarea
          placeholder="내용을 입력하세요."
          className="flex-1 resize-none outline-none"
        ></textarea>
        <button className="mt-4 text-sm text-gray-600 flex items-center gap-1">
          <span>⤴</span> 파일 업로드하기
        </button>
      </div>

      {/* 오른쪽 영역 */}
      <div className="w-1/2 p-4">{/* 여기에 결과 등 출력 */}</div>
    </div>
  );
};

export default ContentBox;
