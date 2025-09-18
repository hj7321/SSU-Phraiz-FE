"use client";

import { PRICING_PLAN } from "@/constants/pricingPlan";
import { useAuthStore } from "@/stores/auth.store";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PricingPlan = () => {
  const isLogin = useAuthStore((s) => s.isLogin);
  const planTier = useAuthStore((s) => s.planTier);
  const pathname = usePathname();

  return (
    <section className={clsx("h-[1700px] xs:h-[1600px] sm:h-[1000px] lg:h-[calc(100vh+30px)] w-full flex flex-col gap-[20px] justify-center items-center", pathname === "/" ? "bg-gradient-to-b from-main/60 to-main/20" : "pb-[120px] bg-gradient-to-b from-main to-main/20")}>
      <h1 className="text-[26px] sm:text-[28px] md:text-[30px] lg:text-[34px] font-nanum-extrabold [filter:drop-shadow(4px_4px_4px_rgba(0,0,0,0.3))]">{pathname === "/" ? "Pricing Plan" : "플랜 업그레이드"}</h1>
      <div className="relative flex flex-wrap justify-center gap-[20px]">
        {PRICING_PLAN.map((plan) => (
          <div key={plan.name} className="flex flex-col gap-[10px] md:gap-[20px] rounded-[16px] bg-white h-[340px] w-[240px] sm:h-[350px] sm:w-[270px] md:h-[420px] md:w-[300px] p-[20px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.3))] hover:cursor-pointer hover:[filter:drop-shadow(0px_0px_14px_rgba(0,0,0,0.6))] transition-transform duration-300 ease-in-out transform hover:scale-105">
            <div>
              <Image src={plan.icon} alt="" width={70} height={70} className="absolute right-[5px] top-[5px]" />
              <h1 className="font-nanum-extrabold text-[22px] sm:text-[24px] md:text-[26px] lg:text-[30px]">{plan.name}</h1>
              {plan.name === "Free" ? (
                <h1 className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  <span className="font-nanum-bold">0</span>원
                </h1>
              ) : (
                <div className="flex gap-[10px]">
                  <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                    월<span className="font-nanum-bold"> {plan.monthPrice}</span>원
                  </p>
                  <div className="border-[0.8px] md:border w-0 h-[13px] md:h-[17px] lg:h-[19px] mt-[3.5px] md:mt-[4.3px] lg:mt-[5.3px]"></div>
                  <p className="text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] mt-[2.5px] text-[#757575]">
                    연<span className="font-nanum-bold"> {plan.yearPrice}</span>원
                  </p>
                </div>
              )}
              <h1 className="text-[12px] sm:text-[14px] md:text-[16px]">
                월 토큰 한도: <span className="font-nanum-bold">{plan.monthTokenLimit}</span> {plan.name !== "Pro" && "토큰"}
              </h1>
            </div>
            <div className="h-[200px] md:h-[210px] flex flex-col gap-[3px]">
              {Object.entries(plan.features).map(([key, value]) => (
                <span key={value} className="flex items-start gap-[4px] sm:gap-[7px] text-[13px] sm:text-[14px] md:text-[16px]">
                  <Image src="/icons/check_black.svg" alt="check" width={12} height={12} className="shrink-0 mt-[5px] w-[10px] h-[10px] md:w-[12px] md:h-[12px]" />
                  <div>
                    <p className="font-nanum-extrabold">{key}</p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: `${value}`
                      }}></p>
                  </div>
                </span>
              ))}
            </div>
            <Link href={isLogin ? "/pay" : "/login"} className="text-center rounded-full bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] text-white py-[8px] md:py-[10px] text-[13px] sm:text-[15px] md:text-[17px] font-nanum-bold [filter:drop-shadow(0px_0px_4px_rgba(119,82,254,1))] hover:[filter:drop-shadow(0px_0px_8px_rgba(119,82,254,1))]">
              {isLogin && planTier === plan.name ? "나의 현재 플랜" : `${plan.name} 이용하기`}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingPlan;
