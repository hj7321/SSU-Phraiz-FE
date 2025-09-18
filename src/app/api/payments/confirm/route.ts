import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 토스페이먼츠 API로 결제 승인 요청
    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
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
      return NextResponse.json({ error: paymentData.message || "결제 승인에 실패했습니다." }, { status: response.status });
    }

    // 여기서 데이터베이스에 결제 정보를 저장하거나 다른 비즈니스 로직을 처리할 수 있습니다.
    console.log("Payment confirmed:", paymentData);

    return NextResponse.json(paymentData);
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
