"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileUpload } from "@/components/FileUpload";
import { toast } from "@/hooks/use-toast";
import clsx from "clsx";
import { Copy, ChevronDown, MessageCircle } from "lucide-react";
import {
  requestSummarize,
  requestSummarizeWithFile,
  SummarizeApiMode,
} from "@/apis/summarize.api";
import { readLatestHistory } from "@/apis/history.api";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { usePlanRestriction } from "@/hooks/usePlanRestriction";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkHistory } from "@/stores/workHistory.store";
import useClearContent from "@/hooks/useClearContent";
import useResetOnNewWork from "@/hooks/useResetOnNewWork";
import { useAiHistoryStore } from "@/stores/aiHistory.store";
import { SummarizeGuide } from "../guide/SummarizeGuide";

const HEADER_H = 72; // px

// 모드 선택 버튼 타입 정의
type SummarizeMode =
  | "한줄 요약"
  | "전체 요약"
  | "문단별 요약"
  | "핵심 요약"
  | "질문 기반 요약"
  | "타겟 요약";

// 모드 선택 버튼 UI 컴포넌트
const ModeSelector = ({
  activeMode,
  setActiveMode,
  targetAudience,
  setTargetAudience,
  questionText,
  setQuestionText,
}: {
  activeMode: SummarizeMode;
  setActiveMode: (mode: SummarizeMode) => void;
  targetAudience: string;
  setTargetAudience: (style: string) => void;
  questionText: string;
  setQuestionText: (text: string) => void;
}) => {
  const modes: SummarizeMode[] = [
    "한줄 요약",
    "전체 요약",
    "문단별 요약",
    "핵심 요약",
  ];
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);

  // 타겟 요약 팝업 상태
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const customButtonRef = useRef<HTMLButtonElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  // 질문 기반 요약 팝업 상태
  const [isQuestionPopoverOpen, setIsQuestionPopoverOpen] = useState(false);
  const questionPopoverRef = useRef<HTMLDivElement>(null);
  const questionButtonRef = useRef<HTMLButtonElement>(null);

  // 요금제 제한 hook
  const { canUseFeature, getRequiredPlanName } = usePlanRestriction();

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // 질문 팝업 닫기
      if (
        questionPopoverRef.current &&
        !questionPopoverRef.current.contains(event.target as Node)
      ) {
        if (
          questionButtonRef.current &&
          !questionButtonRef.current.contains(event.target as Node)
        ) {
          setIsQuestionPopoverOpen(false);
        }
      }

      // 타겟 팝업 닫기
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        if (
          customButtonRef.current &&
          !customButtonRef.current.contains(event.target as Node)
        ) {
          setIsPopoverOpen(false);
        }
      }

      // 드롭다운 닫기
      if (
        modeDropdownRef.current &&
        !modeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModeClick = (mode: SummarizeMode) => {
    // 기본 모드들(한줄, 전체, 문단별, 핵심)은 모든 사용자가 사용 가능
    setActiveMode(mode);
    setIsPopoverOpen(false);
    setIsQuestionPopoverOpen(false);
    setIsModeDropdownOpen(false);
  };

  const handleQuestionClick = () => {
    // 질문 기반 요약 권한 체크
    const canUse = canUseFeature("summarize", "questionBased");
    if (canUse) {
      setActiveMode("질문 기반 요약");
      setIsQuestionPopoverOpen((prev) => !prev);
      setIsPopoverOpen(false);
    }
  };

  const handleCustomClick = () => {
    // 타겟 요약 권한 체크
    const canUse = canUseFeature("summarize", "targeted");
    if (canUse) {
      setActiveMode("타겟 요약");
      setIsPopoverOpen((prev) => !prev);
      setIsQuestionPopoverOpen(false);
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
      {/* 데스크톱: 버튼들 (여기에 하이라이트 대상 지정) */}
      <div
        className="hidden md:flex w-full gap-2 md:gap-3 relative"
        data-tour="mode-buttons"
      >
        {modes.map((mode) => (
          <div key={mode} className="relative flex-1">
            <button
              onClick={() => handleModeClick(mode)}
              className={clsx(
                "w-full",
                baseButtonClass,
                activeMode === mode ? activeClass : inactiveClass
              )}
            >
              {mode}
            </button>
          </div>
        ))}

        {/* 질문 기반 요약 버튼 */}
        <div className="relative flex-1">
          {canUseFeature("summarize", "questionBased") ? (
            <>
              <button
                ref={questionButtonRef}
                onClick={handleQuestionClick}
                className={clsx(
                  "w-full",
                  baseButtonClass,
                  activeMode === "질문 기반 요약" ? activeClass : inactiveClass
                )}
              >
                질문 기반 요약
              </button>
              {isQuestionPopoverOpen && (
                <div
                  ref={questionPopoverRef}
                  className={clsx(
                    "absolute top-full mt-4 z-[60] p-0.5",
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
                      요약할 때 답변받고 싶은 질문을 입력하세요. (100자 이내)
                    </p>
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      maxLength={100}
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
                    className={clsx("w-full", baseButtonClass, disabledClass)}
                  >
                    질문 기반 요약
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {getRequiredPlanName("summarize", "questionBased")} 플랜부터
                    사용 가능합니다
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* 타겟 요약 버튼 */}
        <div className="relative flex-1">
          {canUseFeature("summarize", "targeted") ? (
            <>
              <button
                ref={customButtonRef}
                onClick={handleCustomClick}
                className={clsx(
                  "w-full",
                  baseButtonClass,
                  "relative gap-2",
                  activeMode === "타겟 요약" ? activeClass : inactiveClass
                )}
              >
                타겟 요약
                <Image
                  src="/icons/프리미엄2.svg"
                  alt=""
                  width={0}
                  height={0}
                  className="absolute w-[38px] h-[38px] top-[-16px] right-[-5px] md:w-[45px] md:h-[45px] md:top-[-20px] md:right-[-6px]"
                />
              </button>
              {isPopoverOpen && (
                <div
                  ref={popoverRef}
                  className={clsx(
                    "absolute top-full mt-4 z-[60] p-0.5",
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
                      요약 내용을 전달할 대상을 입력하세요. (20자 이내)
                    </p>
                    <textarea
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      maxLength={20}
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
                    타겟 요약
                    <Image
                      src="/icons/프리미엄2.svg"
                      alt=""
                      width={0}
                      height={0}
                      className="absolute w-[38px] h-[38px] top-[-16px] right-[-5px] md:w-[45px] md:h-[45px] md:top-[-20px] md:right-[-6px]"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {getRequiredPlanName("summarize", "targeted")} 플랜부터 사용
                    가능합니다
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* 모바일: 드롭다운 + 말풍선 옵션 */}
      <div className="md:hidden flex items-center gap-1 overflow-visible">
        {/* 드롭다운 */}
        <div className="relative inline-block w-max" ref={modeDropdownRef}>
          <button
            data-tour="mode-buttons"
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

              {/* 질문 기반 요약*/}
              <button
                onClick={() => {
                  if (canUseFeature("summarize", "questionBased")) {
                    handleQuestionClick();
                    setIsModeDropdownOpen(false);
                  } else {
                    alert(
                      `${getRequiredPlanName(
                        "summarize",
                        "questionBased"
                      )} 플랜부터 사용 가능합니다`
                    );
                  }
                }}
                disabled={!canUseFeature("summarize", "questionBased")}
                className={clsx(
                  "block w-full px-3 py-1.5 text-left text-xs whitespace-nowrap transition-colors border-t border-purple-200",
                  canUseFeature("summarize", "questionBased")
                    ? "hover:bg-purple-100"
                    : "text-gray-400 cursor-not-allowed opacity-50",
                  activeMode === "질문 기반 요약" &&
                    "bg-purple-100 font-semibold"
                )}
              >
                질문 기반 요약
              </button>

              {/* 타겟 요약*/}
              <button
                onClick={() => {
                  if (canUseFeature("summarize", "targeted")) {
                    handleCustomClick();
                    setIsModeDropdownOpen(false);
                  } else {
                    alert(
                      `${getRequiredPlanName(
                        "summarize",
                        "targeted"
                      )} 플랜부터 사용 가능합니다`
                    );
                  }
                }}
                disabled={!canUseFeature("summarize", "targeted")}
                className={clsx(
                  "block w-full px-3 py-1.5 text-left text-xs whitespace-nowrap transition-colors border-t border-purple-200",
                  canUseFeature("summarize", "targeted")
                    ? "hover:bg-purple-100"
                    : "text-gray-400 cursor-not-allowed opacity-50",
                  activeMode === "타겟 요약" && "bg-purple-100 font-semibold"
                )}
              >
                타겟 요약
              </button>
            </div>
          )}
        </div>

        {/* 말풍선 아이콘 (질문 기반 요약 또는 타겟 요약일 때만 표시) */}
        {(activeMode === "질문 기반 요약" || activeMode === "타겟 요약") && (
          <div className="relative overflow-visible">
            <button
              ref={customButtonRef}
              onClick={() => {
                if (activeMode === "질문 기반 요약") {
                  setIsQuestionPopoverOpen(!isQuestionPopoverOpen);
                } else if (activeMode === "타겟 요약") {
                  setIsPopoverOpen(!isPopoverOpen);
                }
              }}
              className={clsx(
                "p-1.5 rounded-lg transition-colors",
                "bg-purple-100 hover:bg-purple-200 text-purple-600"
              )}
            >
              <MessageCircle size={16} />
            </button>

            {/* 질문 기반 요약 팝업 */}
            {isQuestionPopoverOpen && activeMode === "질문 기반 요약" && (
              <div
                ref={questionPopoverRef}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 p-0.5 w-72 overflow-visible"
              >
                <div className="relative bg-blue-50 rounded-lg shadow-2xl p-3">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-4 h-4 bg-blue-50 border-l-2 border-t-2 rotate-45"></div>
                  <p className="text-sm text-gray-600 mb-2">
                    요약할 때 답변받고 싶은 질문을 입력하세요. (100자 이내)
                  </p>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    maxLength={100}
                    className="w-full h-24 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 타겟 요약 팝업 */}
            {isPopoverOpen && activeMode === "타겟 요약" && (
              <div
                ref={popoverRef}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 p-0.5 w-72 overflow-visible"
              >
                <div className="relative bg-blue-50 rounded-lg shadow-2xl p-3">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-4 h-4 bg-blue-50 border-l-2 border-t-2 rotate-45"></div>
                  <p className="text-sm text-gray-600 mb-2">
                    요약 내용을 전달할 대상을 입력하세요. (20자 이내)
                  </p>
                  <textarea
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    maxLength={20}
                    className="w-full h-24 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AiSummarizeBox = () => {
  // ========== Store & Router ==========
  const selectedHistory = useAiHistoryStore((state) => state.selectedAiHistory);
  const clearHistory = useAiHistoryStore((state) => state.clearAiHistory);

  // workHistory
  const {
    currentSummarizeHistoryId,
    currentSummarizeSequence,
    updateSummarizeWork,
    canSummarizeMore,
    resetSummarizeWork,
  } = useWorkHistory();

  const isLogin = useAuthStore((s) => s.isLogin);
  const router = useRouter();
  const { canUseFeature } = usePlanRestriction();
  const { updateTokenUsage, showTokenAlert } = useTokenUsage();
  const queryClient = useQueryClient();

  // ========== State ==========
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeMode, setActiveMode] = useState<SummarizeMode>("한줄 요약");
  const [targetAudience, setTargetAudience] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentSequence, setCurrentSequence] = useState(1);

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
    setActiveMode("한줄 요약");
    setTargetAudience("");
    setQuestionText("");
    setIsLoading(false);
    setUploadedFile(null);
    clearHistory();
    resetSummarizeWork();
  });

  // 사이드바 히스토리 선택 시
  useEffect(() => {
    if (selectedHistory?.summarizedText) {
      setOutputText(selectedHistory.summarizedText);
      setInputText(selectedHistory.originalText);

      // 선택된 히스토리의 정보로 업데이트
      if (selectedHistory.historyId && selectedHistory.sequenceNumber) {
        updateSummarizeWork(
          selectedHistory.historyId,
          selectedHistory.sequenceNumber
        );
        setCurrentSequence(selectedHistory.sequenceNumber);
      }
    }
  }, [selectedHistory, updateSummarizeWork]);

  // 컴포넌트 마운트 시 최신 히스토리 로드
  useEffect(() => {
    if (currentSummarizeHistoryId && isLogin) {
      loadLatestHistory();
    }
  }, [currentSummarizeHistoryId, isLogin]);

  // 최신 히스토리 내용 불러오기
  const loadLatestHistory = async () => {
    if (!currentSummarizeHistoryId) return;

    try {
      const latestContent = await readLatestHistory({
        service: "summary",
        historyId: currentSummarizeHistoryId,
      });

      setInputText(latestContent.originalText);
      setOutputText(latestContent.summarizedText || "");
      setCurrentSequence(latestContent.sequenceNumber);

      // sequence 동기화
      if (latestContent.sequenceNumber !== currentSummarizeSequence) {
        updateSummarizeWork(
          latestContent.historyId,
          latestContent.sequenceNumber
        );
      }

      console.log(
        `✅ 최신 히스토리 로드: historyId=${latestContent.historyId}, sequence=${latestContent.sequenceNumber}`
      );
    } catch (error) {
      console.error("히스토리 조회 실패:", error);
    }
  };

  // ========== Handlers ==========
  const handleApiCall = async () => {
    console.log("🔍 handleApiCall 시작");
    console.log("📊 현재 Zustand 상태:", {
      currentSummarizeHistoryId,
      currentSummarizeSequence,
    });

    if (!isLogin) {
      alert("로그인 후에 이용해주세요.");
      router.push("/login");
      return;
    }

    // 현재 historyId에서 10개 도달 확인
    if (!canSummarizeMore()) {
      toast({
        title: "요약 제한",
        description:
          "이 작업에서 최대 10개까지만 요약할 수 있습니다. 새 대화를 시작해주세요.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    if (
      activeMode === "질문 기반 요약" &&
      !canUseFeature("summarize", "questionBased")
    ) {
      alert("질문 기반 요약은 Basic 플랜부터 이용 가능합니다.");
      return;
    }
    if (activeMode === "타겟 요약" && !canUseFeature("summarize", "targeted")) {
      alert("타겟 요약은 Basic 플랜부터 이용 가능합니다.");
      return;
    }

    if (!inputText.trim() && !uploadedFile) {
      alert("텍스트를 입력하거나 파일을 업로드해주세요.");
      return;
    }

    // ✅ GTM 이벤트 푸시 (API 호출 직전)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "summary_start",
      feature: "summarization",
      summary_mode: activeMode, // 현재 선택된 모드
    });

    setIsLoading(true);
    setOutputText("");
    clearHistory();

    const modeMap: Record<SummarizeMode, SummarizeApiMode> = {
      "한줄 요약": "one-line",
      "전체 요약": "full",
      "문단별 요약": "by-paragraph",
      "핵심 요약": "key-points",
      "질문 기반 요약": "question-based",
      "타겟 요약": "targeted",
    };
    const apiMode = modeMap[activeMode];

    try {
      let response;

      if (uploadedFile) {
        const historyIdForFile = currentSummarizeHistoryId || undefined;
        console.log("📤 API로 보낼 데이터 (파일):", {
          file: uploadedFile,
          mode: apiMode,
          question: activeMode === "질문 기반 요약" ? questionText : undefined,
          target: activeMode === "타겟 요약" ? targetAudience : undefined,
          historyId: historyIdForFile,
        });
        response = await requestSummarizeWithFile(
          uploadedFile,
          apiMode,
          activeMode === "질문 기반 요약" ? questionText : undefined,
          activeMode === "타겟 요약" ? targetAudience : undefined,
          historyIdForFile
        );
      } else {
        const requestData = {
          text: inputText,
          question: activeMode === "질문 기반 요약" ? questionText : undefined,
          target: activeMode === "타겟 요약" ? targetAudience : undefined,
          historyId: currentSummarizeHistoryId,
        };
        console.log("📤 API로 보낼 데이터:", requestData);
        response = await requestSummarize(apiMode, requestData);
      }

      // 응답 처리
      const { historyId, sequenceNumber, summarizedText, remainingToken } =
        response;
      console.log("📥 API 응답:", { historyId, sequenceNumber });

      setOutputText(summarizedText);
      setCurrentSequence(sequenceNumber);

      // 현재 작업 정보 업데이트
      console.log("🔄 updateSummarizeWork 호출 전:", {
        historyId,
        sequenceNumber,
      });
      updateSummarizeWork(historyId, sequenceNumber);
      console.log("🔄 updateSummarizeWork 호출 후");

      console.log(
        `✅ 요약 완료: historyId=${historyId}, sequence=${sequenceNumber}`
      );

      // 토큰 처리
      if (remainingToken !== undefined) {
        updateTokenUsage(remainingToken);
        showTokenAlert(remainingToken, true);
      }

      // 10개 도달 시 안내 메시지
      if (sequenceNumber >= 10) {
        toast({
          title: "요약 완료",
          description:
            "이 작업에서 최대 요약 횟수에 도달했습니다. 새 대화를 시작해주세요.",
          variant: "default",
          duration: 3000,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["sidebar-history", "summary"],
      });
      await queryClient.refetchQueries({
        queryKey: ["sidebar-history", "summary"],
      });
    } catch (error) {
      console.error("API 요청 오류:", error);
      setOutputText("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    // 작업 히스토리 초기화
    resetSummarizeWork();
    setInputText("");
    setOutputText("");
    setActiveMode("한줄 요약");
    setTargetAudience("");
    setQuestionText("");
    setUploadedFile(null);
    setCurrentSequence(1);

    toast({
      title: "새 대화 시작",
      description: "새로운 작업이 시작됩니다.",
      duration: 2000,
    });
  };

  // 🔥 이전 히스토리 보기
  const handlePrevSequence = async () => {
    if (currentSequence <= 1 || !currentSummarizeHistoryId) return;

    try {
      const content = await readLatestHistory({
        service: "summary",
        historyId: currentSummarizeHistoryId,
        sequenceNumber: currentSequence - 1,
      });

      setInputText(content.originalText);
      setOutputText(content.summarizedText || "");
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

  // 🔥 다음 히스토리 보기
  const handleNextSequence = async () => {
    if (
      currentSequence >= currentSummarizeSequence ||
      !currentSummarizeHistoryId
    )
      return;

    try {
      const content = await readLatestHistory({
        service: "summary",
        historyId: currentSummarizeHistoryId,
        sequenceNumber: currentSequence + 1,
      });

      setInputText(content.originalText);
      setOutputText(content.summarizedText || "");
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

  // 버튼 비활성화 조건
  const cannotSummarizeMore = !canSummarizeMore();
  const isButtonDisabled =
    isLoading || (!inputText.trim() && !uploadedFile) || cannotSummarizeMore;

  // ========== Render ==========
  return (
    <div className="w-full flex flex-col h-full p-2 md:p-4 gap-2 md:gap-4">
      <header className="flex items-center px-[3px] gap-2">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">AI 요약</h1>

        {/* 👉 오른쪽 끝으로 밀기 */}
        <div className="ml-auto flex items-center gap-2">
          {/* 현재 작업 중인 historyId가 있을 때만 표시 */}
          {currentSummarizeHistoryId && currentSummarizeSequence > 1 && (
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
                {currentSequence} / {currentSummarizeSequence}
              </span>

              <button
                onClick={handleNextSequence}
                disabled={currentSequence >= currentSummarizeSequence}
                className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                title="다음"
              >
                →
              </button>
            </div>
          )}

          {/* 👉 항상 맨 오른쪽 (xs에서도 '도움말' 표시) */}
          <SummarizeGuide />
        </div>
      </header>

      <div className="px-[3px]">
        <ModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          questionText={questionText}
          setQuestionText={setQuestionText}
        />
      </div>

      {/* ✅ Paraphrase와 동일한 2-패널 카드 레이아웃 */}
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
              placeholder={
                uploadedFile
                  ? "파일이 업로드되었습니다. 파일 내용만 요약됩니다."
                  : "내용을 입력하세요."
              }
              className="flex-1 w-full resize-none outline-none text-sm md:text-base"
              disabled={isLoading || !!uploadedFile}
            />

            <div className="flex justify-between items-center mt-2 md:mt-4">
              <FileUpload
                onFileSelect={setUploadedFile}
                maxSizeMB={2}
                disabled={isLoading}
              />

              <button
                onClick={handleApiCall}
                data-tour="convert-button"
                className={clsx(
                  "py-1.5 px-4 md:py-2 md:px-6 rounded-lg font-semibold text-xs md:text-base transition-all whitespace-nowrap",
                  cannotSummarizeMore
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                )}
                disabled={isButtonDisabled}
                title={
                  cannotSummarizeMore
                    ? "이 작업에서 최대 10개까지 요약할 수 있습니다"
                    : ""
                }
              >
                {cannotSummarizeMore
                  ? "요약 제한 도달"
                  : isLoading
                  ? "요약 중..."
                  : "요약하기"}
              </button>
            </div>

            {/* 10개 도달 경고 */}
            {cannotSummarizeMore && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                ⚠️ 이 작업에서 최대 요약 횟수에 도달했습니다.
                <button
                  onClick={handleNewConversation}
                  className="ml-1 underline hover:text-yellow-900"
                >
                  새 대화 시작하기
                </button>
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
                ? "요약 생성 중..."
                : selectedHistory?.summarizedText ||
                  outputText ||
                  "여기에 요약 결과가 표시됩니다."}
            </div>

            {(selectedHistory?.summarizedText || outputText) && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    selectedHistory?.summarizedText || outputText
                  );
                  // ✅ GTM 이벤트 푸시
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "copy_result",
                    feature: "copy",
                    service: "summary",
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

export default AiSummarizeBox;
