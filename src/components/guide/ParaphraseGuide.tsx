"use client";

import { useEffect, useRef, useState } from "react";
import { X, HelpCircle } from "lucide-react";
import clsx from "clsx";
import { useGuideProgress } from "@/hooks/useGuideProcess";

type ArrowSide = "top" | "bottom" | "left" | "right";

interface TourStep {
  target: string;
  title: string;
  description: string;
  position?: ArrowSide;
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='input-area']",
    title: "1단계: 텍스트 입력",
    description: "변환하고 싶은 문장이나 글을 입력하세요.",
    position: "top",
  },
  {
    target: "[data-tour='mode-buttons']",
    title: "2단계: 스타일 선택",
    description:
      "원하는 문장 스타일(모드)을 선택하세요.<br />'사용자 지정' 모드는 직접 텍스트를 입력해 원하는 스타일을<br />요청할 수 있어요.",
    position: "bottom",
  },
  {
    target: "[data-tour='slider']",
    title: "3단계: 강도 조절",
    description:
      "슬라이더로 적용 강도를 조정합니다.<br />숫자가 클수록 스타일이 강하게 적용됩니다.",
    position: "bottom",
  },
  {
    target: "[data-tour='convert-button']",
    title: "4단계: 변환하기",
    description: "설정이 끝났다면 '변환하기' 버튼을 눌러 결과를 확인하세요.",
    position: "top",
  },
];

