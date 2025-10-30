"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
// import { Metadata } from "next";

const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY!;
const customerKey = nanoid(); // 고객 고유키

// 메타데이터 쓰려면 서버 컴포넌트여야 함 ("use client"가 없어야 함)
// export const metadata: Metadata = {
//   title: "결제",
//   robots: { index: false, follow: false },
// };

export default function PaymentPage() {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);
  const amount = 50000; // 결제 금액
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        paymentWidgetRef.current = paymentWidget;

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-widget",
          { value: amount },
          { variantKey: "DEFAULT" }
        );

        paymentWidget.renderAgreement("#agreement");

        paymentMethodsWidgetRef.current = paymentMethodsWidget;
        setReady(true);
      } catch (error) {
        console.error("Payment widget load failed:", error);
      }
    })();
  }, []);

  const handlePayment = async () => {
    const paymentWidget = paymentWidgetRef.current;

    if (!paymentWidget) {
      console.error("Payment widget is not loaded");
      return;
    }

    try {
      await paymentWidget.requestPayment({
        orderId: nanoid(),
        orderName: "AI 패러프레이징 서비스",
        customerName: "고객명",
        customerEmail: "customer@example.com",
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error("Payment request failed:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">결제하기</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">주문 정보</h2>
        <div className="flex justify-between items-center">
          <span>AI 패러프레이징 서비스</span>
          <span className="font-semibold">{amount.toLocaleString()}원</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div id="payment-widget" className="mb-6" />
        <div id="agreement" className="mb-6" />

        <button
          onClick={handlePayment}
          disabled={!ready}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {ready ? "결제하기" : "로딩중..."}
        </button>
      </div>
    </div>
  );
}
