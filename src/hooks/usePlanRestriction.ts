import { useAuthStore } from "@/stores/auth.store";
import { PRICING_PLAN } from "@/constants/pricingPlan";

// PRICING_PLAN 배열을 기반으로 동적 매핑 생성
const PLAN_NAME_TO_ID: Record<string, number> = {};
const PLAN_NAMES: Record<number, string> = {};

PRICING_PLAN.forEach((plan, index) => {
  PLAN_NAME_TO_ID[plan.name] = index;
  PLAN_NAMES[index] = plan.name;
});

// 기능별 요구 플랜 (숫자 ID 기준)
const FEATURE_REQUIREMENTS = {
  paraphrasing: {
    basic: 0,
    academic: 0,
    creative: 0,
    fluency: 0,
    experimental: 0,
    custom: 1 // Basic 이상
  },
  summarize: {
    oneLine: 0,
    full: 0,
    byParagraph: 0,
    keyPoints: 0,
    questionBased: 1, // Basic 이상
    targeted: 1 // Basic 이상
  }
} as const;

export const usePlanRestriction = () => {
  const planTier = useAuthStore((s) => s.planTier);

  const currentPlan = planTier && PLAN_NAME_TO_ID[planTier] !== undefined ? PLAN_NAME_TO_ID[planTier] : 0; // 기본값 Free (0)

  const canUseFeature = (category: keyof typeof FEATURE_REQUIREMENTS, feature: string): boolean => {
    const requirements = FEATURE_REQUIREMENTS[category] as Record<string, number>;
    const requiredPlan = requirements[feature];

    if (requiredPlan === undefined) return true;
    return currentPlan >= requiredPlan;
  };

  const getRequiredPlan = (category: keyof typeof FEATURE_REQUIREMENTS, feature: string): number => {
    const requirements = FEATURE_REQUIREMENTS[category] as Record<string, number>;
    return requirements[feature] ?? 0;
  };

  const getRequiredPlanName = (category: keyof typeof FEATURE_REQUIREMENTS, feature: string): string => {
    const requiredPlan = getRequiredPlan(category, feature);
    return PLAN_NAMES[requiredPlan] || "Free";
  };

  return {
    currentPlan,
    planName: PLAN_NAMES[currentPlan] || "Free",
    planTier: planTier || "Free",
    canUseFeature,
    getRequiredPlan,
    getRequiredPlanName
  };
};
