export type PricingPlan = {
  name: string;
  monthPrice?: string;
  yearPrice?: string;
  monthTokenLimit: string;
  features: Record<string, string>;
};

export const PRICING_PLAN: PricingPlan[] = [
  {
    name: "Free",
    monthTokenLimit: "100,000",
    features: {
      "AI 문장 변환": "표준·학술적·창의적·유창성·실험적<br />모드",
      "AI 요약": "한줄·전체·문단별·핵심 요약",
      "인용 생성": "각 기능별 30개 제한 저장",
    },
  },
  {
    name: "Basic",
    monthPrice: "4,900",
    yearPrice: "49,000",
    monthTokenLimit: "2,900,000",
    features: {
      "AI 문장 변환":
        "표준·학술적·창의적·유창성·실험적·<br /><b class='font-nanum-extrabold bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent'>사용자(Custom)</b> 모드",
      "AI 요약":
        "한줄·전체·문단별·핵심·<b class='font-nanum-extrabold bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent'>질문 기반·<br />타겟</b> 요약",
      "인용 생성":
        "<b class='font-nanum-extrabold bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent'>무제한 저장, 폴더 생성</b>",
    },
  },
  {
    name: "Standard",
    monthPrice: "9,900",
    yearPrice: "99,000",
    monthTokenLimit: "6,800,000",
    features: {
      "AI 문장 변환":
        "표준·학술적·창의적·유창성·실험적·<br /><b class='font-nanum-extrabold bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent'>사용자(Custom)</b> 모드",
      "AI 요약":
        "한줄·전체·문단별·핵심·<b class='font-nanum-extrabold bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent'>질문 기반·<br />타겟</b> 요약",
      "인용 생성":
        "<b class='font-nanum-extrabold bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent'>무제한 저장, 폴더 생성</b>",
    },
  },
  {
    name: "Pro",
    monthPrice: "12,900",
    yearPrice: "119,000",
    monthTokenLimit: "무제한",
    features: {
      "AI 문장 변환":
        "표준·학술적·창의적·유창성·실험적·<br /><b class='font-nanum-extrabold bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent'>사용자(Custom)</b> 모드",
      "AI 요약":
        "한줄·전체·문단별·핵심·<b class='font-nanum-extrabold bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent'>질문 기반·<br />타겟</b> 요약",
      "인용 생성":
        "<b class='font-nanum-extrabold bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent'>무제한 저장, 폴더 생성</b>",
    },
  },
];
