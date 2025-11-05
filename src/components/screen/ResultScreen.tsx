"use client";

import { Copy } from "lucide-react";
import React from "react";

interface ResultScreenProps {
  text: string;
  onCopy: () => void;
  showCopy: boolean;
}

const ResultScreen = ({ text, onCopy, showCopy }: ResultScreenProps) => {
  return (
    <div className="relative text-[12px] sm:text-[14px] md:text-[16px] w-full p-[16px] pr-10 border-t whitespace-pre-wrap break-words">
      {text}

      {showCopy && (
        <button
          onClick={onCopy}
          className="absolute top-3 right-3 p-2 text-gray-500 hover:bg-gray-200 rounded-full z-10"
          aria-label="결과 복사"
          title="복사"
        >
          <Copy className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ResultScreen;
