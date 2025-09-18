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
  resetMonthlyUsage: () => void;
  showTokenAlert: (tokensUsed: number) => void;
}

export const useTokenUsage = (): UseTokenUsageReturn => {
  const { currentPlan, planName } = usePlanRestriction(); // 숫자 ID와 이름 가져오기
  const [monthlyTokensUsed, setMonthlyTokensUsed] = useState<number>(0);

  // localStorage에서 월별 토큰 사용량 로드
  useEffect(() => {
    const loadTokenUsage = () => {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM 형태
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

  // 토큰 사용량 추가
  const addTokenUsage = (tokens: number) => {
    const newUsage = monthlyTokensUsed + tokens;
    setMonthlyTokensUsed(newUsage);

    // localStorage에 저장
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

  // 토큰 사용량 alert 표시
  const showTokenAlert = (tokensUsed: number) => {
    const newTotal = monthlyTokensUsed + tokensUsed;
    const limit = PLAN_TOKEN_LIMITS[currentPlan];

    if (limit === -1) {
      // Pro 플랜 (무제한)
      alert(`🚀 이번 요청에서 ${tokensUsed.toLocaleString()} 토큰을 사용했습니다.\n이번 달 총 사용량: ${newTotal.toLocaleString()} 토큰\n💎 현재 플랜: ${planName} (무제한 사용 가능)`);
    } else {
      const remaining = Math.max(0, limit - newTotal);
      const percentage = Math.round((newTotal / limit) * 100);

      let message = `🔢 이번 요청에서 ${tokensUsed.toLocaleString()} 토큰을 사용했습니다.\n`;
      message += `📊 이번 달 토큰 사용량: ${newTotal.toLocaleString()} / ${limit.toLocaleString()}\n`;
      message += `⚡ 남은 토큰: ${remaining.toLocaleString()} (${100 - percentage}%)\n`;
      message += `💎 현재 플랜: ${planName}`;

      // 사용량에 따른 경고 메시지
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
    resetMonthlyUsage,
    showTokenAlert
  };
};
