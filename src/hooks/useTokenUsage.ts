import { useState, useEffect } from "react";
import { usePlanRestriction } from "./usePlanRestriction";
import { PRICING_PLAN } from "@/constants/pricingPlan";

// PRICING_PLAN을 기반으로 동적 토큰 제한 생성
const PLAN_TOKEN_LIMITS: Record<number, number> = {};

PRICING_PLAN.forEach((plan, index) => {
  if (plan.monthTokenLimit === "무제한") {
    PLAN_TOKEN_LIMITS[index] = -1; // 무제한
  } else {
    // "100,000" → 100000 변환
    PLAN_TOKEN_LIMITS[index] = parseInt(plan.monthTokenLimit.replace(/,/g, ""), 10);
  }
});

interface TokenUsage {
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
}

interface UseTokenUsageReturn {
  tokenUsage: TokenUsage;
  addTokenUsage: (tokens: number) => void;
  updateTokenUsage: (remainingToken: number) => number;
  resetMonthlyUsage: () => void;
  showTokenAlert: (remainingTokenOrUsed: number, isRemainingToken?: boolean) => void; // 🔥 수정
}

export const useTokenUsage = (): UseTokenUsageReturn => {
  const { currentPlan, planName } = usePlanRestriction();
  const [monthlyTokensUsed, setMonthlyTokensUsed] = useState<number>(0);

  // localStorage에서 월별 토큰 사용량 로드
  useEffect(() => {
    const loadTokenUsage = () => {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const storageKey = `tokenUsage_${currentMonth}`;
        const savedUsage = localStorage.getItem(storageKey);

        if (savedUsage) {
          setMonthlyTokensUsed(parseInt(savedUsage));
        }
      } catch (error) {
        console.error("토큰 사용량 로드 실패:", error);
      }
    };

    loadTokenUsage();
  }, []);

  // 새로 추가: remainingToken 기반 토큰 사용량 업데이트
  const updateTokenUsage = (remainingToken: number): number => {
    const limit = PLAN_TOKEN_LIMITS[currentPlan];

    if (limit === -1) {
      // Pro 플랜 (무제한)의 경우
      return 0; // 사용량을 정확히 알 수 없으므로 0 반환
    }

    // 총 사용한 토큰 = 플랜 제한 - 남은 토큰
    const totalUsedTokens = limit - remainingToken;
    // 이번 요청에서 사용한 토큰 = 새로운 총 사용량 - 이전 사용량
    const tokensUsedThisRequest = totalUsedTokens - monthlyTokensUsed;

    // 상태 및 localStorage 업데이트
    setMonthlyTokensUsed(totalUsedTokens);

    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const storageKey = `tokenUsage_${currentMonth}`;
      localStorage.setItem(storageKey, totalUsedTokens.toString());
    } catch (error) {
      console.error("토큰 사용량 저장 실패:", error);
    }

    return Math.max(0, tokensUsedThisRequest);
  };

  // 토큰 사용량 추가 (호환성)
  const addTokenUsage = (tokens: number) => {
    const newUsage = monthlyTokensUsed + tokens;
    setMonthlyTokensUsed(newUsage);

    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const storageKey = `tokenUsage_${currentMonth}`;
      localStorage.setItem(storageKey, newUsage.toString());
    } catch (error) {
      console.error("토큰 사용량 저장 실패:", error);
    }
  };

  // 월별 사용량 리셋
  const resetMonthlyUsage = () => {
    setMonthlyTokensUsed(0);
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const storageKey = `tokenUsage_${currentMonth}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("토큰 사용량 리셋 실패:", error);
    }
  };

  // remainingToken과 tokensUsed 모두 지원
  const showTokenAlert = (remainingTokenOrUsed: number, isRemainingToken: boolean = false) => {
    const limit = PLAN_TOKEN_LIMITS[currentPlan];

    if (limit === -1) {
      // Pro 플랜 (무제한)
      const tokensUsed = isRemainingToken ? updateTokenUsage(remainingTokenOrUsed) : remainingTokenOrUsed;
      alert(`🚀 이번 요청에서 ${tokensUsed > 0 ? tokensUsed.toLocaleString() + " " : ""}토큰을 사용했습니다.\n💎 현재 플랜: ${planName} (무제한 사용 가능)`);
    } else {
      let totalUsedTokens, remainingTokens, tokensUsed;

      if (isRemainingToken) {
        // remainingToken이 주어진 경우
        remainingTokens = remainingTokenOrUsed;
        totalUsedTokens = limit - remainingTokens;
        tokensUsed = totalUsedTokens - monthlyTokensUsed;
      } else {
        // tokensUsed가 주어진 경우
        tokensUsed = remainingTokenOrUsed;
        totalUsedTokens = monthlyTokensUsed + tokensUsed;
        remainingTokens = limit - totalUsedTokens;
      }

      const percentage = Math.round((totalUsedTokens / limit) * 100);

      let message = `🔢 이번 요청에서 ${tokensUsed.toLocaleString()} 토큰을 사용했습니다.\n`;
      message += `📊 이번 달 토큰 사용량: ${totalUsedTokens.toLocaleString()} / ${limit.toLocaleString()}\n`;
      message += `⚡ 남은 토큰: ${Math.max(0, remainingTokens).toLocaleString()} (${Math.max(0, 100 - percentage)}%)\n`;
      message += `💎 현재 플랜: ${planName}`;

      if (percentage >= 90) {
        message += `\n⚠️ 토큰 사용량이 90%를 초과했습니다!`;
      } else if (percentage >= 80) {
        message += `\n💡 토큰 사용량이 80%를 넘었습니다.`;
      }

      alert(message);
    }
  };

  // 현재 토큰 사용 상태 계산
  const limit = PLAN_TOKEN_LIMITS[currentPlan];
  const tokenUsage: TokenUsage = {
    used: monthlyTokensUsed,
    limit: limit === -1 ? Infinity : limit,
    remaining: limit === -1 ? Infinity : Math.max(0, limit - monthlyTokensUsed),
    percentage: limit === -1 ? 0 : Math.round((monthlyTokensUsed / limit) * 100)
  };

  return {
    tokenUsage,
    addTokenUsage,
    updateTokenUsage,
    resetMonthlyUsage,
    showTokenAlert
  };
};
