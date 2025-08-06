"use client";

import { ServiceFeature } from "@/constants/serviceLink";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface FeatureCardProps {
  feature: ServiceFeature;
  href: string;
  ctaText: string;
}

const FeatureCard = ({ feature, href, ctaText }: FeatureCardProps) => {
  return (
    <Link
      href={href}
      className={clsx(
        "relative w-[270px] h-[160px] sm:w-[290px] sm:h-[180px] md:w-[350px] md:h-[240px] rounded-[16px] border border-[#a294f9] bg-gradient-to-r from-white to-main/30 flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer group"
      )}
    >
      <div
        className="
          absolute inset-0 z-20
          bg-[linear-gradient(to_top,_#7752fe_0%,_#c1b2ff_30%,_transparent_60%)]
          translate-y-full group-hover:translate-y-0
          transition-transform duration-500 ease-out
        "
      />
      {/* CTA 문구 */}
      <span
        className="
          absolute bottom-[10px] z-20 flex items-center justify-center
          font-nanum-bold md:text-[20px] text-[17px] text-white
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        "
      >
        {ctaText}
        <Image
          src="/icons/right_arrow.svg"
          alt=">"
          width={18}
          height={10}
          className="ml-[5px] w-[15px] h-[15px] md:w-[19px] md:h-[19px]"
        />
      </span>

      {/* 기본 내용 (hover 시 희미해짐) */}
      <div
        data-fade
        className="z-10 flex flex-col items-center justify-center text-center gap-[10px] px-[16px] sm:px-[24px] w-full h-full
        "
      >
        <h3
          data-fade
          className="font-nanum-extrabold text-[17px] sm:text-[19px] md:text-[21px] lg:text-[23px]"
          dangerouslySetInnerHTML={{
            __html: `${feature.title}`,
          }}
        ></h3>
        <p
          data-fade
          className="text-[13px] md:text-[15px] lg:text-[16px] group-hover:opacity-50"
          dangerouslySetInnerHTML={{
            __html: `${feature.description}`,
          }}
        ></p>
      </div>
    </Link>
  );
};

export default FeatureCard;
