import { NextRequest, NextResponse } from "next/server";
import type { PaymentVerificationRequest, TossPaymentResponse } from "@/types/payment.type";

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!;
const TOSS_PAYMENTS_BASE_URL = "https://api.tosspayments.com/v1/payments";

export async function POST(request: NextRequest) {
  try {
    const body: PaymentVerificationRequest = await request.json();
    const { paymentKey, orderId, amount } = body;

    // 토스페이먼츠 API로 결제 승인 요청
    const response = await fetch(`${TOSS_PAYMENTS_BASE_URL}/confirm`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    });

    const paymentData = await response.json();

    if (!response.ok) {
      console.error("토스페이먼츠 API 오류:", paymentData);
      return NextResponse.json(
        {
          success: false,
          message: paymentData.message || "결제 승인에 실패했습니다.",
          error: paymentData
        },
        { status: 400 }
      );
    }

    // 결제 성공시 데이터베이스 업데이트 (실제 구현시 추가)
    // await savePaymentToDatabase(paymentData);

    const responseData: TossPaymentResponse = {
      paymentKey: paymentData.paymentKey,
      orderId: paymentData.orderId,
      status: paymentData.status,
      totalAmount: paymentData.totalAmount,
      method: paymentData.method,
      requestedAt: paymentData.requestedAt,
      approvedAt: paymentData.approvedAt,
      customer: paymentData.customer
    };

    return NextResponse.json({
      success: true,
      message: "결제가 성공적으로 승인되었습니다.",
      data: responseData
    });
  } catch (error) {
    console.error("결제 검증 중 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "결제 검증 중 서버 오류가 발생했습니다."
      },
      { status: 500 }
    );
  }
}
