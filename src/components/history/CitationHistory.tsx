"use client";

import React, { useCallback } from "react";
import { Copy, Link as LinkIcon } from "lucide-react";
import { useCiteHistoryStore } from "@/stores/citeHistory.store";

const CitationHistory = () => {
  const selectedHistory = useCiteHistoryStore((s) => s.selectedCiteHistory);

  const handleCopy = useCallback(() => {
    const text = selectedHistory?.citationText ?? "";
    if (!text) return;
    navigator.clipboard.writeText(text);
    // ✅ GTM 이벤트 푸시
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "copy_result",
      feature: "copy",
      service: "cite",
    });
  }, [selectedHistory?.citationText]);

  if (!selectedHistory) return null;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-md shadow-md p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-[10px]">
          <h3 className="font-semibold text-gray-700">생성된 인용문</h3>
          <span className="px-3 py-1 text-sm font-semibold bg-indigo-100 text-indigo-600 rounded-lg">
            {selectedHistory?.style?.toUpperCase() ?? "APA"}
          </span>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 leading-relaxed">
          {selectedHistory?.citationText}
        </div>
        <button
          onClick={handleCopy}
          className="mt-2 flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <Copy className="h-4 w-4" />
          인용문 복사
        </button>
      </div>

      <hr className="border-gray-200" />

      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-gray-700">출처 정보</h3>
        <div className="flex flex-col gap-1 text-sm text-gray-800">
          <div className="flex items-start gap-1">
            <LinkIcon className="h-4 w-4 text-gray-500 mt-[2px]" />
            <a
              href={selectedHistory?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline break-all"
            >
              {selectedHistory?.url}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitationHistory;
