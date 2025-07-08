"use client";

import { ServiceLink } from "@/constants/serviceLink";
import useFadeInOnScroll from "@/hooks/useFadeInOnScroll";
import clsx from "clsx";
import Image from "next/image";
import { useRef } from "react";

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

      <Image
        data-fade
        src={data.image}
        alt={data.alt}
        width={360}
        height={240}
        priority
      />

      <div className="flex gap-[40px] mt-[-10px]">
        {data.features.map((feature) => (
          <div
            data-fade
            key={feature.title}
            className="mt-[16px] text-center border border-[#a294f9] w-[350px] h-[240px] rounded-[16px] flex flex-col gap-[10px] justify-center bg-gradient-to-r from-white to-main/30"
          >
            <h3
              data-fade
              className="font-nanum-extrabold md:text-[23px] text-[19px]"
              dangerouslySetInnerHTML={{
                __html: `${feature.title}`,
              }}
            ></h3>
            <p
              data-fade
              className="md:text-[16px] text-[14px]"
              dangerouslySetInnerHTML={{
                __html: `${feature.description}`,
              }}
            ></p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingSection;
