"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HelpCircle, X } from "lucide-react";
import clsx from "clsx";
import { useGuideProgress } from "@/hooks/useGuideProcess";

type ArrowSide = "top" | "bottom" | "left" | "right";

type Step =
  | {
      targets: string[];
      title: string;
      description: string;
      pos: ArrowSide;
      pad?: number;
      radius?: number;
    }
  | {
      target: string;
      title: string;
      description: string;
      pos: ArrowSide;
      pad?: number;
    };

const STEPS: Step[] = [
  {
    targets: ["[data-cite-url-label]", "[data-cite-url-input]"],
    title: "1단계: URL 또는 DOI 입력",
    description: "인용문을 생성하고 싶은 논문의 URL이나 DOI를 입력하세요.",
    pos: "bottom",
    pad: 10,
    radius: 12,
  },
  {
    targets: [
      "[data-cite-style-label]",
      "[data-cite-style-row] [role='combobox'], [data-cite-style-row] button, [data-cite-style-row] [data-radix-select-trigger]",
    ],
    title: "2단계: 인용 형식 선택",
    description:
      "원하는 인용문 형식을 선택하세요.<br />각 형식 오른쪽에는 이 형식이 주로 쓰이는 분야가 키워드로 안내돼요.",
    pos: "bottom",
    pad: 10,
    radius: 10,
  },
  {
    target: "[data-cite-submit-btn]",
    title: "3단계: 인용 생성하기",
    description: "'인용 생성하기' 버튼을 눌러 결과를 확인하세요.",
    pos: "right",
    pad: 0,
  },
];

function unionRect(els: HTMLElement[]) {
  const rects = els.map((e) => e.getBoundingClientRect());
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return { left, top, width: right - left, height: bottom - top };
}

