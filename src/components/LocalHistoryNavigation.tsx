"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface LocalHistoryNavigationProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
  currentTimestamp?: Date;
}

export const LocalHistoryNavigation = ({ canGoBack, canGoForward, onPrevious, onNext, currentIndex, totalCount, currentTimestamp }: LocalHistoryNavigationProps) => {
  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
      <button onClick={onPrevious} disabled={!canGoBack} className={clsx("p-2 rounded-lg transition-all", canGoBack ? "hover:bg-gray-200 text-gray-700" : "opacity-30 cursor-not-allowed text-gray-400")} aria-label="이전 히스토리" title="이전 히스토리">
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button onClick={onNext} disabled={!canGoForward} className={clsx("p-2 rounded-lg transition-all", canGoForward ? "hover:bg-gray-200 text-gray-700" : "opacity-30 cursor-not-allowed text-gray-400")} aria-label="다음 히스토리" title="다음 히스토리">
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 ml-2">
        <span className="text-sm text-gray-600">
          {currentIndex + 1} / {totalCount}
        </span>

        {currentTimestamp && (
          <span className="text-xs text-gray-500">
            {new Date(currentTimestamp).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        )}
      </div>
    </div>
  );
};
