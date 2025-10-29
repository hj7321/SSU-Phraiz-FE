"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";
import { Copy } from "lucide-react";
import { requestParaphrase, ParaphraseApiMode } from "@/apis/paraphrase.api";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "@/stores/history.store";
import { useLocalHistory } from "@/stores/localHistory.store";
import { LocalHistoryNavigation } from "@/components/LocalHistoryNavigation";
import useClearContent from "@/hooks/useClearContent";
import useResetOnNewWork from "@/hooks/useResetOnNewWork";
import { usePlanRestriction } from "@/hooks/usePlanRestriction";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";

const HEADER_H = 72; // px

// 모드 선택 버튼 타입 정의
type ParaphraseMode = "표준" | "학술적" | "창의적" | "유창성" | "문학적" | "사용자 지정";

const ToneBlendSlider = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
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
        <input type="range" min="0" max="100" value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="absolute top-0 left-0 w-full h-1.5 bg-transparent appearance-none cursor-pointer slider-thumb" style={{ background: "transparent" }} />
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
const ModeSelector = ({ activeMode, setActiveMode, customStyle, setCustomStyle, creativityLevel, setCreativityLevel }: { activeMode: ParaphraseMode; setActiveMode: (mode: ParaphraseMode) => void; customStyle: string; setCustomStyle: (style: string) => void; creativityLevel: number; setCreativityLevel: (level: number) => void }) => {
  const modes: ParaphraseMode[] = ["표준", "학술적", "창의적", "유창성", "문학적"];
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const customButtonRef = useRef<HTMLButtonElement>(null);

  // 요금제 제한 hook 추가
  const { canUseFeature, getRequiredPlanName } = usePlanRestriction();

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
    // 기본 모드들(표준, 학술적, 창의적, 유창성, 문학적)은 모든 사용자가 사용 가능
    setActiveMode(mode);
    setIsPopoverOpen(false);
  };

  const handleCustomClick = () => {
    // 사용자 지정 모드만 권한 체크
    const canUse = canUseFeature("paraphrasing", "custom");
    if (canUse) {
      setActiveMode("사용자 지정");
      setIsPopoverOpen((prev) => !prev);
    }
  };

  const baseButtonClass = "h-9 md:h-11 text-[11px] md:text-sm whitespace-nowrap rounded-full font-medium transition-all flex items-center justify-center shadow-md shadow-neutral-900/20";
  const inactiveClass = "bg-purple-100 border border-purple-600/30 hover:bg-purple-200/60";
  const activeClass = "bg-purple-200 border border-purple-600/30 ring-1 ring-purple-300";
  const disabledClass = "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed opacity-50";

  return (
    <div className="w-full">
      <div className="flex w-full gap-2 md:gap-3">
        {modes.map((mode) => (
          <button key={mode} onClick={() => handleModeClick(mode)} className={clsx("flex-1", baseButtonClass, activeMode === mode ? activeClass : inactiveClass)}>
            {mode}
          </button>
        ))}

        {/* 사용자 지정 버튼만 요금제 제한 적용 */}
        <div className="relative flex-1">
          {canUseFeature("paraphrasing", "custom") ? (
            // Basic 이상 사용자
            <>
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
            </>
          ) : (
            // Free 사용자: 툴팁과 함께 비활성화
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button disabled className={clsx("w-full", baseButtonClass, "relative gap-2", disabledClass)}>
                    사용자 지정
                    <Image src="/icons/프리미엄2.svg" alt="" width={0} height={0} className="absolute w-[30px] h-[30px] top-[-12px] right-[-5px] md:w-[45px] md:h-[45px] md:top-[-20px] md:right-[-6px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getRequiredPlanName("paraphrasing", "custom")} 플랜부터 사용 가능합니다</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Tone Blend Slider 표시 */}
      <div className="mt-3">
        <ToneBlendSlider value={creativityLevel} onChange={setCreativityLevel} />
      </div>
    </div>
  );
};

const AiParaphraseBox = () => {
  const { toast } = useToast();

  // ========== Store & Router ==========
  const selectedHistory = useHistoryStore((state) => state.selectedHistory);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const { addParaphraseHistory, goToPreviousParaphrase, goToNextParaphrase, canGoBackParaphrase, canGoForwardParaphrase, getCurrentParaphrase, paraphraseHistories, paraphraseIndex, isHistoryFullParaphrase, startNewParaphraseConversation } = useLocalHistory();

  const isLogin = useAuthStore((s) => s.isLogin);
  const router = useRouter();
  const { canUseFeature } = usePlanRestriction();
  const { addTokenUsage, showTokenAlert, updateTokenUsage } = useTokenUsage();
  const queryClient = useQueryClient();

  // ========== State ==========
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeMode, setActiveMode] = useState<ParaphraseMode>("표준");
  const [customStyle, setCustomStyle] = useState("");
  const [creativityLevel, setCreativityLevel] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // ========== Hooks ==========
  useClearContent();

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

  useResetOnNewWork(() => {
    setInputText("");
    setOutputText("");
    setActiveMode("표준");
    setCustomStyle("");
    setIsLoading(false);
    setUploadedFile(null);
    clearHistory();
  });

  useEffect(() => {
    if (selectedHistory?.content) {
      setOutputText(selectedHistory.content);
    }
  }, [selectedHistory]);

  useEffect(() => {
    const currentLocal = getCurrentParaphrase();
    if (currentLocal) {
      setInputText(currentLocal.inputText);
      setOutputText(currentLocal.content);
      setActiveMode(currentLocal.mode as ParaphraseMode);
    }
  }, [paraphraseIndex, getCurrentParaphrase]);

  // ========== Handlers ==========
  const handleApiCall = async () => {
    if (!isLogin) {
      alert("로그인 후에 이용해주세요.");
      router.push("/login");
      return;
    }

    if (isHistoryFullParaphrase()) {
      toast({
        title: "히스토리 제한",
        description: "최대 10개까지 저장할 수 있습니다. 새 대화를 시작해주세요.",
        variant: "destructive",
        duration: 4000
      });
      return;
    }

    if (activeMode === "사용자 지정" && !canUseFeature("paraphrasing", "custom")) {
      alert("사용자 지정 모드는 Basic 플랜부터 이용 가능합니다.");
      return;
    }

    // 입력 검증
    if (!inputText.trim() && !uploadedFile) {
      alert("텍스트를 입력하거나 파일을 업로드해주세요.");
      return;
    }

    setIsLoading(true);
    setOutputText("");
    clearHistory();

    const modeMap: Record<ParaphraseMode, ParaphraseApiMode> = {
      표준: "standard",
      학술적: "academic",
      창의적: "creative",
      유창성: "fluency",
      문학적: "experimental",
      "사용자 지정": "custom"
    };
    const apiMode = modeMap[activeMode];

    try {
      let response;

      // 파일이 있으면 FormData 사용
      if (uploadedFile) {
        const formData = new FormData();

        if (inputText.trim()) {
          formData.append("text", inputText);
        }
        formData.append("file", uploadedFile);

        if (activeMode === "사용자 지정" && customStyle) {
          formData.append("userRequestMode", customStyle);
        }
        formData.append("scale", (creativityLevel / 100).toString());

        response = await requestParaphrase(apiMode, formData);
      } else {
        // 기존 방식
        const requestData = {
          text: inputText,
          userRequestMode: activeMode === "사용자 지정" ? customStyle : undefined,
          scale: creativityLevel / 100
        };
        response = await requestParaphrase(apiMode, requestData);
      }

      setOutputText(response.paraphrasedText);

      addParaphraseHistory({
        content: response.paraphrasedText,
        inputText: uploadedFile ? `[파일: ${uploadedFile.name}]` : inputText,
        mode: activeMode
      });

      // 토큰 처리
      if (response.remainingToken !== undefined) {
        const tokensUsed = updateTokenUsage(response.remainingToken);
        showTokenAlert(response.remainingToken, true);
        console.log(`이번 요청에서 ${tokensUsed} 토큰 사용됨`);
      } else {
        let tokensUsed = 0;
        if (response.usage?.total_tokens) {
          tokensUsed = response.usage.total_tokens;
        } else if (response.tokens_used) {
          tokensUsed = response.tokens_used;
        } else if (response.token_count) {
          tokensUsed = response.token_count;
        } else {
          const inputTokens = Math.ceil(inputText.length / 4);
          const outputTokens = Math.ceil((response.paraphrasedText?.length || 0) / 4);
          tokensUsed = inputTokens + outputTokens;
        }

        if (tokensUsed > 0) {
          addTokenUsage(tokensUsed);
          showTokenAlert(tokensUsed, false);
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["sidebar-history", "paraphrase"]
      });
    } catch (error) {
      console.error("API 요청 오류:", error);
      setOutputText("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    startNewParaphraseConversation();
    setInputText("");
    setOutputText("");
    setActiveMode("표준");
    setCustomStyle("");
    setUploadedFile(null);

    toast({
      title: "새 대화 시작",
      description: "히스토리가 초기화되었습니다.",
      duration: 2000
    });
  };

  const isHistoryFull = isHistoryFullParaphrase();
  const isButtonDisabled = isLoading || (!inputText.trim() && !uploadedFile) || isHistoryFull;

  // ========== Render ==========
  return (
    <div className="w-full flex flex-col h-full p-2 md:p-4 gap-2 md:gap-4">
      <header className="flex justify-between items-center px-[3px]">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">AI 문장 변환</h1>

        <div className="flex items-center gap-2">
          {paraphraseHistories.length > 0 && (
            <button onClick={handleNewConversation} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              새 대화
            </button>
          )}

          <LocalHistoryNavigation canGoBack={canGoBackParaphrase()} canGoForward={canGoForwardParaphrase()} onPrevious={goToPreviousParaphrase} onNext={goToNextParaphrase} currentIndex={paraphraseIndex} totalCount={paraphraseHistories.length} currentTimestamp={getCurrentParaphrase()?.timestamp} />
        </div>
      </header>

      <div className="px-[3px]">
        <ModeSelector activeMode={activeMode} setActiveMode={setActiveMode} customStyle={customStyle} setCustomStyle={setCustomStyle} creativityLevel={creativityLevel} setCreativityLevel={setCreativityLevel} />
      </div>

      <div className={clsx("flex flex-col md:flex-row", "flex-1 rounded-lg shadow-lg overflow-hidden border bg-white")}>
        <div className="w-full h-1/2 md:h-full md:w-1/2 border-b md:border-b-0 md:border-r p-2 md:p-4 flex flex-col">
          <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={uploadedFile ? "파일이 업로드되었습니다. 추가 텍스트를 입력하거나 바로 변환하세요." : "내용을 입력하세요."} className="flex-1 w-full resize-none outline-none text-sm md:text-base" disabled={isLoading}></textarea>

          <div className="flex justify-between items-center mt-2 md:mt-4">
            <FileUpload onFileSelect={setUploadedFile} maxSizeMB={2} disabled={isLoading} />

            <button onClick={handleApiCall} className={clsx("py-1.5 px-4 md:py-2 md:px-6 rounded-lg font-semibold text-xs md:text-base transition-all", isHistoryFull ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white")} disabled={isButtonDisabled} title={isHistoryFull ? "히스토리가 가득 찼습니다. 새 대화를 시작해주세요." : ""}>
              {isHistoryFull ? "히스토리 가득참" : isLoading ? "변환 중..." : "변환하기"}
            </button>
          </div>

          {isHistoryFull && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
              ⚠️ 히스토리가 가득 찼습니다.
              <button onClick={handleNewConversation} className="ml-1 underline hover:text-yellow-900">
                새 대화 시작하기
              </button>
            </div>
          )}
        </div>

        <div className="w-full h-1/2 md:h-full md:w-1/2 p-2 md:p-4 relative bg-gray-50">
          <div className="w-full h-full whitespace-pre-wrap text-gray-800 pr-10 text-sm md:text-base">{isLoading ? "결과 생성 중..." : selectedHistory?.content || outputText || "여기에 변환 결과가 표시됩니다."}</div>

          {(selectedHistory?.content || outputText) && (
            <button onClick={() => navigator.clipboard.writeText(selectedHistory?.content || outputText)} className="absolute top-3 right-3 p-2 text-gray-500 hover:bg-gray-200 rounded-full">
              <Copy className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiParaphraseBox;
