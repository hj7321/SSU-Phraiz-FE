"use client";

import React, { useCallback } from "react";
import { Copy } from "lucide-react";
import { useCiteHistoryStore } from "@/stores/citeHistory.store";

const CitationHistory = () => {
  const selectedHistory = useCiteHistoryStore((s) => s.selectedCiteHistory);

  const handleCopy = useCallback(() => {
    const text = selectedHistory?.citationText ?? "";
    if (!text) return;
    navigator.clipboard.writeText(text);
  }, [selectedHistory?.citationText]);

  return (
    <div className="p-[16px] flex flex-col rounded-md shadow-md border my-[10px] w-full gap-[10px] md:gap-[15px]">
      <div className="grid grid-cols-[auto,1fr] items-baseline gap-[2px] md:gap-[5px]">
        <h1 className="text-[12px] sm:text-[14px] md:text-[16px] font-nanum-extrabold">
          URL / DOI:
        </h1>
        <div className="min-w-0 break-all leading-5 text-[12px] sm:text-[14px] md:text-[16px]">
          {selectedHistory?.url}
        </div>
      </div>
      <div className="grid grid-cols-[auto,1fr] items-baseline gap-[2px] md:gap-[5px]">
        <h1 className="text-[12px] sm:text-[14px] md:text-[16px] font-nanum-extrabold">
          인용 형식:
        </h1>
        <div className="text-[12px] sm:text-[14px] md:text-[16px]">
          {selectedHistory?.style}
        </div>
      </div>
      <div className="grid grid-cols-[auto,1fr] items-baseline gap-[2px] md:gap-[5px]">
        <h1 className="text-[12px] sm:text-[14px] md:text-[16px] font-nanum-extrabold">
          생성된 인용문:
        </h1>
        <div className="min-w-0 break-words leading-5 text-[12px] sm:text-[14px] md:text-[16px]">
          {selectedHistory?.citationText}
          <button
            onClick={handleCopy}
            className="inline-flex items-center align-middle ml-2 p-1 rounded hover:bg-black/5"
            aria-label="결과 복사"
            title="복사"
          >
            <Copy className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitationHistory;
