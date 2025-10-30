"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Metadata } from "next";

// 메타데이터 쓰려면 서버 컴포넌트여야 함 ("use client"가 없어야 함)
// export const metadata: Metadata = {
//   title: "결제 실패",
//   robots: { index: false, follow: false },
//   alternates: { canonical: "/fail" },
// };

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "PAY_PROCESS_CANCELED":
        return "사용자가 결제를 취소했습니다.";
      case "PAY_PROCESS_ABORTED":
        return "결제 진행 중 오류가 발생했습니다.";
      case "REJECT_CARD_COMPANY":
        return "카드사에서 결제를 거절했습니다.";
      case "INVALID_CARD_COMPANY":
        return "유효하지 않은 카드입니다.";
      case "NOT_SUPPORTED_INSTALLMENT":
        return "지원하지 않는 할부 개월수입니다.";
      case "EXCEED_MAX_DAILY_PAYMENT_COUNT":
        return "일일 결제 한도를 초과했습니다.";
      case "NOT_AVAILABLE_BANK":
        return "은행 서비스 시간이 아닙니다.";
      case "EXCEED_MAX_ONE_DAY_WITHDRAW_AMOUNT":
        return "일일 출금 한도를 초과했습니다.";
      case "EXCEED_MAX_ONE_TIME_WITHDRAW_AMOUNT":
        return "1회 출금 한도를 초과했습니다.";
      default:
        return message || "알 수 없는 오류가 발생했습니다.";
    }
  };

  const handleRetry = () => {
    // 이전 페이지로 돌아가거나 결제 페이지로 리다이렉트
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          결제에 실패했습니다
        </h1>
        <p className="text-gray-600">결제 처리 중 문제가 발생했습니다.</p>
      </div>

      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>오류 내용:</strong> {getErrorMessage(code)}
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>오류 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {orderId && (
            <div>
              <p className="text-sm text-gray-600">주문번호</p>
              <p className="font-medium">{orderId}</p>
            </div>
          )}
          {code && (
            <div>
              <p className="text-sm text-gray-600">오류 코드</p>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                {code}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">발생 시간</p>
            <p className="font-medium">{new Date().toLocaleString("ko-KR")}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleRetry} className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도하기
          </Button>
          <Button variant="outline" onClick={handleGoHome} className="flex-1">
            <Home className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Button>
        </div>
      </div>

      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">
            결제가 안 될 때 확인사항
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <p>• 카드 한도 및 잔액을 확인해주세요</p>
          <p>• 카드 정보(번호, 유효기간, CVC)가 정확한지 확인해주세요</p>
          <p>• 해외결제 차단 설정을 확인해주세요</p>
          <p>• 다른 결제 수단으로 시도해보세요</p>
          <p>• 문제가 지속되면 고객센터로 문의해주세요</p>
        </CardContent>
      </Card>

      <div className="text-center mt-6 text-sm text-gray-500">
        <p>결제 관련 문의사항이 있으시면 고객센터로 연락해주세요.</p>
        <p>이메일: support@phraiz.com | 전화: 1588-1234</p>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