export function ParaphraseGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 16, left: 16 });
  const [arrow, setArrow] = useState<ArrowSide>("top");
  const tooltipRef = useRef<HTMLDivElement>(null);

  const guide = useGuideProgress("paraphrase");
  const total = tourSteps.length;
  const isLast = currentStep === total - 1;

  const open = () => {
    setIsOpen(true);
    const resume = guide.get();
    setCurrentStep((resume ?? 1) - 1);
  };
  const close = () => {
    guide.set(currentStep + 1);
    setIsOpen(false);
    setCurrentStep(0);
    document
      .querySelectorAll("[data-tour-highlight]")
      .forEach((el) => el.removeAttribute("data-tour-highlight"));
  };
  const finish = () => {
    guide.reset();
    setIsOpen(false);
    setCurrentStep(0);
    document
      .querySelectorAll("[data-tour-highlight]")
      .forEach((el) => el.removeAttribute("data-tour-highlight"));
  };
  const next = () =>
    setCurrentStep((idx) => {
      const n = Math.min(idx + 1, total - 1);
      guide.set(n + 1);
      return n;
    });

  const prev = () =>
    setCurrentStep((idx) => {
      const p = Math.max(idx - 1, 0);
      guide.set(p + 1);
      return p;
    });

  useEffect(() => {
    if (!isOpen) return;

    const step = tourSteps[currentStep];
    const target = document.querySelector(step.target) as HTMLElement | null;

    document
      .querySelectorAll("[data-tour-highlight]")
      .forEach((el) => el.removeAttribute("data-tour-highlight"));
    if (target) {
      target.setAttribute("data-tour-highlight", "true");
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    const updatePosition = () => {
      if (!target || !tooltipRef.current) return;
      const tr = target.getBoundingClientRect();
      const tt = tooltipRef.current.getBoundingClientRect();

      // ✅ sm 미만이고 4단계(인덱스 3)이면 왼쪽에 배치
      const isBelowMd = window.innerWidth < 768;
      const basePos: ArrowSide = step.position ?? "bottom";
      const pos: ArrowSide = currentStep === 3 && isBelowMd ? "left" : basePos;

      let top = 0,
        left = 0;
      let side: ArrowSide = "top";

      switch (pos) {
        case "top":
          top = tr.top - tt.height - 12;
          left = tr.left + tr.width / 2 - tt.width / 2;
          side = "bottom";
          break;
        case "left":
          top = tr.top + tr.height / 2 - tt.height / 2;
          left = tr.left - tt.width - 12;
          side = "right"; // ← 버튼을 향해 오른쪽 화살표
          break;
        case "right":
          top = tr.top + tr.height / 2 - tt.height / 2;
          left = tr.right + 12;
          side = "left";
          break;
        case "bottom":
        default:
          top = tr.bottom + 12;
          left = tr.left + tr.width / 2 - tt.width / 2;
          side = "top";
      }

      const pad = 12;
      const clamp = (v: number, min: number, max: number) =>
        Math.min(Math.max(v, min), max);
      left = clamp(left, pad, window.innerWidth - tt.width - pad);
      top = clamp(top, pad, window.innerHeight - tt.height - pad);

      setTooltipPos({ top, left });
      setArrow(side);
    };

    const r0 = requestAnimationFrame(updatePosition);
    const r1 = requestAnimationFrame(() =>
      requestAnimationFrame(updatePosition)
    );

    const onResize = () => updatePosition();
    const onScroll = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(r0);
      cancelAnimationFrame(r1);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isOpen, currentStep]);

  const step = tourSteps[currentStep];

  return (
    <>
      {/* 헤더 우측 도움말 버튼 */}
      <button
        onClick={open}
        className="flex items-center gap-1.5 rounded-lg border border-purple-200
             px-2.5 py-1 text-[11px] sm:text-xs md:text-sm
             text-purple-600 hover:text-purple-700 hover:bg-purple-50 whitespace-nowrap"
        title="사용 방법 보기"
      >
        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="inline">도움말</span>
      </button>

      {!isOpen ? null : (
        <>
          <div
            className="fixed inset-0 bg-black/45 z-[10000]"
            onClick={close}
          />

          <div
            ref={tooltipRef}
            className="fixed z-[10002] w-[92vw] max-w-[320px] sm:max-w-[360px] md:max-w-md"
            style={{ top: tooltipPos.top, left: tooltipPos.left }}
          >
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-3 md:p-4">
              {/* 화살표 */}
              <div
                className={clsx(
                  "absolute w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-white border rotate-45",
                  arrow === "top" &&
                    "-top-2 left-1/2 -translate-x-1/2 border-b-0 border-r-0",
                  arrow === "bottom" &&
                    "-bottom-2 left-1/2 -translate-x-1/2 border-t-0 border-l-0",
                  arrow === "left" &&
                    "-left-2 top-1/2 -translate-y-1/2 border-t-0 border-r-0",
                  arrow === "right" &&
                    "-right-2 top-1/2 -translate-y-1/2 border-b-0 border-l-0"
                )}
              />

              <button
                onClick={close}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              {/* 데스크톱(md) 사이즈를 예전처럼: 제목 lg, 본문 sm */}
              <div className="pr-6">
                <h3
                  className="font-bold text-gray-900 mb-1
                               text-sm sm:text-base md:text-lg"
                >
                  {step.title}
                </h3>
                <p
                  className="text-gray-600 leading-relaxed
                              text-[11.5px] sm:text-[13.5px] md:text-sm"
                  dangerouslySetInnerHTML={{
                    __html: `${step.description}`,
                  }}
                ></p>
              </div>

              <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                <span className="text-gray-500 text-xs sm:text-sm md:text-sm">
                  {currentStep + 1} / {total}
                </span>
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={prev}
                    disabled={currentStep === 0}
                    className={clsx(
                      "rounded-lg transition-colors",
                      "px-3 py-1 text-xs sm:text-xs md:text-sm",
                      currentStep === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    이전
                  </button>
                  <button
                    onClick={isLast ? finish : next}
                    className="rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors
                               px-3 py-1 text-xs sm:text-xs md:text-sm"
                  >
                    {isLast ? "완료" : "다음"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 하이라이트: 화이트 아웃라인(보라 경계선 제거) */}
          <style jsx global>{`
            [data-tour-highlight="true"] {
              position: relative;
              z-index: 10001;
              border-radius: 10px;
              outline: 3px solid rgba(255, 255, 255, 0.9);
              box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
              pointer-events: none;
              transition: outline 0.15s ease, box-shadow 0.15s ease;
            }
          `}</style>
        </>
      )}
    </>
  );
}
