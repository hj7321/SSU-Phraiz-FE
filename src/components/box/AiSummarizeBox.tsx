"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Copy } from "lucide-react";
import { requestSummarize, SummarizeApiMode } from "@/apis/summarize.api";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

const HEADER_H = 72; // px

// 모드 선택 버튼 타입 정의
type SummarizeMode = "한줄 요약" | "전체 요약" | "문단별 요약" | "핵심 요약" | "질문 기반 요약" | "타겟 요약";

// 모드 선택 버튼 UI 컴포넌트
const ModeSelector = ({ activeMode, setActiveMode, targetAudience, setTargetAudience }: { activeMode: SummarizeMode; setActiveMode: (mode: SummarizeMode) => void; targetAudience: string; setTargetAudience: (style: string) => void }) => {
  const modes: SummarizeMode[] = ["한줄 요약", "전체 요약", "문단별 요약", "핵심 요약", "질문 기반 요약"];
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const customButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && customButtonRef.current && !customButtonRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModeClick = (mode: SummarizeMode) => {
    setActiveMode(mode);
    setIsPopoverOpen(false);
  };

  const handleCustomClick = () => {
    setActiveMode("타겟 요약");
    setIsPopoverOpen((prev) => !prev);
  };

  const baseButtonClass = "h-9 md:h-11 text-[11px] md:text-sm whitespace-nowrap rounded-full font-medium transition-all flex items-center justify-center shadow-md shadow-neutral-900/20";
  const inactiveClass = "bg-purple-100 border border-purple-600/30 hover:bg-purple-200/60";
  const activeClass = "bg-purple-200 border border-purple-600/30 ring-1 ring-purple-300";

  return (
    <div className="flex w-full gap-3 md:gap-3">
      {modes.map((mode) => (
        <button key={mode} onClick={() => handleModeClick(mode)} className={clsx("flex-1", baseButtonClass, activeMode === mode ? activeClass : inactiveClass)}>
          {mode}
        </button>
      ))}
      <div className="relative flex-1">
        <button ref={customButtonRef} onClick={handleCustomClick} className={clsx("w-full", baseButtonClass, "relative gap-2", activeMode === "타겟 요약" ? activeClass : inactiveClass)}>
          타겟 요약
          <Image src="/icons/프리미엄2.svg" alt="" width={0} height={0} className="absolute w-[30px] h-[30px] top-[-12px] right-[-5px] md:w-[45px] md:h-[45px] md:top-[-20px] md:right-[-6px]" />
        </button>
        {isPopoverOpen && (
          <div ref={popoverRef} className={clsx("absolute top-full mt-4 z-50 p-0.5", "w-[90vw] max-w-[320px] lg:w-80", "right-0 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto")}>
            <div className="relative bg-blue-50 rounded-lg shadow-2xl p-3">
              <div className={clsx("absolute -translate-x-1/2 -top-[10px] w-4 h-4 bg-blue-50 border-l-2 border-t-2 rotate-45", "left-[calc(100%-30px)] lg:left-1/2")}></div>
              <p className="text-sm text-gray-600 mb-2">요약 내용을 전달할 대상을 입력하세요. (20자 이내)</p>
              <textarea value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} maxLength={20} className="w-full h-32 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AiSummarizeBox = () => {
  useEffect(() => {
    let ticking = false;
    const syncOffset = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = Math.max(HEADER_H - window.scrollY, 0);
        document.documentElement.style.setProperty("--header-offset", `${offset}px`);
        ticking = false;
      });
    };
    syncOffset();
    window.addEventListener("scroll", syncOffset, { passive: true });
    return () => window.removeEventListener("scroll", syncOffset);
  }, []);
  // =============================================================

  // AI 요약 기능에 필요한 모든 상태와 로직
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeMode, setActiveMode] = useState<SummarizeMode>("한줄 요약");
  const [targetAudience, setTargetAudience] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = useAuthStore((s) => s.isLogin);
  const router = useRouter();

  const handleApiCall = async () => {
    if (!isLogin) {
      alert("로그인 후에 이용해주세요.");
      router.push("/login");
      return;
    }

    if (!inputText.trim()) return;
    setIsLoading(true);
    setOutputText("");
    // UI의 한글 모드 이름을 API가 요구하는 영문 이름으로 변환합니다.
    const modeMap: Record<SummarizeMode, SummarizeApiMode> = {
      "한줄 요약": "one-line",
      "전체 요약": "full",
      "문단별 요약": "by-paragraph",
      "핵심 요약": "key-points",
      "질문 기반 요약": "question-based",
      "타겟 요약": "targeted"
    };
    const apiMode = modeMap[activeMode];

    // API에 보낼 데이터를 구성합니다.
    const requestData = {
      text: inputText,
      question: activeMode === "질문 기반 요약" ? "질문 입력 (여기서 UI에서 받은 질문값으로 대체 필요)" : undefined, // TODO: UI에서 질문 입력 받는 부분 추가 필요
      target: activeMode === "타겟 요약" ? targetAudience : undefined
    };

    try {
      // API 파일을 통해 요청을 보냅니다.
      const response = await requestSummarize(apiMode, requestData);
      setOutputText(response.result); // '.result' 키로 결과값을 사용합니다.
    } catch (error) {
      console.error("API 요청 오류:", error);
      setOutputText("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full p-2 md:p-4 gap-2 md:gap-4">
      <header className="flex justify-between items-center px-[3px]">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">AI 요약</h1>
      </header>
      <div className="px-[3px]">
        <ModeSelector activeMode={activeMode} setActiveMode={setActiveMode} targetAudience={targetAudience} setTargetAudience={setTargetAudience} />
      </div>
      <div className={clsx("flex flex-col md:flex-row", "flex-1 rounded-lg shadow-lg overflow-hidden border bg-white")}>
        <div className="w-full h-1/2 md:h-full md:w-1/2 border-b md:border-b-0 md:border-r p-2 md:p-4 flex flex-col">
          <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="내용을 입력하세요." className="flex-1 w-full resize-none outline-none text-sm md:text-base" disabled={isLoading}></textarea>
          <div className="flex justify-between items-center mt-2 md:mt-4">
            <button className="flex items-center gap-1 md:gap-[6px]">
              <Image src="/icons/upload.svg" alt="" width={22} height={22} />
              <p className="hover:font-nanum-bold text-xs md:text-sm">파일 업로드하기</p>
            </button>
            <button onClick={handleApiCall} className="py-1.5 px-4 md:py-2 md:px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-semibold text-xs md:text-base" disabled={isLoading || !inputText.trim()}>
              {isLoading ? "요약 중..." : "요약하기"}
            </button>
          </div>
        </div>
        <div className="w-full h-1/2 md:h-full md:w-1/2 p-2 md:p-4 relative bg-gray-50">
          <div className="w-full h-full whitespace-pre-wrap text-gray-800 pr-10 text-sm md:text-base">{isLoading ? "요약 생성 중..." : outputText || "여기에 요약 결과가 표시됩니다."}</div>
          {outputText && (
            <button onClick={() => navigator.clipboard.writeText(outputText)} className="absolute top-3 right-3 p-2 text-gray-500 hover:bg-gray-200 rounded-full">
              <Copy className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiSummarizeBox;
