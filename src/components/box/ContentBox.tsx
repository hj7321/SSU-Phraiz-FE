"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import CreateNewCitationBox from "./CreateNewCitationBox";
import { useCitationStore } from "@/stores/citation.store";
import { useCiteHistoryStore } from "@/stores/citeHistory.store";
import useClearContent from "@/hooks/useClearContent";
import useResetOnNewWork from "@/hooks/useResetOnNewWork";
import { useNewWorkStore } from "@/stores/newWork.store";
import ResultScreen from "../screen/ResultScreen";
import CitationHistory from "../history/CitationHistory";
import CitationGuide from "../guide/CitationGuide";

const HEADER_H = 72; // px

const ContentBox = () => {
  const [isCreatingNewCitation, setIsCreatingNewCitation] =
    useState<boolean>(true);

  const newCitation = useCitationStore((s) => s.newCitation);
  const setNewCitation = useCitationStore((s) => s.setNewCitation);
  const selectedHistory = useCiteHistoryStore((s) => s.selectedCiteHistory);
  const clearHistory = useCiteHistoryStore((s) => s.clearCiteHistory);

  const newWorkVersion = useNewWorkStore((s) => s.version);

  const displayText = useMemo(() => {
    return (
      selectedHistory?.citationText ??
      (isCreatingNewCitation ? newCitation : undefined) ??
      "결과가 출력됩니다."
    );
  }, [selectedHistory?.citationText, isCreatingNewCitation, newCitation]);

  const hasCopyText = useMemo(() => {
    return Boolean(
      selectedHistory?.citationText ??
        (isCreatingNewCitation ? newCitation : undefined)
    );
  }, [selectedHistory?.citationText, isCreatingNewCitation, newCitation]);

  const handleCopy = useCallback(() => {
    const text =
      selectedHistory?.citationText ??
      (isCreatingNewCitation ? newCitation : undefined) ??
      "";
    if (!text) return;
    navigator.clipboard.writeText(text);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "copy_result",
      feature: "copy",
      service: "cite",
    });
  }, [selectedHistory?.citationText, isCreatingNewCitation, newCitation]);

  useClearContent();

  useResetOnNewWork(() => {
    setIsCreatingNewCitation(true);
    setNewCitation("");
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
    syncOffset();
    window.addEventListener("scroll", syncOffset, { passive: true });
    return () => window.removeEventListener("scroll", syncOffset);
  }, []);

  return (
    <section className="flex flex-col w-full h-full p-4 gap-[6px] md:gap-[10px]">
      <header className="flex justify-between items-center px-[3px]">
        <h1 className="text-[18px] xs:text-[20px] md:text-2xl font-bold text-gray-800">
          인용 생성
        </h1>

        {/* 👉 헤더 우측 도움말 */}
        <div className="ml-auto">
          <CitationGuide />
        </div>
      </header>

      {selectedHistory ? (
        <div className="flex flex-col">
          <CitationHistory />
        </div>
      ) : (
        <div className="flex flex-col rounded-md shadow-md overflow-y-auto border my-[10px] h-[75vh] w-full">
          {/* 왼쪽 영역 */}
          <CreateNewCitationBox key={newWorkVersion} />
          {/* 오른쪽 영역 */}
          <ResultScreen
            text={displayText}
            onCopy={handleCopy}
            showCopy={hasCopyText}
          />
        </div>
      )}
    </section>
  );
};

export default memo(ContentBox);
