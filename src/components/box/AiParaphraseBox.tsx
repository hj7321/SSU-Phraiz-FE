"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { useSidebar } from "../ui/sidebar/sidebar";
import { Copy } from "lucide-react";
import { requestParaphrase, ParaphraseApiMode } from "@/apis/paraphrase.api";
import Image from "next/image";

const HEADER_H = 72;

// 사용자 모드 다이아몬드 SVG
const FacetedDiamondIcon = () => (
  <svg
    width="22"
    height="21"
    viewBox="0 0 22 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.5436 7.75695e-06C4.51337 -0.000271847 4.48355 0.00701147 4.45683 0.0212016C4.4301 0.0353917 4.4073 0.0560426 4.39049 0.0812937C4.37368 0.106545 4.36339 0.135602 4.36054 0.165848C4.35769 0.196094 4.36237 0.226579 4.37416 0.254554L4.47892 0.503148L6.33279 4.84783C6.34539 4.87738 6.3655 4.90307 6.39112 4.92233C6.41673 4.94159 6.44693 4.95373 6.47869 4.95754C6.51046 4.96134 6.54265 4.95668 6.57205 4.94401C6.60145 4.93134 6.62701 4.91112 6.64617 4.88537L10.0679 0.29301C10.0882 0.265803 10.1005 0.233452 10.1036 0.19958C10.1066 0.165709 10.1002 0.131656 10.0851 0.101238C10.0699 0.0708193 10.0467 0.0452371 10.0179 0.0273576C9.9891 0.00947809 9.95593 7.75695e-06 9.9221 7.75695e-06H4.5436ZM18.1269 1.19308L16.2467 5.60506C16.2348 5.63291 16.2301 5.66328 16.2328 5.69344C16.2355 5.7236 16.2456 5.75261 16.2622 5.77788C16.2788 5.80315 16.3014 5.82388 16.3279 5.83822C16.3545 5.85256 16.3841 5.86007 16.4143 5.86006H21.0148C21.0473 5.86007 21.0792 5.85136 21.1072 5.83482C21.1352 5.81828 21.1583 5.79451 21.1741 5.76598C21.1899 5.73745 21.1978 5.70519 21.197 5.67255C21.1962 5.63991 21.1868 5.60807 21.1697 5.58033L18.449 1.16881C18.4314 1.14041 18.4064 1.11739 18.3767 1.10225C18.3471 1.08711 18.3138 1.08043 18.2807 1.08293C18.2475 1.08543 18.2156 1.09702 18.1885 1.11643C18.1614 1.13585 18.1401 1.16236 18.1269 1.19308ZM2.87102 1.17064L0.151253 5.58033C0.134118 5.60807 0.124672 5.63991 0.123894 5.67255C0.123117 5.70519 0.131037 5.73745 0.146832 5.76598C0.162628 5.79451 0.185725 5.81828 0.213732 5.83482C0.241739 5.85136 0.273637 5.86007 0.306122 5.86006H4.90663C4.93678 5.86002 4.96645 5.85247 4.99298 5.83807C5.01951 5.82367 5.04207 5.80288 5.05864 5.77756C5.07521 5.75224 5.08527 5.72319 5.08791 5.693C5.09056 5.66281 5.08571 5.63244 5.0738 5.6046L3.18987 1.19491C3.17639 1.16495 3.15515 1.1392 3.12835 1.12034C3.10156 1.10149 3.07021 1.09023 3.0376 1.08774C3.00499 1.08526 2.97231 1.09165 2.943 1.10624C2.91369 1.12082 2.88883 1.14307 2.87102 1.17064ZM16.9126 7.75695e-06H11.1984C11.1819 -9.9442e-05 11.1657 0.00443215 11.1517 0.0130901C11.1376 0.0217481 11.1262 0.0341871 11.1188 0.0490004C11.1114 0.0638137 11.1083 0.0804105 11.1098 0.0969141C11.1113 0.113418 11.1174 0.12917 11.1273 0.142389L14.7677 5.0163C14.777 5.02882 14.7894 5.03866 14.8036 5.04482C14.8179 5.05098 14.8336 5.05324 14.849 5.05139C14.8644 5.04953 14.8791 5.04361 14.8915 5.03424C14.904 5.02487 14.9137 5.01236 14.9198 4.99799L16.8365 0.503606L16.9914 0.121787C16.9969 0.108681 16.9991 0.0944411 16.9979 0.0802863C16.9966 0.0661315 16.992 0.0524838 16.9844 0.0405124C16.9768 0.028541 16.9664 0.0186025 16.9541 0.0115482C16.9419 0.00449388 16.9281 0.000533989 16.914 7.75695e-06H16.9126ZM9.88566 19.0452L5.81216 7.43998C5.8002 7.40628 5.77814 7.37714 5.74902 7.35656C5.71989 7.33598 5.68514 7.32498 5.64954 7.32507H0.169929C0.138186 7.32498 0.107056 7.33385 0.0800862 7.35068C0.0531163 7.3675 0.0313909 7.39161 0.0173853 7.42024C0.00337979 7.44887 -0.00234257 7.48088 0.00087025 7.51262C0.00408307 7.54436 0.0161019 7.57455 0.0355572 7.59976L9.87427 20.4099C9.90758 20.4533 9.95509 20.4834 10.0084 20.4949C10.0617 20.5063 10.1173 20.4985 10.1653 20.4727C10.2137 20.4471 10.2513 20.4049 10.2712 20.3538C10.2912 20.3027 10.2923 20.2461 10.2742 20.1943L9.88566 19.0452ZM21.1501 7.32507H15.6705C15.635 7.32506 15.6005 7.33612 15.5716 7.35671C15.5427 7.37729 15.5209 7.40639 15.5092 7.43998L11.0362 20.1746C11.0175 20.2281 11.0182 20.2865 11.0384 20.3395C11.0586 20.3924 11.0969 20.4364 11.1465 20.4635C11.196 20.4905 11.2535 20.4989 11.3086 20.4872C11.3638 20.4756 11.413 20.4446 11.4476 20.3999L21.2844 7.59976C21.3039 7.57455 21.3159 7.54436 21.3191 7.51262C21.3223 7.48088 21.3166 7.44887 21.3026 7.42024C21.2886 7.39161 21.2669 7.3675 21.2399 7.35068C21.2129 7.33385 21.1818 7.32498 21.1501 7.32507ZM10.8058 2.14854L13.3565 5.56706C13.3768 5.59427 13.3892 5.62662 13.3922 5.66049C13.3953 5.69436 13.3889 5.72841 13.3737 5.75883C13.3586 5.78925 13.3353 5.81483 13.3066 5.83271C13.2778 5.85059 13.2446 5.86006 13.2108 5.86006H8.10922C8.07539 5.86006 8.04222 5.85059 8.01344 5.83271C7.98465 5.81483 7.96139 5.78925 7.94626 5.75883C7.93113 5.72841 7.92472 5.69436 7.92776 5.66049C7.9308 5.62662 7.94316 5.59427 7.96346 5.56706L10.5142 2.14854C10.5312 2.1258 10.5532 2.10734 10.5785 2.09462C10.6038 2.08191 10.6317 2.07529 10.66 2.07529C10.6883 2.07529 10.7162 2.08191 10.7415 2.09462C10.7668 2.10734 10.7888 2.1258 10.8058 2.14854ZM10.4869 16.355L7.4032 7.56909C7.39352 7.54148 7.39056 7.51194 7.39458 7.48295C7.39859 7.45395 7.40947 7.42635 7.42629 7.40245C7.4431 7.37855 7.46538 7.35905 7.49124 7.34559C7.5171 7.33213 7.5458 7.32509 7.57493 7.32507H13.7451C13.7742 7.32509 13.8029 7.33213 13.8288 7.34559C13.8546 7.35905 13.8769 7.37855 13.8937 7.40245C13.9105 7.42635 13.9214 7.45395 13.9254 7.48295C13.9294 7.51194 13.9265 7.54148 13.9168 7.56909L10.8317 16.355C10.8191 16.3907 10.7959 16.4216 10.7651 16.4434C10.7344 16.4653 10.6976 16.477 10.66 16.477C10.6224 16.477 10.5856 16.4653 10.5549 16.4434C10.5241 16.4216 10.5009 16.3907 10.4883 16.355H10.4869Z"
      fill="black"
    />
  </svg>
);

