"use client";

import { useState } from "react";
import type { PaymentRequestData, PaymentError } from "@/types/payment.type";

interface TossPaymentWidgetProps {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  onPaymentRequest?: (paymentData: PaymentRequestData) => void;
  onPaymentFail?: (error: PaymentError) => void;
}

// 토스페이먼츠 타입 정의
interface TossPayments {
  requestPayment(
    method: "카드" | "토스페이",
    options: {
      amount: number;
      orderId: string;
      orderName: string;
      successUrl: string;
      failUrl: string;
      customerEmail?: string;
      customerName?: string;
    }
  ): Promise<void>;
}

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

const TossPaymentWidget = ({ amount, orderId, orderName, customerName = "anonymous", customerEmail = "test@example.com", onPaymentRequest, onPaymentFail }: TossPaymentWidgetProps) => {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePayment = async (paymentMethod: "카드" | "토스페이") => {
    if (isPaymentProcessing) return;

    try {
      setIsPaymentProcessing(true);
      setPaymentError(null);

      const paymentData: PaymentRequestData = {
        orderId: orderId,
        orderName: orderName,
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/payment/success`,
        failUrl: `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/payment/fail`,
        customerEmail: customerEmail,
        customerName: customerName
      };

      console.log(`${paymentMethod} 결제 요청 시작:`, paymentData);

      // any 제거: 타입 단언으로 해결
      const { loadTossPayments } = await import("@tosspayments/payment-sdk");
      const tossPayments = (await loadTossPayments(CLIENT_KEY)) as TossPayments;

      console.log("토스페이먼츠 로드 성공:", tossPayments);

      // 결제 요청
      await tossPayments.requestPayment(paymentMethod, {
        amount: amount,
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        successUrl: paymentData.successUrl,
        failUrl: paymentData.failUrl,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName
      });

      onPaymentRequest?.(paymentData);
    } catch (error: unknown) {
      console.error(`${paymentMethod} 결제 요청 실패:`, error);
      const errorMessage = error instanceof Error ? error.message : `${paymentMethod} 결제 요청 중 오류가 발생했습니다.`;
      setPaymentError(errorMessage);

      onPaymentFail?.({
        code: "PAYMENT_REQUEST_ERROR",
        message: errorMessage,
        orderId: orderId
      });
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  if (paymentError) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg border shadow-sm p-6">
        <div className="text-center text-red-600">
          <h4 className="font-medium mb-2">결제 오류</h4>
          <p className="text-sm mb-4">{paymentError}</p>
          <button onClick={() => setPaymentError(null)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg border shadow-sm p-6">
      {/* 주문 정보 */}
      <div className="mb-6 pb-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">주문 정보</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">상품명</span>
            <span className="font-medium">{orderName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">주문번호</span>
            <span className="text-sm text-gray-500">{orderId}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>결제금액</span>
            <span className="text-blue-600">₩{amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 결제 수단 선택 - 신용/체크카드, 토스페이 두 개만 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">결제 수단 선택</h4>
        <div className="space-y-3">
          {/* 신용/체크카드 */}
          <button onClick={() => handlePayment("카드")} disabled={isPaymentProcessing} className="w-full p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">💳</div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">신용/체크카드</div>
                  <div className="text-sm text-gray-500">Visa, MasterCard, 국내 모든 카드</div>
                </div>
              </div>
              <div className="text-lg text-gray-400">→</div>
            </div>
          </button>

          {/* 토스페이 간편결제 */}
          <button onClick={() => handlePayment("토스페이")} disabled={isPaymentProcessing} className="w-full p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">토스페이</div>
                  <div className="text-sm text-gray-500">간편하고 안전한 토스 결제</div>
                </div>
              </div>
              <div className="text-lg text-gray-400">→</div>
            </div>
          </button>
        </div>
      </div>

      {/* 처리 중 상태 */}
      {isPaymentProcessing && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800 font-medium">결제창으로 이동하고 있습니다...</span>
          </div>
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="text-xs text-gray-500 space-y-1 text-center">
        <p>⚠️ 현재 테스트 환경입니다. 실제 결제가 진행되지 않습니다.</p>
        <p>결제 수단을 선택하면 토스페이먼츠 결제창으로 이동합니다.</p>
      </div>
    </div>
  );
};

export default TossPaymentWidget;
