"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";
import { Copy } from "lucide-react";
import { requestParaphrase, ParaphraseApiMode } from "@/apis/paraphrase.api";
import { readLatestHistory } from "@/apis/history.api";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useWorkHistory } from "@/stores/workHistory.store";
import useClearContent from "@/hooks/useClearContent";
import useResetOnNewWork from "@/hooks/useResetOnNewWork";
import { usePlanRestriction } from "@/hooks/usePlanRestriction";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { useAiHistoryStore } from "@/stores/aiHistory.store";
import { ParaphraseGuide } from "../guide/ParaphraseGuide";
import { ChevronDown, MessageCircle } from "lucide-react";

const HEADER_H = 72; // px

const ToneBlendSlider = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div className="w-full bg-blue-50 rounded-lg border shadow-sm p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-600">기본</span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-purple-600">{value}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
        <span className="text-xs text-gray-600">강조</span>
      </div>
      <div className="relative mb-2">
        <div className="h-1.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full"></div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute top-0 left-0 w-full h-1.5 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ background: "transparent" }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span className="hidden sm:inline">기본적으로 적용</span>
        <span className="sm:hidden">기본</span>
        <span className="hidden sm:inline">강하게 적용</span>
        <span className="sm:hidden">강조</span>
      </div>
    </div>
  );
};

// ────────────────────────────────
// Mode Selector
// ────────────────────────────────
type ParaphraseMode =
  | "표준"
  | "학술적"
  | "창의적"
  | "유창성"
  | "문학적"
  | "사용자 지정";

