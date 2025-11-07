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
import { useWorkHistory } from "@/stores/workHistory.store";
import { readLatestHistory } from "@/apis/history.api";
import { toast } from "@/hooks/use-toast";

const HEADER_H = 72; // px

const ContentBox = () => {
  const [isCreatingNewCitation, setIsCreatingNewCitation] =
    useState<boolean>(true);
  const [style, setStyle] = useState<string>("");
  const [citationText, setCitationText] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  const [currentSequence, setCurrentSequence] = useState<number>(1);

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

  const {
    currentCiteHistoryId,
    currentCiteSequence,
    updateCiteWork,
    resetCiteWork,
  } = useWorkHistory();

  // 이전 히스토리 보기
  const handlePrevSequence = async () => {
    if (currentSequence <= 1 || !currentCiteHistoryId) return;

    try {
      const content = await readLatestHistory({
        service: "cite",
        historyId: currentCiteHistoryId,
        sequenceNumber: currentSequence - 1,
      });
      console.log(content);

      setStyle(content.style);
      setCitationText(content.citationText || "");
      setUrl(content.url);
      setCurrentSequence(currentSequence - 1);
    } catch (error) {
      console.error("이전 히스토리 조회 실패:", error);
      toast({
        title: "오류",
        description: "이전 히스토리를 불러올 수 없습니다.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // 다음 히스토리 보기
  const handleNextSequence = async () => {
    if (currentSequence >= currentCiteSequence || !currentCiteHistoryId) return;

    try {
      const content = await readLatestHistory({
        service: "cite",
        historyId: currentCiteHistoryId,
        sequenceNumber: currentSequence + 1,
      });
      console.log(content);

      setStyle(content.style);
      setCitationText(content.citationText || "");
      setUrl(content.url);
      setCurrentSequence(currentSequence + 1);
    } catch (error) {
      console.error("다음 히스토리 조회 실패:", error);
      toast({
        title: "오류",
        description: "다음 히스토리를 불러올 수 없습니다.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

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

  // 선택된 히스토리가 바뀔 때 지역 상태 동기화 + 작업 상태 업데이트
  useEffect(() => {
    if (!selectedHistory) return;
    setIsCreatingNewCitation(false);
    setStyle(selectedHistory.style ?? "");
    setCitationText(selectedHistory.citationText ?? "");
    setUrl(selectedHistory.url ?? "");
    setCurrentSequence(selectedHistory.sequenceNumber ?? 1);
    updateCiteWork(selectedHistory.id, selectedHistory.sequenceNumber ?? 1);
  }, [selectedHistory, updateCiteWork]);

  //  “새 작업” 트리거 시(사이드바 버튼) 완전 초기화
  useResetOnNewWork(() => {
    setIsCreatingNewCitation(true);
    setNewCitation("");
    setStyle("");
    setCitationText("");
    setUrl("");
    setCurrentSequence(1);
    clearHistory();
    resetCiteWork(); // ← 이것 때문에 상단 화살표 사라짐
  });

  return (
    <section className="flex flex-col w-full h-full p-4 gap-[6px] md:gap-[10px]">
      <header className="flex justify-between items-center px-[3px]">
        <h1 className="text-[18px] xs:text-[20px] md:text-2xl font-bold text-gray-800">
          인용 생성
        </h1>

        <div className="ml-auto flex items-center gap-2">
          {/* 현재 작업 중인 historyId가 있을 때만 표시 */}
          {currentCiteHistoryId && currentCiteSequence > 1 && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg border">
              <button
                onClick={handlePrevSequence}
                disabled={currentSequence <= 1}
                className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                title="이전"
              >
                ←
              </button>

              <span className="text-sm font-mono px-2">
                {currentSequence} / {currentCiteSequence}
              </span>

              <button
                onClick={handleNextSequence}
                disabled={currentSequence >= currentCiteSequence}
                className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                title="다음"
              >
                →
              </button>
            </div>
          )}
          <CitationGuide />
        </div>
      </header>

      {selectedHistory ? (
        <div className="flex flex-col">
          <CitationHistory
            style={style}
            citationText={citationText}
            url={url}
          />
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
