"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, CreditCard, Users, Zap, Crown, BookOpen, Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ServicePlan, OrderInfo } from "@/types/payment.type";
import TossPaymentWidget from "@/components/payment/TossPaymentWidget";
import { generateOrderId, validateEmail } from "@/lib/utils";
// import { Metadata } from "next";

// 메타데이터 쓰려면 서버 컴포넌트여야 함 ("use client"가 없어야 함)
// export const metadata: Metadata = {
//   title: "결제",
//   robots: { index: false, follow: false },
//   alternates: { canonical: "/pay" },
// };

interface UserInfo {
  memberId: number;
  accessToken: string;
  id: string;
  email: string;
  role: string;
  planId: number;
}

// Phraiz AI 서비스 플랜 데이터
const SERVICE_PLANS: Record<string, ServicePlan> = {
  basic: {
    id: "basic",
    name: "Phraiz Basic",
    description: "대학생, 일반 사용자를 위한 기본 AI 문장 변환",
    monthlyPrice: 4900,
    yearlyPrice: 49000,
    features: ["AI 패러프레이징 (기본/학술적/창의적 모드)", "사용자 커스텀 모드", "AI 요약 (한 줄, 핵심 문장/단락, 질문 기반)", "자동 인용 생성 (모든 형식)", "히스토리 폴더 기능", "무제한 저장", "월 2,900,000 토큰"]
  },
  standard: {
    id: "standard",
    name: "Phraiz Standard",
    description: "대학원생, 파워 유저를 위한 고급 AI 서비스",
    monthlyPrice: 9900,
    yearlyPrice: 99000,
    features: ["모든 Basic 기능 포함", "AI 패러프레이징 (모든 모드)", "고급 AI 요약 기능", "자동 인용 생성 (전체 형식 지원)", "히스토리 폴더 기능", "무제한 저장", "월 6,800,000 토큰", "우선 지원"]
  },
  pro: {
    id: "pro",
    name: "Phraiz Pro",
    description: "연구자, 전문가, 팀을 위한 프리미엄 서비스",
    monthlyPrice: 12900,
    yearlyPrice: 119000,
    features: ["모든 Standard 기능 포함", "무제한 토큰 (공정 사용 정책)", "모든 AI 패러프레이징 모드", "고급 AI 요약 (질문 기반/타겟 요약)", "자동 인용 생성 (모든 형식)", "히스토리 폴더 기능", "무제한 저장", "전담 지원", "팀 협업 기능"]
  }
};

// 플랜별 아이콘
const getPlanIcon = (planId: string) => {
  const icons = {
    basic: <Users className="h-5 w-5" />,
    standard: <Zap className="h-5 w-5" />,
    pro: <Crown className="h-5 w-5" />
  };
  return icons[planId as keyof typeof icons] || <BookOpen className="h-5 w-5" />;
};

// 플랜별 색상
const getPlanColors = (planId: string, isSelected: boolean) => {
  if (isSelected) {
    const selectedColors = {
      basic: "border-blue-500 bg-blue-50",
      standard: "border-purple-500 bg-purple-50",
      pro: "border-yellow-500 bg-yellow-50"
    };
    return selectedColors[planId as keyof typeof selectedColors] || "border-gray-500 bg-gray-50";
  }
  return "border-gray-200 hover:border-gray-300";
};

