"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import CreateNewCitationBox from "./CreateNewCitationBox";
import ChangeExistedCitationBox from "./ChangeExistedCitationBox";
import { useCitationStore } from "@/stores/citation.store";
import { useHistoryStore } from "@/stores/history.store";
import useClearContent from "@/hooks/useClearContent";
import useResetOnNewWork from "@/hooks/useResetOnNewWork";
import { Copy } from "lucide-react";
import { useNewWorkStore } from "@/stores/newWork.store";

const HEADER_H = 72; // px

const ContentBox = () => {
  const [isCreatingNewCitation, setIsCreatingNewCitation] =
    useState<boolean>(true);

  const newCitation = useCitationStore((s) => s.newCitation);
  const setNewCitation = useCitationStore((s) => s.setNewCitation);
  const changedCitation = useCitationStore((s) => s.changedCitation);
  const setChangedCitation = useCitationStore((s) => s.setChangedCitation);

  const selectedHistory = useHistoryStore((s) => s.selectedHistory);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  const newWorkVersion = useNewWorkStore((s) => s.version);

  const displayText =
    selectedHistory?.content ??
    (isCreatingNewCitation ? newCitation : changedCitation) ??
    "결과가 출력됩니다.";

  useClearContent();

  useResetOnNewWork(() => {
    setIsCreatingNewCitation(true);
    setNewCitation("");
    setChangedCitation("");
    clearHistory();
  });

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
    <section className="flex flex-col w-full h-full p-4 gap-[6px] md:gap-[10px]">
      <header className="flex justify-between items-center px-[3px]">
        <h1 className="text-[18px] xs:text-[20px] md:text-2xl font-bold text-gray-800">
          인용 생성
        </h1>
      </header>
      <div className="flex gap-[10px] md:gap-[15px] text-[12px] md:text-[16px]">
        <button
          onClick={() => setIsCreatingNewCitation(true)}
          className={clsx(
            "rounded-full py-[6px] px-[12px] md:py-[10px] md:px-[20px] text-white transition-all duration-300",
            isCreatingNewCitation
              ? "bg-gradient-to-b from-[#4613ff] to-[#a37eff] [filter:drop-shadow(0px_0px_2px_rgba(70,19,255,1))] hover:shadow-[0_0_0_1px_#ab8ff2]"
              : "bg-[#a37eff]/40 hover:shadow-[0_0_0_1px_rgba(163,126,255,0.5)]"
          )}
        >
          새 인용문 생성
        </button>
        <button
          onClick={() => setIsCreatingNewCitation(false)}
          className={clsx(
            "rounded-full py-[6px] px-[12px] md:py-[10px] md:px-[20px] text-white  transition-all duration-300",
            isCreatingNewCitation
              ? "bg-[#a37eff]/40 hover:shadow-[0_0_0_1px_rgba(163,126,255,0.5)]"
              : "bg-gradient-to-b from-[#4613ff] to-[#a37eff] [filter:drop-shadow(0px_0px_2px_rgba(70,19,255,1))]"
          )}
        >
          기존 인용문 변환
        </button>
      </div>
      <div
        className={clsx(
          "flex flex-col rounded-md shadow-md overflow-y-auto border my-[10px] h-full w-full"
          // open ? "lg:w-[calc(100vw_-_437px)]" : "lg:w-[calc(100vw_-_223px)]",
        )}
      >
        {/* 왼쪽 영역 */}
        {isCreatingNewCitation ? (
          <CreateNewCitationBox key={newWorkVersion} />
        ) : (
          <ChangeExistedCitationBox key={newWorkVersion} />
        )}

        {/* 오른쪽 영역 */}
        <div className="relative w-full p-[16px] pr-10 border-t whitespace-pre-wrap break-words">
          {displayText}

          {Boolean(
            selectedHistory?.content ??
              (isCreatingNewCitation ? newCitation : changedCitation)
          ) && (
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  selectedHistory?.content ||
                    (isCreatingNewCitation ? newCitation : changedCitation)!
                )
              }
              className="absolute top-3 right-3 p-2 text-gray-500 hover:bg-gray-200 rounded-full z-10"
              aria-label="결과 복사"
              title="복사"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentBox;
