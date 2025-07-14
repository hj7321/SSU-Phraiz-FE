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
    <section
      className={clsx(
        "h-[calc(100vh+30px)] w-full flex flex-col gap-[20px] justify-center items-center",
        pathname === "/"
          ? "bg-gradient-to-b from-main/60 to-main/20"
          : "pb-[120px] bg-gradient-to-b from-main to-main/20"
      )}
    >
      <h1 className="text-[34px] font-nanum-extrabold [filter:drop-shadow(4px_4px_4px_rgba(0,0,0,0.3))]">
        {pathname === "/" ? "Pricing Plan" : "플랜 업그레이드"}
      </h1>
      <div className="flex flex-wrap justify-center gap-[20px]">
        {PRICING_PLAN.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col justify-between rounded-[16px] bg-white h-[300px] w-[270px] md:h-[350px] md:w-[300px] p-[20px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.3))] hover:cursor-pointer hover:[filter:drop-shadow(0px_0px_14px_rgba(0,0,0,0.6))] transition-transform duration-300 ease-in-out transform hover:scale-105"
          >
            <div>
              <h1 className="font-nanum-extrabold text-[24px] md:text-[30px]">
                {plan.name}
              </h1>
              <h1 className="text-[16px] md:text-[20px]">
                <span className="font-nanum-bold">{plan.price}</span> 원/월
              </h1>
            </div>
            <div className="mt-[10px] h-[140px] md:h-[160px] flex flex-col gap-[3px]">
              {plan.features.map((feature) => (
                <span
                  key={feature}
                  className="flex items-start gap-[7px] text-[14px] md:text-[16px]"
                >
                  <Image
                    src="/icons/check_black.svg"
                    alt="check"
                    width={12}
                    height={12}
                    className="shrink-0 mt-[5px]"
                  />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: `${feature}`,
                    }}
                  ></p>
                </span>
              ))}
            </div>
            <Link
              href="/pay"
              className="text-center rounded-full bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] text-white py-[8px] md:py-[10px] md:text-[17px] text-[15px] font-nanum-bold [filter:drop-shadow(0px_0px_4px_rgba(119,82,254,1))] hover:[filter:drop-shadow(0px_0px_8px_rgba(119,82,254,1))]"
            >
              {isLogin && planTier === plan.name
                ? "나의 현재 플랜"
                : `${plan.name} 이용하기`}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingPlan;