export default function CitationGuide() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const [ring, setRing] = useState({
    top: 80,
    left: 80,
    width: 320,
    height: 120,
    radius: "12px",
  });

  const [tip, setTip] = useState({
    top: 120,
    left: 120,
    side: "top" as ArrowSide,
  });

  // 🔧 모바일(≤500px) 3단계 전용: 화살표 X 위치(px). null이면 가운데 기본값 사용
  const [arrowX, setArrowX] = useState<number | null>(null);

  const tipRef = useRef<HTMLDivElement>(null);
  const guide = useGuideProgress("cite");
  const step = STEPS[idx];
  const isLast = idx === STEPS.length - 1;

  const openGuide = () => {
    setOpen(true);
    const resume = guide.get();
    setIdx((resume ?? 1) - 1);
  };
  const close = () => {
    guide.set(idx + 1);
    setOpen(false);
  };
  const finish = () => {
    guide.reset();
    setOpen(false);
  };

  const compute = () => {
    if (!open) return;

    let highlight: {
      top: number;
      left: number;
      width: number;
      height: number;
      radius: string;
    } | null = null;
    let scrollTarget: HTMLElement | null = null;

    if ("targets" in step) {
      const els = step.targets
        .map((q) => document.querySelector(q) as HTMLElement | null)
        .filter(Boolean) as HTMLElement[];
      if (els.length) {
        const u = unionRect(els);
        const pad = step.pad ?? 8;
        highlight = {
          top: Math.max(8, u.top - pad),
          left: Math.max(8, u.left - pad),
          width: u.width + pad * 2,
          height: u.height + pad * 2,
          radius: `${step.radius ?? 12}px`,
        };
        scrollTarget = els[0];
      }
    } else {
      const el = document.querySelector(step.target) as HTMLElement | null;
      if (el) {
        const r = el.getBoundingClientRect();
        const pad = step.pad ?? 0;
        const radius = getComputedStyle(el).borderRadius || "12px";
        highlight = {
          top: Math.max(8, r.top - pad),
          left: Math.max(8, r.left - pad),
          width: r.width + pad * 2,
          height: r.height + pad * 2,
          radius,
        };
        scrollTarget = el;
      }
    }

    if (!highlight || !tipRef.current) return;

    scrollTarget?.scrollIntoView({ block: "center", behavior: "smooth" });

    setRing(highlight);

    const ttr = tipRef.current.getBoundingClientRect();
    const gap = 12;

    // ✅ 3단계 & 500px 이하에서는 말풍선을 '아래' 배치하고,
    //    화살표가 버튼 중앙을 가리키도록 X 좌표를 계산
    const isMobileStep3 = idx === 2 && window.innerWidth <= 500;

    // 배치 측면 결정
    let pos: ArrowSide = step.pos;
    if (isMobileStep3) pos = "bottom";

    let top = 0,
      left = 0,
      side: ArrowSide = "top";

    switch (pos) {
      case "top":
        top = highlight.top - ttr.height - gap;
        left = highlight.left + highlight.width / 2 - ttr.width / 2;
        side = "bottom";
        break;
      case "left":
        top = highlight.top + highlight.height / 2 - ttr.height / 2;
        left = highlight.left - ttr.width - gap;
        side = "right";
        break;
      case "right":
        top = highlight.top + highlight.height / 2 - ttr.height / 2;
        left = highlight.left + highlight.width + gap;
        side = "left";
        break;
      case "bottom":
      default:
        top = highlight.top + highlight.height + gap;
        left = highlight.left + highlight.width / 2 - ttr.width / 2;
        side = "top";
    }

    const padScr = 8;
    left = Math.min(
      Math.max(left, padScr),
      window.innerWidth - ttr.width - padScr
    );
    top = Math.min(
      Math.max(top, padScr),
      window.innerHeight - ttr.height - padScr
    );

    setTip({ top, left, side });

    // 🔽 화살표 X 보정: 툴팁의 왼쪽 기준으로 버튼 중앙까지의 거리
    if (isMobileStep3 && (side === "top" || side === "bottom")) {
      const targetCenter = highlight.left + highlight.width / 2;
      let x = targetCenter - left; // 툴팁 내부 좌표
      // 가장자리로 너무 붙지 않도록 소폭 여유
      const margin = 12;
      x = Math.max(margin, Math.min(x, ttr.width - margin));
      setArrowX(x);
    } else {
      setArrowX(null);
    }
  };

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(compute);
    const onResize = () => requestAnimationFrame(compute);
    const onScroll = () => requestAnimationFrame(compute);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idx]);

  const ringStyle = useMemo<React.CSSProperties>(() => {
    return {
      top: ring.top,
      left: ring.left,
      width: ring.width,
      height: ring.height,
      borderRadius: ring.radius,
      boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
      border: "2px solid rgba(255,255,255,0.95)",
    };
  }, [ring]);

  return (
    <>
      <button
        onClick={openGuide}
        className="flex items-center gap-1.5 rounded-lg border border-purple-200 px-2.5 py-1 text-[11px] sm:text-xs md:text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 whitespace-nowrap"
        title="사용 방법 보기"
      >
        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>도움말</span>
      </button>

      {!open ? null : (
        <>
          <div className="fixed inset-0 z-[10000]" onClick={close} />
          <div
            aria-hidden
            className="fixed z-[10001] pointer-events-none"
            style={ringStyle}
          />

          <div
            ref={tipRef}
            className="fixed z-[10002] w-[92vw] max-w-[340px] sm:max-w-[380px] md:max-w-md"
            style={{ top: tip.top, left: tip.left }}
          >
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-3 md:p-4">
              {/* 화살표 */}
              <div
                className={clsx(
                  "absolute w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-white border rotate-45",
                  tip.side === "top" && "-top-2 border-b-0 border-r-0",
                  tip.side === "bottom" && "-bottom-2 border-t-0 border-l-0",
                  tip.side === "left" &&
                    "-left-2 top-1/2 -translate-y-1/2 border-t-0 border-r-0",
                  tip.side === "right" &&
                    "-right-2 top-1/2 -translate-y-1/2 border-b-0 border-l-0",
                  // 기본(가운데) 배치: 모바일 3단계 보정이 없을 때만
                  arrowX == null &&
                    (tip.side === "top" || tip.side === "bottom") &&
                    "left-1/2 -translate-x-1/2"
                  // 좌우는 기존대로 가운데 정렬
                )}
                // 모바일(≤500px) 3단계에서만 툴팁 내부 X 좌표로 정밀 배치
                style={
                  arrowX != null &&
                  (tip.side === "top" || tip.side === "bottom")
                    ? { left: arrowX }
                    : undefined
                }
              />

              <button
                onClick={close}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                aria-label="닫기"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              <div className="pr-6">
                <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base md:text-lg">
                  {"title" in step ? (step as any).title : ""}
                </h3>
                <p
                  className="text-gray-600 leading-relaxed text-[11.5px] sm:text-[13.5px] md:text-sm"
                  dangerouslySetInnerHTML={{
                    __html:
                      "description" in step ? (step as any).description : "",
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                <span className="text-gray-500 text-xs sm:text-sm">
                  {idx + 1} / {STEPS.length}
                </span>
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setIdx((v) => Math.max(0, v - 1))}
                    disabled={idx === 0}
                    className={clsx(
                      "rounded-lg transition-colors px-3 py-1 text-xs sm:text-xs md:text-sm",
                      idx === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    이전
                  </button>
                  <button
                    onClick={() => (isLast ? finish() : setIdx((v) => v + 1))}
                    className="rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors px-3 py-1 text-xs sm:text-xs md:text-sm"
                  >
                    {isLast ? "완료" : "다음"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
