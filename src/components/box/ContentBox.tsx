"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useSidebar } from "../ui/sidebar/sidebar";
import CreateNewCitationBox from "./CreateNewCitationBox";
import ChangeExistedCitationBox from "./ChangeExistedCitationBox";

const HEADER_H = 72; // px

const ContentBox = () => {
  const { open } = useSidebar();

  const [isCreatingNewCitation, setIsCreatingNewCitation] =
    useState<boolean>(true);

  // const {mutate} = useMutation({
  //   mutationKey: ["createCitation", urlValue,]
  // })

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
    <section className="flex flex-col h-full p-4 space-y-4">
      <header className="flex justify-between items-center px-[3px]">
        <h1 className="text-2xl font-bold text-gray-800">인용 생성</h1>
      </header>
      <div className="flex gap-[15px]">
        <button
          onClick={() => setIsCreatingNewCitation(true)}
          className={clsx(
            "rounded-full p-[10px] px-[20px] text-white bg-gradient-to-b from-[#4613ff] to-[#a37eff] [filter:drop-shadow(0px_0px_2px_rgba(70,19,255,1))] hover:shadow-[0_0_0_1px_#ab8ff2] hover:[filter:drop-shadow(0px_0px_4px_rgba(70,19,255,1))] transition-shadow duration-300"
          )}
        >
          새 인용문 생성
        </button>
        <button
          onClick={() => setIsCreatingNewCitation(false)}
          className={clsx(
            "rounded-full p-[10px] px-[20px] text-white bg-gradient-to-b from-[#4613ff] to-[#a37eff] [filter:drop-shadow(0px_0px_2px_rgba(70,19,255,1))] hover:shadow-[0_0_0_1px_#ab8ff2] hover:[filter:drop-shadow(0px_0px_4px_rgba(70,19,255,1))] transition-shadow duration-300"
          )}
        >
          기존 인용문 변환
        </button>
      </div>
      <div
        className={clsx(
          "flex flex-1 rounded-md shadow-md overflow-y-auto border my-[10px]",
          open ? "w-[calc(100vw_-_437px)]" : "w-[calc(100vw_-_223px)]"
        )}
      >
        {/* 왼쪽 영역 */}
        {isCreatingNewCitation ? (
          <CreateNewCitationBox />
        ) : (
          <ChangeExistedCitationBox />
        )}

        {/* 오른쪽 영역 */}
        <div className="w-1/2 p-[16px]">{/* 여기에 결과 등 출력 */}</div>
      </div>
    </section>
  );
};

export default ContentBox;