const ModeSelector = ({
  activeMode,
  setActiveMode,
  customStyle,
  setCustomStyle,
  creativityLevel,
  setCreativityLevel,
}: {
  activeMode: ParaphraseMode;
  setActiveMode: (mode: ParaphraseMode) => void;
  customStyle: string;
  setCustomStyle: (style: string) => void;
  creativityLevel: number;
  setCreativityLevel: (level: number) => void;
}) => {
  const modes: ParaphraseMode[] = [
    "표준",
    "학술적",
    "창의적",
    "유창성",
    "문학적",
  ];
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const customButtonRef = useRef<HTMLButtonElement>(null);
  // 드롭다운 상태 (모바일)
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const { canUseFeature, getRequiredPlanName } = usePlanRestriction();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // 드롭다운 외부 클릭
      if (
        modeDropdownRef.current &&
        !modeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModeDropdownOpen(false);
      }

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
    setIsModeDropdownOpen(false);
  };

  const handleCustomClick = () => {
    const canUse = canUseFeature("paraphrasing", "custom");
    if (canUse) {
      setActiveMode("사용자 지정");
      setIsPopoverOpen((prev) => !prev);
      setIsModeDropdownOpen(false);
    } else {
      alert(
        `${getRequiredPlanName(
          "paraphrasing",
          "custom"
        )} 플랜부터 사용 가능합니다`
      );
    }
  };

  const baseButtonClass =
    "h-9 md:h-11 text-[11px] md:text-sm whitespace-nowrap rounded-full font-medium transition-all flex items-center justify-center shadow-md shadow-neutral-900/20";
  const inactiveClass =
    "bg-purple-100 border border-purple-600/30 hover:bg-purple-200/60";
  const activeClass =
    "bg-purple-200 border border-purple-600/30 ring-1 ring-purple-300";
  const disabledClass =
    "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed opacity-50";

  return (
    <div className="w-full">
      <div
        className="hidden md:flex w-full gap-2 md:gap-3"
        data-tour="mode-buttons"
      >
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
          {canUseFeature("paraphrasing", "custom") ? (
            <>
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
                  width={0}
                  height={0}
                  className="absolute w-[30px] h-[30px] top-[-12px] right-[-5px] md:w-[45px] md:h-[45px] md:top-[-20px] md:right-[-6px]"
                />
              </button>
              {isPopoverOpen && (
                <div
                  ref={popoverRef}
                  className={clsx(
                    "absolute top-full mt-4 z-50 p-0.5",
                    "w-[90vw] max-w-[320px] lg:w-80",
                    "right-0 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto"
                  )}
                >
                  <div className="relative bg-blue-50 rounded-lg shadow-2xl p-3">
                    <div
                      className={clsx(
                        "absolute -translate-x-1/2 -top-[10px] w-4 h-4 bg-blue-50 border-l-2 border-t-2 rotate-45",
                        "left-[calc(100%-30px)] lg:left-1/2"
                      )}
                    />
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
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    disabled
                    className={clsx(
                      "w-full",
                      baseButtonClass,
                      "relative gap-2",
                      disabledClass
                    )}
                  >
                    사용자 지정
                    <Image
                      src="/icons/프리미엄2.svg"
                      alt=""
                      width={0}
                      height={0}
                      className="absolute w-[30px] h-[30px] top-[-12px] right-[-5px] md:w-[45px] md:h-[45px] md:top-[-20px] md:right-[-6px]"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {getRequiredPlanName("paraphrasing", "custom")} 플랜부터
                    사용 가능합니다
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* 모바일: 드롭다운 + 말풍선 아이콘 */}
      <div className="md:hidden flex items-center gap-1 overflow-visible">
        {/* 드롭다운 */}
        <div className="relative inline-block w-max" ref={modeDropdownRef}>
          <button
            onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
            className={clsx(
              "px-3 py-1.5 rounded-lg font-semibold text-xs text-left flex justify-between items-center gap-2",
              "bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300"
            )}
            style={{ minWidth: "140px" }}
          >
            <span className="truncate">{activeMode}</span>
            <ChevronDown
              size={16}
              className={clsx(
                "transition-transform flex-shrink-0",
                isModeDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {isModeDropdownOpen && (
            <div
              className="absolute top-full left-0 mt-1 bg-white border border-purple-200 rounded-lg shadow-lg z-50"
              style={{ width: "140px" }}
            >
              {/* 기본 모드들 */}
              {modes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    handleModeClick(mode);
                    setIsModeDropdownOpen(false);
                  }}
                  className={clsx(
                    "block w-full px-3 py-1.5 text-left text-xs whitespace-nowrap transition-colors",
                    "hover:bg-purple-100",
                    activeMode === mode && "bg-purple-100 font-semibold"
                  )}
                >
                  {mode}
                </button>
              ))}

              {/* 사용자 지정 */}
              <button
                onClick={() => {
                  if (canUseFeature("paraphrasing", "custom")) {
                    handleCustomClick();
                    setIsModeDropdownOpen(false);
                  } else {
                    alert(
                      `${getRequiredPlanName(
                        "paraphrasing",
                        "custom"
                      )} 플랜부터 사용 가능합니다`
                    );
                  }
                }}
                disabled={!canUseFeature("paraphrasing", "custom")}
                className={clsx(
                  "block w-full px-3 py-1.5 text-left text-xs whitespace-nowrap transition-colors border-t border-purple-200",
                  canUseFeature("paraphrasing", "custom")
                    ? "hover:bg-purple-100"
                    : "text-gray-400 cursor-not-allowed opacity-50",
                  activeMode === "사용자 지정" && "bg-purple-100 font-semibold"
                )}
              >
                사용자 지정
              </button>
            </div>
          )}
        </div>

        {/* 말풍선 아이콘 (사용자 지정 모드일 때만 표시) */}
        {activeMode === "사용자 지정" && (
          <div className="relative overflow-visible">
            <button
              ref={customButtonRef}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              className={clsx(
                "p-1.5 rounded-lg transition-colors",
                "bg-purple-100 hover:bg-purple-200 text-purple-600"
              )}
            >
              <MessageCircle size={16} />
            </button>

            {/* 사용자 지정 팝업 */}
            {isPopoverOpen && (
              <div
                ref={popoverRef}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 p-0.5 w-72 overflow-visible"
              >
                <div className="relative bg-blue-50 rounded-lg shadow-2xl p-3">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-4 h-4 bg-blue-50 border-l-2 border-t-2 rotate-45" />
                  <p className="text-sm text-gray-600 mb-2">
                    원하는 문장 스타일을 입력하세요. (50자 이내)
                  </p>
                  <textarea
                    value={customStyle}
                    onChange={(e) => setCustomStyle(e.target.value)}
                    maxLength={50}
                    className="w-full h-24 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3" data-tour="slider">
        <ToneBlendSlider
          value={creativityLevel}
          onChange={setCreativityLevel}
        />
      </div>
    </div>
  );
};

const AiParaphraseBox = () => {
  const selectedHistory = useAiHistoryStore((state) => state.selectedAiHistory);
  const clearHistory = useAiHistoryStore((state) => state.clearAiHistory);
  const { toast } = useToast();

  const {
    currentParaphraseHistoryId,
    currentParaphraseSequence,
    updateParaphraseWork,
    canParaphraseMore,
    resetParaphraseWork,
  } = useWorkHistory();

  const isLogin = useAuthStore((s) => s.isLogin);
  const router = useRouter();
  const { canUseFeature } = usePlanRestriction();
  const { updateTokenUsage, showTokenAlert } = useTokenUsage();
  const queryClient = useQueryClient();

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeMode, setActiveMode] = useState<ParaphraseMode>("표준");
  const [customStyle, setCustomStyle] = useState("");
  const [creativityLevel, setCreativityLevel] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSequence, setCurrentSequence] = useState(1);

  useClearContent();

  // 헤더 높이 offset 반영
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

  useResetOnNewWork(() => {
    setInputText("");
    setOutputText("");
    setActiveMode("표준");
    setCustomStyle("");
    setIsLoading(false);
    clearHistory();
    resetParaphraseWork();
  });

  // 사이드바 히스토리 선택 시
  useEffect(() => {
    if (selectedHistory?.paraphrasedText) {
      setOutputText(selectedHistory.paraphrasedText);
      setInputText(selectedHistory.originalText);

      if (selectedHistory.historyId && selectedHistory.sequenceNumber) {
        updateParaphraseWork(
          selectedHistory.historyId,
          selectedHistory.sequenceNumber
        );
        setCurrentSequence(selectedHistory.sequenceNumber);
      }
    }
  }, [selectedHistory, updateParaphraseWork]);

  // ✅ 최신 히스토리 로드
  const loadLatestHistory = useCallback(async () => {
    if (!currentParaphraseHistoryId || !isLogin) return;

    try {
      const latest = await readLatestHistory({
        service: "paraphrase",
        historyId: currentParaphraseHistoryId,
      });

      setInputText(latest.originalText);
      setOutputText(latest.paraphrasedText || "");
      setCurrentSequence(latest.sequenceNumber);

      if (latest.sequenceNumber !== currentParaphraseSequence) {
        updateParaphraseWork(latest.historyId, latest.sequenceNumber);
      }

      console.log(
        `✅ 최신 히스토리 로드: historyId=${latest.historyId}, sequence=${latest.sequenceNumber}`
      );
    } catch (error) {
      console.error("히스토리 조회 실패:", error);
    }
  }, [
    currentParaphraseHistoryId,
    isLogin,
    currentParaphraseSequence,
    updateParaphraseWork,
  ]);

  useEffect(() => {
    void loadLatestHistory();
  }, [loadLatestHistory]);

  // ────────────────────────────────
  // API 호출 핸들러
  // ────────────────────────────────
  const handleApiCall = async () => {
    if (!isLogin) {
      alert("로그인 후에 이용해주세요.");
      router.push("/login");
      return;
    }

    if (!canParaphraseMore()) {
      toast({
        title: "변환 제한",
        description:
          "이 작업에서 최대 10개까지만 변환할 수 있습니다. 새 대화를 시작해주세요.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    if (
      activeMode === "사용자 지정" &&
      !canUseFeature("paraphrasing", "custom")
    ) {
      alert("사용자 지정 모드는 Basic 플랜부터 이용 가능합니다.");
      return;
    }

    if (!inputText.trim()) {
      alert("텍스트를 입력해주세요.");
      return;
    }

    // GTM 이벤트 푸시
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "paraphrase_start",
      feature: "paraphrasing",
      paraphrase_mode: activeMode,
    });

    setIsLoading(true);
    setOutputText("");
    clearHistory();

    const modeMap: Record<ParaphraseMode, ParaphraseApiMode> = {
      표준: "standard",
      학술적: "academic",
      창의적: "creative",
      유창성: "fluency",
      문학적: "experimental",
      "사용자 지정": "custom",
    };

    const apiMode = modeMap[activeMode];

    const requestData = {
      text: inputText,
      userRequestMode: activeMode === "사용자 지정" ? customStyle : undefined,
      scale: creativityLevel,
      historyId: currentParaphraseHistoryId,
    };

    try {
      const response = await requestParaphrase(apiMode, requestData);
      const { historyId, sequenceNumber, paraphrasedText, remainingToken } =
        response;

      setOutputText(paraphrasedText);
      setCurrentSequence(sequenceNumber);
      updateParaphraseWork(historyId, sequenceNumber);

      console.log(
        `✅ 변환 완료: historyId=${historyId}, sequence=${sequenceNumber}`
      );

      if (remainingToken !== undefined) {
        updateTokenUsage(remainingToken);
        showTokenAlert(remainingToken, true);
      }

      if (sequenceNumber >= 10) {
        toast({
          title: "변환 완료",
          description:
            "이 작업에서 최대 변환 횟수에 도달했습니다. 새 대화를 시작해주세요.",
          variant: "default",
          duration: 3000,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["sidebar-history", "paraphrase"],
      });
      await queryClient.refetchQueries({
        queryKey: ["sidebar-history", "paraphrase"],
      });
    } catch (error) {
      console.error("API 요청 오류:", error);
      setOutputText("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // ────────────────────────────────
  // 이전/다음 히스토리 보기
  // ────────────────────────────────
  const handlePrevSequence = async () => {
    if (currentSequence <= 1 || !currentParaphraseHistoryId) return;
    try {
      const content = await readLatestHistory({
        service: "paraphrase",
        historyId: currentParaphraseHistoryId,
        sequenceNumber: currentSequence - 1,
      });
      setInputText(content.originalText);
      setOutputText(content.paraphrasedText || "");
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

  const handleNextSequence = async () => {
    if (
      currentSequence >= currentParaphraseSequence ||
      !currentParaphraseHistoryId
    )
      return;
    try {
      const content = await readLatestHistory({
        service: "paraphrase",
        historyId: currentParaphraseHistoryId,
        sequenceNumber: currentSequence + 1,
      });
      setInputText(content.originalText);
      setOutputText(content.paraphrasedText || "");
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

  const cannotParaphraseMore = !canParaphraseMore();
  const isButtonDisabled =
    isLoading || !inputText.trim() || cannotParaphraseMore;

  // ────────────────────────────────
  // Render
  // ────────────────────────────────
  return (
    <div className="w-full flex flex-col h-full p-2 md:p-4 gap-2 md:gap-4">
      <header className="flex items-center px-[3px] gap-2">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">
          AI 문장 변환
        </h1>

        <div className="ml-auto flex items-center gap-2">
          {currentParaphraseHistoryId && currentParaphraseSequence > 1 && (
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
                {currentSequence} / {currentParaphraseSequence}
              </span>
              <button
                onClick={handleNextSequence}
                disabled={currentSequence >= currentParaphraseSequence}
                className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                title="다음"
              >
                →
              </button>
            </div>
          )}
          <ParaphraseGuide />
        </div>
      </header>

      <div className="px-[3px]">
        <ModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          customStyle={customStyle}
          setCustomStyle={setCustomStyle}
          creativityLevel={creativityLevel}
          setCreativityLevel={setCreativityLevel}
        />
      </div>

      <div className={clsx("flex flex-col md:flex-row", "flex-1")}>
        {/* 입력 패널 */}
        <div
          data-tour="input-area"
          className={clsx(
            "relative w-full h-1/2 md:h-full md:w-1/2",
            "bg-white border shadow-lg",
            "rounded-t-lg md:rounded-l-lg md:rounded-tr-none md:rounded-br-none",
            "overflow-hidden"
          )}
        >
          <div className="p-2 md:p-4 flex flex-col h-full">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="내용을 입력하세요."
              className="flex-1 w-full resize-none outline-none text-sm md:text-base"
              disabled={isLoading}
            />
            <div className="flex justify-end items-center mt-2 md:mt-4">
              <button
                onClick={handleApiCall}
                data-tour="convert-button"
                className={clsx(
                  "py-1.5 px-4 md:py-2 md:px-6 rounded-lg font-semibold text-xs md:text-base transition-all",
                  cannotParaphraseMore
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                )}
                disabled={isButtonDisabled}
                title={
                  cannotParaphraseMore
                    ? "이 작업에서 최대 10개까지 변환할 수 있습니다"
                    : ""
                }
              >
                {cannotParaphraseMore
                  ? "변환 제한 도달"
                  : isLoading
                  ? "변환 중..."
                  : "변환하기"}
              </button>
            </div>
            {cannotParaphraseMore && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                ⚠️ 이 작업에서 최대 변환 횟수에 도달했습니다. 사이드바에서 새
                작업을 시작해주세요.
              </div>
            )}
          </div>
        </div>

        {/* 출력 패널 */}
        <div
          className={clsx(
            "relative w-full h-1/2 md:h-full md:w-1/2",
            "bg-gray-50 border shadow-lg md:-ml-px",
            "rounded-b-lg md:rounded-r-lg md:rounded-tl-none md:rounded-bl-none",
            "overflow-hidden"
          )}
        >
          <div className="p-2 md:p-4 h-full relative">
            <div className="w-full h-full whitespace-pre-wrap text-gray-800 pr-10 text-sm md:text-base">
              {isLoading
                ? "결과 생성 중..."
                : selectedHistory?.paraphrasedText ||
                  outputText ||
                  "여기에 변환 결과가 표시됩니다."}
            </div>
            {(selectedHistory?.paraphrasedText || outputText) && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    selectedHistory?.paraphrasedText || outputText
                  );
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "copy_result",
                    feature: "copy",
                    service: "paraphrase",
                  });
                }}
                className="absolute top-3 right-3 p-2 text-gray-500 hover:bg-gray-200 rounded-full"
              >
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
