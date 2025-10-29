"use client";

import clsx from "clsx";
import React, { memo } from "react";

interface ToggleButtonsProps {
  isCreatingNew: boolean;
  onSetNew: () => void;
  onSetChange: () => void;
}

const ToggleButtons = ({
  isCreatingNew,
  onSetNew,
  onSetChange,
}: ToggleButtonsProps) => {
  return (
    <div className="flex gap-[10px] md:gap-[15px] text-[12px] md:text-[16px]">
      <button
        onClick={onSetNew}
        className={clsx(
          "rounded-full py-[6px] px-[12px] md:py-[10px] md:px-[20px] text-white transition-all duration-300",
          isCreatingNew
            ? "bg-gradient-to-b from-[#4613ff] to-[#a37eff] [filter:drop-shadow(0px_0px_2px_rgba(70,19,255,1))] hover:shadow-[0_0_0_1px_#ab8ff2]"
            : "bg-[#a37eff]/40 hover:shadow-[0_0_0_1px_rgba(163,126,255,0.5)]"
        )}
      >
        새 인용문 생성
      </button>
      <button
        onClick={onSetChange}
        className={clsx(
          "rounded-full py-[6px] px-[12px] md:py-[10px] md:px-[20px] text-white transition-all duration-300",
          isCreatingNew
            ? "bg-[#a37eff]/40 hover:shadow-[0_0_0_1px_rgba(163,126,255,0.5)]"
            : "bg-gradient-to-b from-[#4613ff] to-[#a37eff] [filter:drop-shadow(0px_0px_2px_rgba(70,19,255,1))]"
        )}
      >
        기존 인용문 변환
      </button>
    </div>
  );
};

export default memo(ToggleButtons);
