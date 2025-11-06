"use client";

import { PRICING_PLAN } from "@/constants/pricingPlan";
import { useAuthStore } from "@/stores/auth.store";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BETA_FREE_UPGRADE = true; // 베타 이벤트 ON/OFF

const PricingPlan = () => {
  const isLogin = useAuthStore((s) => s.isLogin);
  const planTier = useAuthStore((s) => s.planTier);
  const pathname = usePathname();

  return (
    <section
      className={clsx(
        "min-h-screen w-full flex flex-col gap-12 justify-center items-center py-20 px-4",
        pathname === "/"
          ? "bg-gradient-to-b from-main/60 to-main/20"
          : "pb-[120px] bg-gradient-to-b from-main to-main/20"
      )}
    >
      <div className="text-center space-y-3">
        <h1 className="text-[22px] xs:text-[30px] sm:text-[35px] md:text-[40px] lg:text-[50px] font-nanum-extrabold [filter:drop-shadow(4px_4px_10px_rgba(0,0,0,0.2))] bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent mb-[-10px]">
          {pathname === "/" ? "Pricing Plan" : "플랜 업그레이드"}
        </h1>
        <p className="text-muted-foreground text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px]">
          나에게 맞는 플랜을 선택하세요
        </p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
        {PRICING_PLAN.map((plan) => {
          const isFreePlan = plan.name === "Free";
          const isBetaFreeApplied = BETA_FREE_UPGRADE && !isFreePlan;

          return (
            <div
              key={plan.name}
              className={clsx(
                "group relative flex flex-col rounded-2xl bg-white border border-gray-200/60 overflow-hidden transition-all duration-300",
                "hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 hover:border-violet-300"
              )}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

              {/* 우측 상단 플랜 아이콘 */}
              <div className="absolute -right-2 -top-2 opacity-90 group-hover:opacity-100 transition-opacity">
                <Image
                  src={plan.icon || "/placeholder.svg"}
                  alt=""
                  width={80}
                  height={80}
                  className="drop-shadow-lg"
                />
              </div>

              <div className="flex flex-col h-full p-6 pt-8">
                {/* Header */}
                <div className="mb-6 space-y-2">
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    {plan.name}
                  </h2>
                  {!isFreePlan && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      베타 테스트 이벤트
                    </span>
                  )}
                  {/* 가격 영역 */}
                  {isFreePlan ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        0
                      </span>
                      <span className="text-lg text-gray-600">원</span>
                    </div>
                  ) : isBetaFreeApplied ? (
                    <div className="space-y-1">
                      {/* 월: ~원~ 바로 오른쪽에 0원 */}
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm text-gray-600">월</span>
                        <span className="text-2xl font-extrabold line-through decoration-red-500 decoration-2 text-gray-900 whitespace-nowrap">
                          {plan.monthPrice}원
                        </span>
                        <span className="text-[30px] font-extrabold text-red-500 whitespace-nowrap">
                          0원
                        </span>
                      </div>
                      {/* 연 가격은 하단에 취소선 */}
                      <div className="text-sm text-gray-400 line-through decoration-red-500 decoration-2">
                        연 {plan.yearPrice}원
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-600">월</span>
                        <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                          {plan.monthPrice}
                        </span>
                        <span className="text-lg text-gray-600">원</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>연 {plan.yearPrice}원</span>
                      </div>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200">
                    <span className="text-xs font-medium text-violet-700">
                      월 토큰:{" "}
                      <span className="font-bold">{plan.monthTokenLimit}</span>{" "}
                      {plan.name !== "Pro" && "토큰"}
                    </span>
                  </div>
                </div>

                {/* 기능 목록 */}
                <div className="flex-1 space-y-4 mb-6">
                  {Object.entries(plan.features).map(([key, value]) => (
                    <div key={value} className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Image
                          src="/icons/check_black.svg"
                          alt="check"
                          width={12}
                          height={12}
                          className="brightness-0 invert"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-bold text-gray-900 mb-0.5">{key}</p>
                        <p
                          className="text-gray-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: `${value}` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={isLogin ? "/payment/pay" : "/login"}
                  className={clsx(
                    "relative overflow-hidden text-center rounded-xl py-3.5 text-base font-bold transition-all duration-300",
                    "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white",
                    "hover:shadow-lg hover:shadow-violet-500/50 hover:scale-[1.02]",
                    "active:scale-[0.98]",
                    isLogin &&
                      planTier === plan.name &&
                      "ring-2 ring-violet-400 ring-offset-2"
                  )}
                >
                  <span className="relative z-10">
                    {isLogin && planTier === plan.name
                      ? "나의 현재 플랜"
                      : isBetaFreeApplied
                      ? "무료 업그레이드"
                      : `${plan.name} 이용하기`}
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingPlan;
