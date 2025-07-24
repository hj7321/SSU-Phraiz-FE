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

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       console.log(await toAPA("10.1038/s41586-024-07225-0"));
  //       console.log(await toAPA("https://doi.org/10.1109/5.771073"));
  //     } catch (e) {
  //       console.error("APA 변환 실패:", e);
  //     }
  //   })();
  // }, []);
  // const [apa, setApa] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     const result = await toAPA();
  //     setApa(result);
  //   })();
  // }, []);

  // console.log(apa);

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
        className="text-[30px] sm:text-[36px] md:text-[46px] lg:text-[50px]  font-nanum-extrabold [filter:drop-shadow(4px_4px_10px_rgba(0,0,0,0.2))] bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] bg-clip-text text-transparent mb-[-10px]"
      >
        {data.title}
      </h1>

      <div className="relative w-[240px] h-[160px] sm:w-[270px] sm:h-[180px] md:w-[300px] md:h-[200px] lg:w-[360px] lg:h-[240px]">
        <Image
          data-fade
          src={data.icon}
          alt={data.alt}
          width={360}
          height={240}
          priority
        />
      </div>

      <div className="flex flex-wrap justify-center gap-[10px] sm:gap-[20px] md:gap-[26px] lg:gap-[40px] mt-[-10px]">
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
