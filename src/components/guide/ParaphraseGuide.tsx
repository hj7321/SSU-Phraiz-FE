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
    title: "2단계: 변환 스타일 선택",
    description:
      "원하는 문장 스타일(모드)을 선택하세요.<br />'사용자 지정' 모드는 직접 텍스트를 입력해 원하는 스타일을 요청할 수 있어요.",
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

const MD = 768;
const XS = 500; // 500px 이하: 2,4단계는 하단 배치
const ARROW_SIZE = 12; // w-3/h-3 = 12px
const STEP2_RIGHT_Y_OFFSET = 10; // 2단계 오른쪽 배치 시 살짝 아래로

export function ParaphraseGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 16, left: 16 });
  const [arrowSide, setArrowSide] = useState<ArrowSide>("top");
  const [arrowPos, setArrowPos] = useState<{ x?: number; y?: number }>({});
  const [maxWidthPx, setMaxWidthPx] = useState<number>(360);
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

  const computeMaxWidth = () => {
    const w = window.innerWidth;
    if (w < 640) return Math.min(0.92 * w, 320);
    if (w < MD) return Math.min(0.92 * w, 360);
    if (w < 840) return 370;
    if (w < 1024) return 420;
    return 448; // ≈ md:max-w-md
  };

  const pickVisibleTarget = (selector: string): HTMLElement | null => {
    const nodes = Array.from(
      document.querySelectorAll(selector)
    ) as HTMLElement[];
    for (const el of nodes) {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 0 &&
        rect.height > 0
      ) {
        return el;
      }
    }
    return null;
  };

  // 배치 규칙
  const resolvePosition = (stepIndex: number, base: ArrowSide): ArrowSide => {
    const w = window.innerWidth;
    const belowMd = w < MD;

    if (w <= XS && (stepIndex === 1 || stepIndex === 3)) return "bottom";

    if (stepIndex === 0) return belowMd ? "bottom" : "right";
    if (stepIndex === 1) return belowMd ? "right" : base;
    if (stepIndex === 2) return belowMd ? "bottom" : base;
    if (stepIndex === 3) return belowMd ? "left" : base;
    return base;
  };

  useEffect(() => {
    if (!isOpen) return;

    const step = tourSteps[currentStep];

    const applyHighlight = () => {
      document
        .querySelectorAll("[data-tour-highlight]")
        .forEach((el) => el.removeAttribute("data-tour-highlight"));
      const t = pickVisibleTarget(step.target);
      if (t) t.setAttribute("data-tour-highlight", "true");
    };

    const updateSizeHint = () => setMaxWidthPx(computeMaxWidth());

    const updatePosition = () => {
      const target = pickVisibleTarget(step.target);
      if (!target || !tooltipRef.current) return;

      const tr = target.getBoundingClientRect();
      const tt = tooltipRef.current.getBoundingClientRect();

      // 1) 기본 포지션 결정
      let pos: ArrowSide = resolvePosition(
        currentStep,
        step.position ?? "bottom"
      );

      // 2) 말풍선 좌표 계산 (anchorSide는 여기서 계산하지 않음)
      let top = 0;
      let left = 0;

      const place = (p: ArrowSide) => {
        switch (p) {
          case "top":
            top = tr.top - tt.height - 12;
            left = tr.left + tr.width / 2 - tt.width / 2;
            break;
          case "left":
            top = tr.top + tr.height / 2 - tt.height / 2;
            left = tr.left - tt.width - 12;
            break;
          case "right":
            top = tr.top + tr.height / 2 - tt.height / 2;
            left = tr.right + 12;
            break;
          case "bottom":
          default:
            top = tr.bottom + 12;
            left = tr.left + tr.width / 2 - tt.width / 2;
        }
      };

      place(pos);

      // 3) 뷰포트 충돌 보정
      const pad = 12;
      const vW = window.innerWidth;
      const vH = window.innerHeight;

      const overflowRight = left + tt.width + pad > vW;
      const overflowLeft = left < pad;
      const overflowBottom = top + tt.height + pad > vH;
      const overflowTop = top < pad;

      if (pos === "right" && overflowRight) {
        pos = "left";
        place(pos);
      } else if (pos === "left" && overflowLeft) {
        pos = "right";
        place(pos);
      } else if (pos === "bottom" && overflowBottom) {
        pos = "top";
        place(pos);
      } else if (pos === "top" && overflowTop) {
        pos = "bottom";
        place(pos);
      }

      // 4) 2단계 + 오른쪽 배치일 때만 살짝 아래로
      if (currentStep === 1 && pos === "right") {
        top += STEP2_RIGHT_Y_OFFSET;
      }

      // 5) 화면 안으로 클램프
      left = Math.min(Math.max(left, pad), vW - tt.width - pad);
      top = Math.min(Math.max(top, pad), vH - tt.height - pad);

      // 6) 최종 pos로부터 화살표가 붙을 면을 계산 (TS 안전)
      const anchorSideFinal: ArrowSide =
        pos === "top"
          ? "bottom"
          : pos === "bottom"
          ? "top"
          : pos === "left"
          ? "right"
          : "left";

      // 7) 화살표 좌표(px)
      const centerX = tr.left + tr.width / 2;
      const centerY = tr.top + tr.height / 2;
      const mobileBiasY =
        currentStep === 1 && vW < MD && (pos === "right" || pos === "left")
          ? -Math.min(tr.height / 4, 14)
          : 0;

      let ax: number | undefined;
      let ay: number | undefined;

      if (anchorSideFinal === "left" || anchorSideFinal === "right") {
        const pointerY = centerY + mobileBiasY;
        ay = Math.min(
          Math.max(pointerY - top - ARROW_SIZE / 2, 8),
          tt.height - 8 - ARROW_SIZE
        );
      } else {
        const pointerX = centerX;
        ax = Math.min(
          Math.max(pointerX - left - ARROW_SIZE / 2, 8),
          tt.width - 8 - ARROW_SIZE
        );
      }

      setTooltipPos({ top, left });
      setArrowSide(anchorSideFinal);
      setArrowPos({ x: ax, y: ay });
    };

    // 초기 하이라이트/포지셔닝
    updateSizeHint();
    const r0 = requestAnimationFrame(() => {
      applyHighlight();
      updatePosition();
    });
    const r1 = requestAnimationFrame(() =>
      requestAnimationFrame(updatePosition)
    );

    const onResize = () => {
      updateSizeHint();
      applyHighlight();
      requestAnimationFrame(updatePosition);
    };
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
        className="flex items-center gap-1.5 rounded-lg border border-purple-200 px-2.5 py-1 text-[11px] sm:text-xs md:text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 whitespace-nowrap"
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
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              maxWidth: `${maxWidthPx}px`,
              width: `min(92vw, ${maxWidthPx}px)`,
            }}
          >
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-3 md:p-4">
              {/* 말풍선 화살표 */}
              <div
                className={clsx(
                  "absolute w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-white border rotate-45",
                  arrowSide === "top" &&
                    "-top-2 left-1/2 -translate-x-1/2 border-b-0 border-r-0",
                  arrowSide === "bottom" &&
                    "-bottom-2 left-1/2 -translate-x-1/2 border-t-0 border-l-0",
                  arrowSide === "left" &&
                    "-left-2 top-1/2 -translate-y-1/2 border-t-0 border-r-0",
                  arrowSide === "right" &&
                    "-right-2 top-1/2 -translate-y-1/2 border-b-0 border-l-0"
                )}
                style={{
                  top:
                    arrowSide === "left" || arrowSide === "right"
                      ? `${arrowPos.y ?? 0}px`
                      : undefined,
                  left:
                    arrowSide === "top" || arrowSide === "bottom"
                      ? `${arrowPos.x ?? 0}px`
                      : undefined,
                }}
              />

              <button
                onClick={close}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              <div className="pr-6">
                <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base md:text-lg">
                  {step.title}
                </h3>
                <p
                  className="text-gray-600 leading-relaxed text-[11.5px] sm:text-[13.5px] md:text-sm"
                  dangerouslySetInnerHTML={{ __html: `${step.description}` }}
                />
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
                      "rounded-lg transition-colors px-3 py-1 text-xs sm:text-xs md:text-sm",
                      currentStep === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    이전
                  </button>
                  <button
                    onClick={isLast ? finish : next}
                    className="rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors px-3 py-1 text-xs sm:text-xs md:text-sm"
                  >
                    {isLast ? "완료" : "다음"}
                  </button>
                </div>
              </div>
            </div>
          </div>

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
