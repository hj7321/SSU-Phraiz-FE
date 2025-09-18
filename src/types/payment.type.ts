// PaymentRequestData 타입
export interface PaymentRequestData {
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  customerEmail: string;
  customerName: string;
}

export interface PaymentResult {
  orderId: string;
  paymentKey?: string;
  amount: number;
  status: "SUCCESS" | "FAILED" | "CANCELED";
}

export interface PaymentError {
  code: string;
  message: string;
  orderId?: string;
}

export interface ServicePlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

export interface OrderInfo {
  orderId: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  planName: string;
  billingCycle: "monthly" | "yearly";
  amount: number;
  currency: string;
}

export interface BillingOption {
  cycle: "monthly" | "yearly";
  label: string;
  discount?: number;
}

export interface TossPaymentResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  method: string;
  requestedAt: string;
  approvedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaymentVerificationRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export const PLAN_ID_MAPPING = {
  basic: 1, // Basic 플랜 = planId 1
  standard: 2, // Standard 플랜 = planId 2
  pro: 3 // Pro 플랜 = planId 3
} as const;

export type PlanType = keyof typeof PLAN_ID_MAPPING;

// 토스페이먼츠 타입 정의
export interface TossPayments {
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
