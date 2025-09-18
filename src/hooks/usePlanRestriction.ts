import { useState, useEffect } from "react";

// 요금제별 기능 접근 권한 정의
interface PlanFeatures {
  paraphrasing: {
    basic: boolean;
    academic: boolean;
    creative: boolean;
    fluency: boolean;
    experimental: boolean;
    custom: boolean;
  };
  summarize: {
    oneLine: boolean;
    full: boolean;
    byParagraph: boolean;
    keyPoints: boolean;
    questionBased: boolean;
    targeted: boolean;
  };
}

const PLAN_FEATURES: Record<number, PlanFeatures> = {
  0: {
    // Free
    paraphrasing: {
      basic: true,
      academic: true,
      creative: true,
      fluency: false,
      experimental: false,
      custom: false
    },
    summarize: {
      oneLine: true,
      full: true,
      byParagraph: false,
      keyPoints: false,
      questionBased: false,
      targeted: false
    }
  },
  1: {
    // Basic
    paraphrasing: {
      basic: true,
      academic: true,
      creative: true,
      fluency: true,
      experimental: false,
      custom: true
    },
    summarize: {
      oneLine: true,
      full: true,
      byParagraph: true,
      keyPoints: true,
      questionBased: true,
      targeted: true
    }
  },
  2: {
    // Standard
    paraphrasing: {
      basic: true,
      academic: true,
      creative: true,
      fluency: true,
      experimental: true,
      custom: true
    },
    summarize: {
      oneLine: true,
      full: true,
      byParagraph: true,
      keyPoints: true,
      questionBased: true,
      targeted: true
    }
  },
  3: {
    // Pro
    paraphrasing: {
      basic: true,
      academic: true,
      creative: true,
      fluency: true,
      experimental: true,
      custom: true
    },
    summarize: {
      oneLine: true,
      full: true,
      byParagraph: true,
      keyPoints: true,
      questionBased: true,
      targeted: true
    }
  }
};

const PLAN_NAMES: Record<number, string> = {
  0: "Free",
  1: "Basic",
  2: "Standard",
  3: "Pro"
};

// 기능별 최소 요구 요금제 정의 (any 제거)
interface FeatureRequirements {
  paraphrasing: Record<string, number>;
  summarize: Record<string, number>;
}

const FEATURE_REQUIREMENTS: FeatureRequirements = {
  paraphrasing: {
    custom: 1, // Basic 이상
    fluency: 1, // Basic 이상
    experimental: 2 // Standard 이상
  },
  summarize: {
    byParagraph: 1, // Basic 이상
    keyPoints: 1, // Basic 이상
    questionBased: 1, // Basic 이상
    targeted: 1 // Basic 이상
  }
};

interface UsePlanRestrictionReturn {
  currentPlan: number;
  planName: string;
  canUseFeature: (category: "paraphrasing" | "summarize", feature: string) => boolean;
  getRequiredPlan: (category: "paraphrasing" | "summarize", feature: string) => number;
  getRequiredPlanName: (category: "paraphrasing" | "summarize", feature: string) => string;
  isLoading: boolean;
}

export const usePlanRestriction = (): UsePlanRestrictionReturn => {
  const [currentPlan, setCurrentPlan] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserPlan = () => {
      try {
        const planId = localStorage.getItem("planId");
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken && planId) {
          setCurrentPlan(parseInt(planId));
        } else {
          setCurrentPlan(0); // Free 플랜
        }
      } catch (error) {
        console.error("사용자 플랜 정보 로드 실패:", error);
        setCurrentPlan(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPlan();
  }, []);

  const canUseFeature = (category: "paraphrasing" | "summarize", feature: string): boolean => {
    const planFeatures = PLAN_FEATURES[currentPlan];
    if (!planFeatures) return false;

    const categoryFeatures = planFeatures[category];
    return categoryFeatures[feature as keyof typeof categoryFeatures] === true;
  };

  const getRequiredPlan = (category: "paraphrasing" | "summarize", feature: string): number => {
    const requirements = FEATURE_REQUIREMENTS[category];
    return requirements[feature] || 0;
  };

  const getRequiredPlanName = (category: "paraphrasing" | "summarize", feature: string): string => {
    const requiredPlan = getRequiredPlan(category, feature);
    return PLAN_NAMES[requiredPlan] || "Free";
  };

  return {
    currentPlan,
    planName: PLAN_NAMES[currentPlan] || "Free",
    canUseFeature,
    getRequiredPlan,
    getRequiredPlanName,
    isLoading
  };
};
