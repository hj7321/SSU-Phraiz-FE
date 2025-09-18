import { useState, useEffect } from "react";
import { usePlanRestriction } from "./usePlanRestriction";

// 플랜별 월 토큰 제한 (Record 타입으로 변경)
const PLAN_TOKEN_LIMITS: Record<number, number> = {
  0: 100000, // Free: 100,000 토큰
  1: 2900000, // Basic: 2,900,000 토큰
  2: 6800000, // Standard: 6,800,000 토큰
  3: -1 // Pro: 무제한 (공정 사용 정책)
};

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
  const { currentPlan } = usePlanRestriction();
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

  // 월별 사용량 리셋 (새 달이 되었을 때)
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
    const limit = PLAN_TOKEN_LIMITS[currentPlan]; // 이제 에러 없음

    if (limit === -1) {
      // Pro 플랜 (무제한)
      alert(`🚀 이번 요청에서 ${tokensUsed.toLocaleString()} 토큰을 사용했습니다.\n이번 달 총 사용량: ${newTotal.toLocaleString()} 토큰\n(Pro 플랜: 무제한 사용 가능)`);
    } else {
      const remaining = Math.max(0, limit - newTotal);
      const percentage = Math.round((newTotal / limit) * 100);

      let message = `🔢 이번 요청에서 ${tokensUsed.toLocaleString()} 토큰을 사용했습니다.\n`;
      message += `📊 이번 달 토큰 사용량: ${newTotal.toLocaleString()} / ${limit.toLocaleString()}\n`;
      message += `⚡ 남은 토큰: ${remaining.toLocaleString()} (${100 - percentage}%)`;

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