// 모드 선택 버튼 타입 정의
type ParaphraseMode =
  | "표준"
  | "학술적"
  | "창의적"
  | "유창성"
  | "실험적"
  | "사용자 지정";

// 모드 선택 버튼 UI 컴포넌트
const ModeSelector = ({
  activeMode,
  setActiveMode,
  customStyle,
  setCustomStyle,
}: {
  activeMode: ParaphraseMode;
  setActiveMode: (mode: ParaphraseMode) => void;
  customStyle: string;
  setCustomStyle: (style: string) => void;
}) => {
  const modes: ParaphraseMode[] = [
    "표준",
    "학술적",
    "창의적",
    "유창성",
    "실험적",
  ];
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const customButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        customButtonRef.current &&
        !customButtonRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModeClick = (mode: ParaphraseMode) => {
    setActiveMode(mode);
    setIsPopoverOpen(false);
  };

  const handleCustomClick = () => {
    setActiveMode("사용자 지정");
    setIsPopoverOpen((prev) => !prev);
  };

  // 버튼 디자인
  const baseButtonClass =
    "h-11 rounded-full text-medium font-medium transition-all flex items-center justify-center shadow-md shadow-neutral-900/20";
  const inactiveClass =
    "bg-purple-100 border border-purple-600/30 hover:bg-purple-200/60";
  const activeClass =
    "bg-purple-200 border border-purple-600/30 ring-1 ring-purple-300";

  return (
    <div className="flex w-full gap-3">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => handleModeClick(mode)}
          className={clsx(
            "flex-1",
            baseButtonClass,
            activeMode === mode ? activeClass : inactiveClass
          )}
        >
          {mode}
        </button>
      ))}
      <div className="relative flex-1">
        <button
          ref={customButtonRef}
          onClick={handleCustomClick}
          className={clsx(
            "w-full",
            baseButtonClass,
            "relative gap-2",
            activeMode === "사용자 지정" ? activeClass : inactiveClass
          )}
        >
          사용자 지정
          {/* <div className="absolute -top-1.5 -right-1.5 w-8 h-8 flex items-center justify-center bg-purple-400 rounded-full text-white shadow-sm shadow-neutral-900/30"> */}
          <Image
            src="/icons/프리미엄2.svg"
            alt=""
            width={45}
            height={45}
            className="absolute top-[-20px] right-[-6px]"
          />
          {/* </div> */}
        </button>
        {isPopoverOpen && (
          <div
            ref={popoverRef}
            className="absolute top-full mt-4 w-80 z-50 p-0.5"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            <div className="relative bg-blue-50 rounded-lg shadow-xl shadow-neutral-900/20 p-3">
              <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-4 h-4 bg-blue-50 border-l-2 border-t-2 rotate-45"></div>
              <p className="text-sm text-gray-600 mb-2">
                원하는 문장 스타일을 입력하세요. (50자 이내)
              </p>
              <textarea
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                maxLength={50}
                className="w-full h-32 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AiParaphraseBox = () => {
  const { open } = useSidebar();
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

  // AI 패러프레이징 기능에 필요한 모든 상태와 로직
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeMode, setActiveMode] = useState<ParaphraseMode>("표준"); // UI에 표시되는 한글 모드
  const [customStyle, setCustomStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // handleApiCall 함수를 이렇게 수정합니다.
  const handleApiCall = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setOutputText("");

    // UI의 한글 모드 이름을 API가 요구하는 영문 이름으로 변환합니다.
    const modeMap: Record<ParaphraseMode, ParaphraseApiMode> = {
      표준: "standard",
      학술적: "academic",
      창의적: "creative",
      유창성: "fluency",
      실험적: "experimental",
      "사용자 지정": "custom",
    };
    const apiMode = modeMap[activeMode];

    // API에 보낼 데이터를 구성합니다.
    const requestData = {
      text: inputText,
      userRequestMode: activeMode === "사용자 지정" ? customStyle : undefined,
    };

    try {
      // 이제 API 파일을 통해 훨씬 깔끔하게 요청을 보냅니다.
      const response = await requestParaphrase(apiMode, requestData);
      setOutputText(response.result); // '.result' 키로 결과값을 사용합니다.
    } catch (error) {
      console.error("API 요청 오류:", error);
      setOutputText("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* 헤더 */}
      <header className="flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-gray-800">AI 문장 변환</h1>
      </header>
      <div className="px-4">
        <ModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          customStyle={customStyle}
          setCustomStyle={setCustomStyle}
        />
      </div>
      {/* 메인 컨텐츠 박스 */}
      <div
        className={clsx(
          "flex flex-1 rounded-lg shadow-md shadow-neutral-900/20 overflow-hidden border bg-white",
          open ? "w-[calc(100vw_-_457px)]" : "w-[calc(100vw_-_243px)]"
        )}
      >
        {/* 입력/출력창 */}
        <div className="w-1/2 border-r p-4 flex flex-col">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="내용을 입력하세요."
            className="flex-1 w-full resize-none outline-none text-base"
            disabled={isLoading}
          ></textarea>
          <div className="flex justify-end items-center mt-4">
            <button
              onClick={handleApiCall}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-semibold"
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? "변환 중..." : "변환하기"}
            </button>
          </div>
        </div>
        <div className="w-1/2 p-4 relative bg-gray-50">
          <div className="w-full h-full whitespace-pre-wrap text-gray-800">
            {isLoading
              ? "결과 생성 중..."
              : outputText || "여기에 변환 결과가 표시됩니다."}
          </div>
          {outputText && (
            <button
              onClick={() => navigator.clipboard.writeText(outputText)}
              className="absolute top-3 right-3 p-2 text-gray-500 hover:bg-gray-200 rounded-full"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiParaphraseBox;
