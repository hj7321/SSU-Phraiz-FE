"use client";

import { ServiceLink } from "@/constants/serviceLink";
import useFadeInOnScroll from "@/hooks/useFadeInOnScroll";
import clsx from "clsx";
import Image from "next/image";
import { useRef } from "react";
import FeatureCard from "./FeatureCard";

interface LandingSectionProps {
  data: ServiceLink;
  idx: number;
}

const LandingSection = ({ data, idx }: LandingSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useFadeInOnScroll(sectionRef);

  return (
    <section
      ref={sectionRef}
      className={clsx(
        "h-[calc(100vh+30px)] w-full flex flex-col items-center justify-center text-black",
        idx % 2
          ? "bg-gradient-to-b from-main/60 to-main/20"
          : "bg-gradient-to-b from-main/20 to-main/60"
      )}
    >
      <h1
        data-fade
        className="md:text-[46px] text-[36px] font-nanum-extrabold [filter:drop-shadow(4px_4px_10px_rgba(0,0,0,0.2))] bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent mb-[-10px]"
      >
        {data.title}
      </h1>

      <div className="relative w-[300px] h-[200px] md:w-[360px] md:h-[240px]">
        <Image
          data-fade
          src={data.image}
          alt={data.alt}
          width={360}
          height={240}
          priority
        />
      </div>

      <div className="flex flex-wrap justify-center md:gap-[40px] gap-[20px] mt-[-10px]">
        {data.features.map((feature) => (
          <FeatureCard
            key={feature.title}
            feature={feature}
            href={data.href}
            ctaText={data.ctaText}
          />
        ))}
      </div>
    </section>
  );
};

export default LandingSection;
