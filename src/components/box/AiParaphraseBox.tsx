"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Copy } from "lucide-react";
import { requestParaphrase, ParaphraseApiMode } from "@/apis/paraphrase.api";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

const HEADER_H = 72; // px

// 모드 선택 버튼 타입 정의
type ParaphraseMode = "표준" | "학술적" | "창의적" | "유창성" | "실험적" | "사용자 지정";

// 모드 선택 버튼 UI 컴포넌트
const ModeSelector = ({ activeMode, setActiveMode, customStyle, setCustomStyle }: { activeMode: ParaphraseMode; setActiveMode: (mode: ParaphraseMode) => void; customStyle: string; setCustomStyle: (style: string) => void }) => {
  const modes: ParaphraseMode[] = ["표준", "학술적", "창의적", "유창성", "실험적"];
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

  const handleModeClick = (mode: ParaphraseMode) => {
    setActiveMode(mode);
    setIsPopoverOpen(false);
  };

  const handleCustomClick = () => {
    setActiveMode("사용자 지정");
    setIsPopoverOpen((prev) => !prev);
  };

  const baseButtonClass = "h-9 md:h-11 text-[11px] md:text-sm whitespace-nowrap rounded-full font-medium transition-all flex items-center justify-center shadow-md shadow-neutral-900/20";
  const inactiveClass = "bg-purple-100 border border-purple-600/30 hover:bg-purple-200/60";
  const activeClass = "bg-purple-200 border border-purple-600/30 ring-1 ring-purple-300";

  return (
    <div className="flex w-full gap-2 md:gap-3">
      {modes.map((mode) => (
        <button key={mode} onClick={() => handleModeClick(mode)} className={clsx("flex-1", baseButtonClass, activeMode === mode ? activeClass : inactiveClass)}>
          {mode}
        </button>
      ))}
      <div className="relative flex-1">
        <button ref={customButtonRef} onClick={handleCustomClick} className={clsx("w-full", baseButtonClass, "relative gap-2", activeMode === "사용자 지정" ? activeClass : inactiveClass)}>
          사용자 지정
          <Image src="/icons/프리미엄2.svg" alt="" width={0} height={0} className="absolute w-[30px] h-[30px] top-[-12px] right-[-5px] md:w-[45px] md:h-[45px] md:top-[-20px] md:right-[-6px]" />
        </button>
        {isPopoverOpen && (
          <div ref={popoverRef} className={clsx("absolute top-full mt-4 z-50 p-0.5", "w-[90vw] max-w-[320px] lg:w-80", "right-0 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto")}>
            <div className="relative bg-blue-50 rounded-lg shadow-2xl p-3">
              <div className={clsx("absolute -translate-x-1/2 -top-[10px] w-4 h-4 bg-blue-50 border-l-2 border-t-2 rotate-45", "left-[calc(100%-30px)] lg:left-1/2")}></div>
              <p className="text-sm text-gray-600 mb-2">원하는 문장 스타일을 입력하세요. (50자 이내)</p>
              <textarea value={customStyle} onChange={(e) => setCustomStyle(e.target.value)} maxLength={50} className="w-full h-32 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AiParaphraseBox = () => {
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

  // AI 패러프레이징 기능에 필요한 모든 상태와 로직
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeMode, setActiveMode] = useState<ParaphraseMode>("표준");
  const [customStyle, setCustomStyle] = useState("");
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

    const modeMap: Record<ParaphraseMode, ParaphraseApiMode> = {
      표준: "standard",
      학술적: "academic",
      창의적: "creative",
      유창성: "fluency",
      실험적: "experimental",
      "사용자 지정": "custom"
    };
    const apiMode = modeMap[activeMode];

    const requestData = {
      text: inputText,
      userRequestMode: activeMode === "사용자 지정" ? customStyle : undefined
    };

    try {
      const response = await requestParaphrase(apiMode, requestData);
      setOutputText(response.result);
    } catch (error) {
      console.error("API 요청 오류:", error);
      setOutputText("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full max-w-4xl flex flex-col h-full p-2 md:p-4 gap-2 md:gap-4">
        <header className="flex justify-between items-center px-[3px]">
          <h1 className="text-lg md:text-2xl font-bold text-gray-800">AI 문장 변환</h1>
        </header>
        <div className="px-[3px]">
          <ModeSelector activeMode={activeMode} setActiveMode={setActiveMode} customStyle={customStyle} setCustomStyle={setCustomStyle} />
        </div>
        <div className={clsx("flex flex-col md:flex-row", "flex-1 rounded-lg shadow-lg overflow-hidden border bg-white")}>
          <div className="w-full h-1/2 md:h-full md:w-1/2 border-b md:border-b-0 md:border-r p-2 md:p-4 flex flex-col">
            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="내용을 입력하세요." className="flex-1 w-full resize-none outline-none text-sm md:text-base" disabled={isLoading}></textarea>
            <div className="flex justify-end items-center mt-2 md:mt-4">
              <button onClick={handleApiCall} className="py-1.5 px-4 md:py-2 md:px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-semibold text-xs md:text-base" disabled={isLoading || !inputText.trim()}>
                {isLoading ? "변환 중..." : "변환하기"}
              </button>
            </div>
          </div>
          <div className="w-full h-1/2 md:h-full md:w-1/2 p-2 md:p-4 relative bg-gray-50">
            <div className="w-full h-full whitespace-pre-wrap text-gray-800 pr-10 text-sm md:text-base">{isLoading ? "결과 생성 중..." : outputText || "여기에 변환 결과가 표시됩니다."}</div>
            {outputText && (
              <button onClick={() => navigator.clipboard.writeText(outputText)} className="absolute top-3 right-3 p-2 text-gray-500 hover:bg-gray-200 rounded-full">
                <Copy className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiParaphraseBox;
