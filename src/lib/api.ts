// 결제 관련 API 함수들
export const updateUserPlan = async (memberId: number, planId: number, accessToken: string) => {
  try {
    const response = await fetch(`/api/members/${memberId}/plan`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ planId })
    });

    if (response.ok) {
      console.log("요금제 업데이트 성공");
      return { success: true };
    } else {
      const errorData = await response.json();
      console.error("요금제 업데이트 실패:", errorData);
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error("요금제 업데이트 중 네트워크 오류:", error);
    return { success: false, error: "네트워크 오류가 발생했습니다." };
  }
};

// 토큰 재발급 함수 (필요시)
export const reissueAccessToken = async () => {
  try {
    const response = await fetch("/api/members/reissue", {
      method: "POST",
      credentials: "include" // refreshToken 쿠키 포함
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: false, error: "토큰 재발급 실패" };
    }
  } catch (error) {
    console.error("토큰 재발급 중 오류:", error);
    return { success: false, error: "네트워크 오류" };
  }
};