const getBadgeColor = (planId: string) => {
  const colors = {
    basic: "bg-blue-100 text-blue-800",
    standard: "bg-purple-100 text-purple-800",
    pro: "bg-yellow-100 text-yellow-800"
  };
  return colors[planId as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

function PayPageContent() {
  const searchParams = useSearchParams();

  const initialPlanId = searchParams.get("plan") || "standard";
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const selectedPlan = SERVICE_PLANS[selectedPlanId];

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // 주문 정보 계산
  const orderInfo: OrderInfo = {
    orderId: generateOrderId(),
    customerName,
    customerEmail,
    planId: selectedPlan.id,
    planName: selectedPlan.name,
    billingCycle,
    amount: billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice,
    currency: "KRW"
  };

  useEffect(() => {
    const loadUserInfo = () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const memberId = localStorage.getItem("memberId");
        const userEmail = localStorage.getItem("email");
        const userId = localStorage.getItem("id");
        const role = localStorage.getItem("role");
        const currentPlanId = localStorage.getItem("planId");

        if (accessToken && memberId) {
          setCurrentUser({
            memberId: parseInt(memberId),
            accessToken,
            id: userId || "",
            email: userEmail || "",
            role: role || "ROLE_USER",
            planId: parseInt(currentPlanId || "1")
          });

          if (userEmail) {
            setCustomerEmail(userEmail);
          }
        }
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserInfo();
  }, []);

  const isFormValid = customerName.trim() && customerEmail.trim() && validateEmail(customerEmail);

  // 할인 계산 함수
  const calculateSavings = (plan: ServicePlan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlyTotal = plan.yearlyPrice;
    const savings = monthlyTotal - yearlyTotal;
    const discountPercent = Math.round((savings / monthlyTotal) * 100);
    return { savings, discountPercent };
  };

  if (isLoadingUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">사용자 정보 확인 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Phraiz AI 구독하기</h1>
        <p className="text-gray-600">완벽한 AI 문장변환 서비스를 선택하세요</p>
        {currentUser && (
          <p className="text-sm text-gray-500 mt-2">
            환영합니다, <span className="font-medium">{currentUser.id}</span>님!
          </p>
        )}
      </div>

      {/* 요금제 비교 섹션 */}
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <RadioGroup value={billingCycle} onValueChange={(value: "monthly" | "yearly") => setBillingCycle(value)} className="flex bg-gray-100 p-1 rounded-lg">
            <div className="flex items-center space-x-2 px-4 py-2">
              <RadioGroupItem value="monthly" id="monthly-toggle" />
              <Label htmlFor="monthly-toggle" className="cursor-pointer">
                월간
              </Label>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2">
              <RadioGroupItem value="yearly" id="yearly-toggle" />
              <Label htmlFor="yearly-toggle" className="cursor-pointer flex items-center gap-2">
                연간{" "}
                <Badge variant="destructive" className="text-xs">
                  17% 할인
                </Badge>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.values(SERVICE_PLANS).map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const { discountPercent } = calculateSavings(plan); // savings 제거, discountPercent만 사용
            const isPopular = plan.id === "standard";

            return (
              <Card key={plan.id} className={`relative cursor-pointer transition-all ${getPlanColors(plan.id, isSelected)} ${isSelected ? "ring-2 ring-offset-2 ring-blue-500" : ""}`} onClick={() => setSelectedPlanId(plan.id)}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      인기
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getPlanIcon(plan.id)}
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>

                  <div className="mt-4">
                    {billingCycle === "monthly" ? (
                      <div>
                        <span className="text-3xl font-bold">₩{plan.monthlyPrice.toLocaleString()}</span>
                        <span className="text-gray-500">/월</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-sm text-gray-500 line-through">₩{(plan.monthlyPrice * 12).toLocaleString()}</span>
                          <Badge variant="destructive" className="text-xs">
                            {discountPercent}% 할인
                          </Badge>
                        </div>
                        <div>
                          <span className="text-3xl font-bold">₩{plan.yearlyPrice.toLocaleString()}</span>
                          <span className="text-gray-500">/년</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">월 평균 ₩{Math.round(plan.yearlyPrice / 12).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 5 && <li className="text-sm text-gray-500 ml-6">+{plan.features.length - 5}개 추가 기능</li>}
                  </ul>

                  <Button variant={isSelected ? "default" : "outline"} className="w-full mt-4" onClick={() => setSelectedPlanId(plan.id)}>
                    {isSelected ? "선택됨" : "선택하기"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 고객 정보 입력 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>고객 정보</CardTitle>
              <CardDescription>결제를 위한 정보를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">이름 *</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="홍길동"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setError(null);
                  }}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">이메일 *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="example@email.com"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    setError(null);
                  }}
                  required
                />
                {currentUser && <p className="text-xs text-gray-500 mt-1">로그인된 계정: {currentUser.email}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 결제 섹션 */}
        <div className="space-y-6">
          {/* 주문 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getPlanIcon(selectedPlanId)}
                주문 요약
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{selectedPlan.name}</span>
                  <Badge className={getBadgeColor(selectedPlanId) + " ml-2"}>{selectedPlanId.toUpperCase()}</Badge>
                </div>
              </div>

              <div className="flex justify-between">
                <span>{billingCycle === "monthly" ? "월간 구독" : "연간 구독"}</span>
                <span>₩{orderInfo.amount.toLocaleString()}</span>
              </div>

              {billingCycle === "yearly" && (
                <div className="flex justify-between text-green-600">
                  <span>
                    연간 할인 ({calculateSavings(selectedPlan).discountPercent}
                    %)
                  </span>
                  <span>-₩{calculateSavings(selectedPlan).savings.toLocaleString()}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>총 결제 금액</span>
                <span>₩{orderInfo.amount.toLocaleString()}</span>
              </div>

              {billingCycle === "yearly" && <p className="text-xs text-gray-500 text-center">월 평균 ₩{Math.round(orderInfo.amount / 12).toLocaleString()} • 7일 무료 체험</p>}
            </CardContent>
          </Card>

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 결제 위젯 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                결제 수단
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isFormValid ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>결제를 진행하려면 고객 정보를 모두 올바르게 입력해주세요.</AlertDescription>
                </Alert>
              ) : (
                <TossPaymentWidget
                  amount={orderInfo.amount}
                  orderId={orderInfo.orderId}
                  orderName={`${orderInfo.planName} (${billingCycle === "monthly" ? "월간" : "연간"})`}
                  customerName={customerName}
                  customerEmail={customerEmail}
                  onPaymentRequest={(paymentData) => {
                    console.log("결제 요청 데이터:", paymentData);
                  }}
                  onPaymentFail={(error) => {
                    console.error("결제 실패:", error);
                    setError(`결제 실패: ${error.message}`);
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* 보안 및 정책 */}
          <div className="text-xs text-gray-500 space-y-2">
            <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1">
                <span>🔒</span>
                <span>SSL 보안 결제</span>
              </div>
              <div className="flex items-center gap-1">
                <span>✅</span>
                <span>7일 무료 환불</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🔄</span>
                <span>언제든 해지 가능</span>
              </div>
            </div>
            <p className="text-center">
              결제 진행 시{" "}
              <a href="/terms" className="underline hover:text-gray-700">
                이용약관
              </a>{" "}
              및{" "}
              <a href="/privacy" className="underline hover:text-gray-700">
                개인정보처리방침
              </a>
              에 동의한 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }>
      <PayPageContent />
    </Suspense>
  );
}
