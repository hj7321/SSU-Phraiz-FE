export type PricingPlan = {
  name: string;
  price: number;
  features: string[];
};

export const PRICING_PLAN: PricingPlan[] = [
  {
    name: "Free",
    price: 0,
    features: [
      "별도 로그인 없이 바로 사용 가능",
      "기본 기능 모두 제공",
      "광고 포함, 기능별 1일 3회까지 무제한",
      "초과 시 500자 제한",
    ],
  },
  {
    name: "Basic",
    price: 5900,
    features: [
      "GPT-4 Turbo 적용으로 더 자연스러운 결과",
      "광고 없음",
      "자료 정리를 위한 히스토리 폴더 제공",
      "월 10만 자, 하루 5,000자 제한",
    ],
  },
  {
    name: "Standard",
    price: 7900,
    features: [
      "패러프레이징 커스텀 모드 제공",
      "요약 기능 고도화: 타겟 요약 제공",
      "더 많은 사용량 제공 (월 30만 자, 하루 10,000자 제한)",
    ],
  },
  {
    name: "Pro",
    price: 9900,
    features: [
      "모든 기능 완전 무제한",
      "표절 탐지 및 신뢰도 분석 기능 (추후 제공 예정)",
      "콘텐츠 제작자, 연구자, 전문가에게 적합",
    ],
  },
];
