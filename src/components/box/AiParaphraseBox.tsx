"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { ChevronDown, MessageCircle } from "lucide-react";
import { ParaphraseGuide } from "../guide/ParaphraseGuide";

const HEADER_H = 72; // px

// 모드 선택 버튼 타입 정의
type ParaphraseMode =
  | "표준"
  | "학술적"
  | "창의적"
  | "유창성"
  | "문학적"
  | "사용자 지정";

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

// 모드 선택 버튼 UI 컴포넌트
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

  // 요금제 제한 hook 추가
  const { canUseFeature, getRequiredPlanName } = usePlanRestriction();

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // 드롭다운 외부 클릭
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) {
        setIsModeDropdownOpen(false);
      }

      // 사용자 지정 팝업 외부 클릭
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && customButtonRef.current && !customButtonRef.current.contains(event.target as Node)) {
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
    // 기본 모드들(표준, 학술적, 창의적, 유창성, 문학적)은 모든 사용자가 사용 가능
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
      alert(`${getRequiredPlanName("paraphrasing", "custom")} 플랜부터 사용 가능합니다`);
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
      {/* 데스크톱: 버튼들 */}
      <div className="hidden md:flex w-full gap-2 md:gap-3" data-tour="mode-buttons">
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

        {/* 사용자 지정 버튼 */}
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
                    <div className={clsx("absolute -translate-x-1/2 -top-[10px] w-4 h-4 bg-blue-50 border-l-2 border-t-2 rotate-45", "left-[calc(100%-30px)] lg:left-1/2")} />
                    <p className="text-sm text-gray-600 mb-2">원하는 문장 스타일을 입력하세요. (50자 이내)</p>
                    <textarea value={customStyle} onChange={(e) => setCustomStyle(e.target.value)} maxLength={50} className="w-full h-32 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400" />
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
          <button onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)} className={clsx("px-3 py-1.5 rounded-lg font-semibold text-xs text-left flex justify-between items-center gap-2", "bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300")} style={{ minWidth: "140px" }}>
            <span className="truncate">{activeMode}</span>
            <ChevronDown size={16} className={clsx("transition-transform flex-shrink-0", isModeDropdownOpen && "rotate-180")} />
          </button>

          {isModeDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-purple-200 rounded-lg shadow-lg z-50" style={{ width: "140px" }}>
              {/* 기본 모드들 */}
              {modes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    handleModeClick(mode);
                    setIsModeDropdownOpen(false);
                  }}
                  className={clsx("block w-full px-3 py-1.5 text-left text-xs whitespace-nowrap transition-colors", "hover:bg-purple-100", activeMode === mode && "bg-purple-100 font-semibold")}>
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
                    alert(`${getRequiredPlanName("paraphrasing", "custom")} 플랜부터 사용 가능합니다`);
                  }
                }}
                disabled={!canUseFeature("paraphrasing", "custom")}
                className={clsx("block w-full px-3 py-1.5 text-left text-xs whitespace-nowrap transition-colors border-t border-purple-200", canUseFeature("paraphrasing", "custom") ? "hover:bg-purple-100" : "text-gray-400 cursor-not-allowed opacity-50", activeMode === "사용자 지정" && "bg-purple-100 font-semibold")}>
                사용자 지정
              </button>
            </div>
          )}
        </div>

        {/* 말풍선 아이콘 (사용자 지정 모드일 때만 표시) */}
        {activeMode === "사용자 지정" && (
          <div className="relative overflow-visible">
            <button ref={customButtonRef} onClick={() => setIsPopoverOpen(!isPopoverOpen)} className={clsx("p-1.5 rounded-lg transition-colors", "bg-purple-100 hover:bg-purple-200 text-purple-600")}>
              <MessageCircle size={16} />
            </button>

            {/* 사용자 지정 팝업 */}
            {isPopoverOpen && (
              <div ref={popoverRef} className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 p-0.5 w-72 overflow-visible">
                <div className="relative bg-blue-50 rounded-lg shadow-2xl p-3">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-4 h-4 bg-blue-50 border-l-2 border-t-2 rotate-45" />
                  <p className="text-sm text-gray-600 mb-2">원하는 문장 스타일을 입력하세요. (50자 이내)</p>
                  <textarea value={customStyle} onChange={(e) => setCustomStyle(e.target.value)} maxLength={50} className="w-full h-24 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tone Blend Slider */}
      <div className="mt-3" data-tour="slider">
        <ToneBlendSlider value={creativityLevel} onChange={setCreativityLevel} />
      </div>
    </div>
  );
};

const AiParaphraseBox = () => {
  // ========== Store & Router ==========
  const selectedHistory = useAiHistoryStore((state) => state.selectedAiHistory);
  const clearHistory = useAiHistoryStore((state) => state.clearAiHistory);
  const { toast } = useToast();

  // 🔥 workHistory 사용 (localHistory 제거)
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

  // ========== State ==========
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeMode, setActiveMode] = useState<ParaphraseMode>("표준");
  const [customStyle, setCustomStyle] = useState("");
  const [creativityLevel, setCreativityLevel] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSequence, setCurrentSequence] = useState(1);
  const [isHistoryMode, setIsHistoryMode] = useState(false);

  // ========== Hooks ==========
  useClearContent();

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
    setCreativityLevel(50);
    setIsLoading(false);
    setIsHistoryMode(false);
    clearHistory();
    resetParaphraseWork();
  });

  // 사이드바 히스토리 선택 시
  useEffect(() => {
    if (selectedHistory?.paraphrasedText) {
      setOutputText(selectedHistory.paraphrasedText);
      setInputText(selectedHistory.originalText);

      // 모드 정보 복원
      if (selectedHistory.mode) {
        const modeMap: Record<string, ParaphraseMode> = {
          standard: "표준",
          academic: "학술적",
          creative: "창의적",
          fluency: "유창성",
          experimental: "문학적",
          custom: "사용자 지정"
        };
        const koreanMode = modeMap[selectedHistory.mode] || "표준";
        setActiveMode(koreanMode);

        if (selectedHistory.mode === "custom" && selectedHistory.userRequestMode) {
          setCustomStyle(selectedHistory.userRequestMode);
        }

        if (selectedHistory.scale !== undefined) {
          setCreativityLevel(selectedHistory.scale);
        }
      }

      // 선택된 히스토리의 정보로 업데이트
      if (selectedHistory.historyId && selectedHistory.sequenceNumber) {
        updateParaphraseWork(
          selectedHistory.historyId,
          selectedHistory.sequenceNumber
        );
        setCurrentSequence(selectedHistory.sequenceNumber);
      }

      // 히스토리 모드 활성화
      setIsHistoryMode(true);
    }
  }, [selectedHistory, updateParaphraseWork]);

  const loadLatestHistory = useCallback(async () => {
    if (!currentParaphraseHistoryId || !isLogin) return;

    try {
      const latestContent = await readLatestHistory({
        service: "paraphrase",
        historyId: currentParaphraseHistoryId,
      });

      setInputText(latestContent.originalText);
      setOutputText(latestContent.paraphrasedText || "");
      setCurrentSequence(latestContent.sequenceNumber);

      // 모드 정보 복원
      if (latestContent.mode) {
        const modeMap: Record<string, ParaphraseMode> = {
          standard: "표준",
          academic: "학술적",
          creative: "창의적",
          fluency: "유창성",
          experimental: "문학적",
          custom: "사용자 지정"
        };
        const koreanMode = modeMap[latestContent.mode] || "표준";
        setActiveMode(koreanMode);

        if (latestContent.mode === "custom" && latestContent.userRequestMode) {
          setCustomStyle(latestContent.userRequestMode);
        }

        if (latestContent.scale !== undefined) {
          setCreativityLevel(latestContent.scale);
        }
      }

      if (latestContent.sequenceNumber !== currentParaphraseSequence) {
        updateParaphraseWork(
          latestContent.historyId,
          latestContent.sequenceNumber
        );
      }

      // 히스토리 모드 활성화
      setIsHistoryMode(true);

      console.log(`✅ 최신 히스토리 로드: historyId=${latestContent.historyId}, sequence=${latestContent.sequenceNumber}`);
    } catch (error) {
      console.error("히스토리 조회 실패:", error);
    }
  };

  // ========== Handlers ==========
  const handleApiCall = async () => {
    // 히스토리 모드에서는 변환 불가
    if (isHistoryMode) {
      toast({
        title: "히스토리 데이터입니다",
        description: "새로운 변환을 원하시면 내용을 수정하거나 '새 작업'을 시작해주세요.",
        variant: "default",
        duration: 3000
      });
      return;
    }

    if (!isLogin) {
      alert("로그인 후에 이용해주세요.");
      router.push("/login");
      return;
    }

    // 현재 historyId에서 10개 도달 확인
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

    // ✅ GTM 이벤트 푸시 (API 호출 직전)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "paraphrase_start",
      feature: "paraphrasing",
      paraphrase_mode: activeMode, // 현재 선택된 모드
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
      historyId: currentParaphraseHistoryId, // 스토어의 historyId를 추가
    };

    try {
      const response = await requestParaphrase(apiMode, requestData);

      // 응답 처리
      const { historyId, sequenceNumber, paraphrasedText, remainingToken } =
        response;

      setOutputText(paraphrasedText);
      setCurrentSequence(sequenceNumber);

      // 현재 작업 정보 업데이트
      updateParaphraseWork(historyId, sequenceNumber);

      console.log(
        `✅ 변환 완료: historyId=${historyId}, sequence=${sequenceNumber}`
      );

      // 토큰 처리
      if (remainingToken !== undefined) {
        updateTokenUsage(remainingToken);
        showTokenAlert(remainingToken, true);
      }

      // 10개 도달 시 안내 메시지
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

  // 이전 히스토리 보기
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

      // 모드 복원
      if (content.mode) {
        const modeMap: Record<string, ParaphraseMode> = {
          standard: "표준",
          academic: "학술적",
          creative: "창의적",
          fluency: "유창성",
          experimental: "문학적",
          custom: "사용자 지정"
        };
        setActiveMode(modeMap[content.mode] || "표준");

        if (content.mode === "custom" && content.userRequestMode) {
          setCustomStyle(content.userRequestMode);
        }

        if (content.scale !== undefined) {
          setCreativityLevel(content.scale);
        }
      }

      // 히스토리 모드 활성화
      setIsHistoryMode(true);
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

      // 모드 복원
      if (content.mode) {
        const modeMap: Record<string, ParaphraseMode> = {
          standard: "표준",
          academic: "학술적",
          creative: "창의적",
          fluency: "유창성",
          experimental: "문학적",
          custom: "사용자 지정"
        };
        setActiveMode(modeMap[content.mode] || "표준");

        if (content.mode === "custom" && content.userRequestMode) {
          setCustomStyle(content.userRequestMode);
        }

        if (content.scale !== undefined) {
          setCreativityLevel(content.scale);
        }
      }

      // 히스토리 모드 활성화
      setIsHistoryMode(true);
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

  // 버튼 비활성화 조건
  const cannotParaphraseMore = !canParaphraseMore();
  const isButtonDisabled = isLoading || !inputText.trim() || cannotParaphraseMore || isHistoryMode;

  // ========== Render ==========
  return (
    <div className="w-full flex flex-col h-full p-2 md:p-4 gap-2 md:gap-4">
      <header className="flex items-center px-[3px] gap-2">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">
          AI 문장 변환
        </h1>

        {/* 오른쪽 끝으로 밀기 */}
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

          {/* 👉 항상 맨 오른쪽 */}
          <ParaphraseGuide />
        </div>
      </header>

      <div className="px-[3px]">
        <ModeSelector
          activeMode={activeMode}
          setActiveMode={(mode) => {
            setActiveMode(mode);
            if (isHistoryMode) setIsHistoryMode(false);
          }}
          customStyle={customStyle}
          setCustomStyle={setCustomStyle}
          creativityLevel={creativityLevel}
          setCreativityLevel={setCreativityLevel}
        />{" "}
      </div>

      <div className={clsx("flex flex-col md:flex-row", "flex-1 rounded-lg shadow-lg overflow-hidden border bg-white")}>
        <div  data-tour="input-area" className={clsx("w-full h-1/2 md:h-full md:w-1/2 border-b md:border-b-0 md:border-r p-2 md:p-4 flex flex-col",  "rounded-t-lg md:rounded-l-lg md:rounded-tr-none md:rounded-br-none",
            "overflow-hidden")}>
          <div className="p-2 md:p-4 flex flex-col h-full">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (isHistoryMode) {
                setIsHistoryMode(false);
              }
            }}
            placeholder="내용을 입력하세요."
            className="flex-1 w-full resize-none outline-none text-sm md:text-base"
            disabled={isLoading}
          />
          <div className="flex justify-end items-center mt-2 md:mt-4">
            <button data-tour="convert-button" onClick={handleApiCall} className={clsx("py-1.5 px-4 md:py-2 md:px-6 rounded-lg font-semibold text-xs md:text-base transition-all", cannotParaphraseMore || isHistoryMode ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white")} disabled={isButtonDisabled} title={isHistoryMode ? "히스토리 데이터입니다. 내용을 수정하거나 새 작업을 시작하세요." : cannotParaphraseMore ? "이 작업에서 최대 10개까지 변환할 수 있습니다" : ""}>
              {isHistoryMode ? "히스토리 보기 중" : cannotParaphraseMore ? "변환 제한 도달" : isLoading ? "변환 중..." : "변환하기"}
            </button>
          </div>

          {/* 히스토리 모드 안내 추가 */}
          {isHistoryMode && <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">ℹ️ 히스토리 데이터입니다. 내용을 수정하면 새로 변환할 수 있습니다.</div>}
          {/* 10개 도달 경고 */}
          {cannotParaphraseMore && <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">⚠️ 이 작업에서 최대 변환 횟수에 도달했습니다. 사이드바에서 새 작업을 시작해주세요.</div>
          }</div>

       />
      </div>
          
        </div>

        {/* 출력 패널 : 오른쪽 카드. 경계선 이중표시 방지용 -ml-px */}
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
