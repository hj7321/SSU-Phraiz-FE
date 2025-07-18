"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { useSidebar } from "../ui/sidebar/sidebar";
import { Copy } from "lucide-react";
import { requestParaphrase, ParaphraseApiMode } from "@/apis/paraphrase.api";
import Image from "next/image";

const HEADER_H = 72;

// 모드 선택 버튼 타입 정의
type ParaphraseMode =
  | "표준"
  | "학술적"
  | "창의적"
  | "유창성"
  | "실험적"
  | "사용자 지정";

// 모드 선택 버튼 UI 컴포넌트
const ModeSelector = ({
  activeMode,
  setActiveMode,
  customStyle,
  setCustomStyle,
}: {
  activeMode: ParaphraseMode;
  setActiveMode: (mode: ParaphraseMode) => void;
  customStyle: string;
  setCustomStyle: (style: string) => void;
}) => {
  const modes: ParaphraseMode[] = [
    "표준",
    "학술적",
    "창의적",
    "유창성",
    "실험적",
  ];
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const customButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        customButtonRef.current &&
        !customButtonRef.current.contains(event.target as Node)
      ) {
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

  // 버튼 디자인
  const baseButtonClass =
    "h-11 rounded-full text-medium font-medium transition-all flex items-center justify-center shadow-md shadow-neutral-900/20";
  const inactiveClass =
    "bg-purple-100 border border-purple-600/30 hover:bg-purple-200/60";
  const activeClass =
    "bg-purple-200 border border-purple-600/30 ring-1 ring-purple-300";

  return (
    <div className="flex w-full gap-3">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => handleModeClick(mode)}
          className={clsx(
            "flex-1",
            baseButtonClass,
            activeMode === mode ? activeClass : inactiveClass
          )}
        >
          {mode}
        </button>
      ))}
      <div className="relative flex-1">
        <button
          ref={customButtonRef}
          onClick={handleCustomClick}
          className={clsx(
            "w-full",
            baseButtonClass,
            "relative gap-2",
            activeMode === "사용자 지정" ? activeClass : inactiveClass
          )}
        >
          사용자 지정
          <Image
            src="/icons/프리미엄2.svg"
            alt=""
            width={45}
            height={45}
            className="absolute top-[-20px] right-[-6px]"
          />
        </button>
        {isPopoverOpen && (
          <div
            ref={popoverRef}
            className="absolute top-full mt-4 w-80 z-50 p-0.5"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            <div className="relative bg-blue-50 rounded-lg shadow-xl shadow-neutral-900/20 p-3">
              <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-4 h-4 bg-blue-50 border-l-2 border-t-2 rotate-45"></div>
              <p className="text-sm text-gray-600 mb-2">
                원하는 문장 스타일을 입력하세요. (50자 이내)
              </p>
              <textarea
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                maxLength={50}
                className="w-full h-32 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AiParaphraseBox = () => {
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
    syncOffset();
    window.addEventListener("scroll", syncOffset, { passive: true });
    return () => window.removeEventListener("scroll", syncOffset);
  }, []);

  // AI 패러프레이징 기능에 필요한 모든 상태와 로직
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeMode, setActiveMode] = useState<ParaphraseMode>("표준"); // UI에 표시되는 한글 모드
  const [customStyle, setCustomStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // handleApiCall 함수를 이렇게 수정합니다.
  const handleApiCall = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setOutputText("");

    // UI의 한글 모드 이름을 API가 요구하는 영문 이름으로 변환합니다.
    const modeMap: Record<ParaphraseMode, ParaphraseApiMode> = {
      표준: "standard",
      학술적: "academic",
      창의적: "creative",
      유창성: "fluency",
      실험적: "experimental",
      "사용자 지정": "custom",
    };
    const apiMode = modeMap[activeMode];

    // API에 보낼 데이터를 구성합니다.
    const requestData = {
      text: inputText,
      userRequestMode: activeMode === "사용자 지정" ? customStyle : undefined,
    };

    try {
      // 이제 API 파일을 통해 훨씬 깔끔하게 요청을 보냅니다.
      const response = await requestParaphrase(apiMode, requestData);
      setOutputText(response.result); // '.result' 키로 결과값을 사용합니다.
    } catch (error) {
      console.error("API 요청 오류:", error);
      setOutputText("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* 헤더 */}
      <header className="flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-gray-800">AI 문장 변환</h1>
      </header>
      <div className="px-4">
        <ModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          customStyle={customStyle}
          setCustomStyle={setCustomStyle}
        />
      </div>
      {/* 메인 컨텐츠 박스 */}
      <div
        className={clsx(
          "flex flex-1 rounded-lg shadow-md shadow-neutral-900/20 overflow-hidden border bg-white",
          open ? "w-[calc(100vw_-_457px)]" : "w-[calc(100vw_-_243px)]"
        )}
      >
        {/* 입력/출력창 */}
        <div className="w-1/2 border-r p-4 flex flex-col">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="내용을 입력하세요."
            className="flex-1 w-full resize-none outline-none text-base"
            disabled={isLoading}
          ></textarea>
          <div className="flex justify-end items-center mt-4">
            <button
              onClick={handleApiCall}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-semibold"
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? "변환 중..." : "변환하기"}
            </button>
          </div>
        </div>
        <div className="w-1/2 p-4 relative bg-gray-50">
          <div className="w-full h-full whitespace-pre-wrap text-gray-800">
            {isLoading
              ? "결과 생성 중..."
              : outputText || "여기에 변환 결과가 표시됩니다."}
          </div>
          {outputText && (
            <button
              onClick={() => navigator.clipboard.writeText(outputText)}
              className="absolute top-3 right-3 p-2 text-gray-500 hover:bg-gray-200 rounded-full"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiParaphraseBox;
