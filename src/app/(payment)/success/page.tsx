"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { TossPaymentResponse, PlanType } from "@/types/payment.type";
import { PLAN_ID_MAPPING } from "@/types/payment.type";
import { updateUserPlan } from "@/lib/api"; // 추가된 import

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [paymentData, setPaymentData] = useState<TossPaymentResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planUpdateStatus, setPlanUpdateStatus] = useState<"pending" | "success" | "failed">("pending");

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const plan = searchParams.get("plan") as PlanType; // 추가
  const cycle = searchParams.get("cycle"); // 추가

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentKey || !orderId || !amount) {
        setError("결제 정보가 올바르지 않습니다.");
        setIsVerifying(false);
        return;
      }

      try {
        // 1. 결제 검증
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount)
          })
        });

        const result = await response.json();

        if (response.ok) {
          setPaymentData(result.data);

          // 2. 결제 성공 시 요금제 업데이트
          if (plan && PLAN_ID_MAPPING[plan]) {
            // 사용자 정보 가져오기 (실제 구현에 따라 수정 필요)
            const accessToken = localStorage.getItem("accessToken");
            const memberId = localStorage.getItem("memberId");

            if (accessToken && memberId) {
              const planId = PLAN_ID_MAPPING[plan];
              const updateResult = await updateUserPlan(parseInt(memberId), planId, accessToken);

              if (updateResult.success) {
                setPlanUpdateStatus("success");
                console.log("요금제 업데이트 완료");

                // 로컬 스토리지의 사용자 정보 업데이트 (옵션)
                const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
                userInfo.planId = planId;
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
              } else {
                setPlanUpdateStatus("failed");
                console.error("요금제 업데이트 실패:", updateResult.error);
              }
            } else {
              setPlanUpdateStatus("failed");
              console.error("사용자 인증 정보를 찾을 수 없습니다.");
            }
          }
        } else {
          setError(result.message || "결제 검증에 실패했습니다.");
        }
      } catch (error) {
        console.error("결제 검증 중 오류:", error);
        setError("결제 검증 중 오류가 발생했습니다.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [paymentKey, orderId, amount, plan]);

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">결제 검증 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "결제 정보를 불러올 수 없습니다."}</AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button onClick={() => router.push("/")} variant="outline">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
        <p className="text-gray-600">{plan && `${plan.toUpperCase()} 플랜으로 업그레이드되었습니다.`}</p>
      </div>

      {/* 요금제 업데이트 상태 표시 */}
      {planUpdateStatus === "failed" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>결제는 성공했으나 요금제 적용에 문제가 발생했습니다. 고객센터로 문의해주세요.</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>결제 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">주문번호</p>
              <p className="font-medium">{paymentData.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">결제 방법</p>
              <p className="font-medium">{paymentData.method}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">결제 금액</p>
              <p className="font-medium text-lg">₩{paymentData.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">결제 시간</p>
              <p className="font-medium">{new Date(paymentData.approvedAt).toLocaleString("ko-KR")}</p>
            </div>
          </div>

          {/* 플랜 정보 표시 */}
          {plan && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">선택한 플랜</p>
                  <p className="font-medium">{plan.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">결제 주기</p>
                  <p className="font-medium">{cycle === "yearly" ? "연간" : "월간"}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => router.push("/")} className="flex-1">
          <Home className="mr-2 h-4 w-4" />
          서비스 이용하기
        </Button>
        <Button variant="outline" onClick={() => router.push(`/receipt/${paymentData.orderId}`)} className="flex-1">
          <FileText className="mr-2 h-4 w-4" />
          영수증 보기
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
