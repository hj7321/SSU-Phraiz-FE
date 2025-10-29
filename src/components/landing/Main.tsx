"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Icon1 from "/public/icons/icon1.svg";
import Icon2 from "/public/icons/icon2.svg";
import Icon3 from "/public/icons/icon3.svg";
import Icon4 from "/public/icons/icon4.svg";
import Icon5 from "/public/icons/icon5.svg";
import Icon6 from "/public/icons/icon6.svg";
import Icon7 from "/public/icons/icon7.svg";

const Main = () => {
  const containerRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const iconRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
        },
      });
      tl.from([h1Ref.current, h2Ref.current], {
        x: (i) => (i === 0 ? "-110vw" : "110vw"),
        opacity: 0,
        duration: 3.5,
        ease: "power3.out",
        stagger: 0.3,
      });

      tl.from(
        iconRefs.current,
        {
          y: "80vh",
          opacity: 0,
          duration: 2,
          ease: "power3.out",
          stagger: 0.12,
        },
        "<+=3"
      );

      iconRefs.current.forEach((icon) => {
        if (!icon) return;
        const dx = gsap.utils.random(25, 45);
        gsap.to(icon, {
          x: dx,
          duration: gsap.utils.random(3, 5),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 10,
          force3D: true,
        });
      });
    }, containerRef);

    // clean-up (메모리 누수 방지)
    return () => ctx.revert();
  }, []);

  /* ───────── 아이콘 JSX 헬퍼 ───────── */
  const makeIcon = (
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
    idx: number,
    className: string
  ) => (
    <div
      key={idx}
      ref={(el) => {
        if (el) iconRefs.current[idx] = el;
      }}
      className={`absolute ${className} pointer-events-none select-none`}
      style={{ willChange: "transform" }}
      aria-hidden="true"
    >
      <Icon className="w-full h-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden flex flex-col items-center justify-center gap-[50px] bg-gradient-to-b from-main to-main/20"
    >
      <div className="font-nanum-extrabold text-white text-[30px] xs:text-[36px] sm:text-[46px] md:text-[56px] lg:text-[72px] mt-[-50px] text-glow z-[9000]">
        <h1 ref={h1Ref} className="ml-[0px] xs:ml-[-80px]">
          누구나 전문가처럼 쓰는 시대,
        </h1>
        <p
          ref={h2Ref}
          className="text-right mr-[0px] xs:mr-[-80px] mt-[0px] xs:mt-[-5px]"
        >
          Phraiz로.
        </p>
      </div>
      <Link
        href="/ai-paraphrase"
        className="relative overflow-hidden group rounded-full bg-gradient-to-r from-[#7752fe] via-[#828ffa] to-[#7752fe] text-white py-[12px] px-[30px] sm:py-[14px] sm:px-[40px] hover:font-nanum-bold [filter:drop-shadow(0px_0px_8px_rgba(119,82,254,1))] text-[14px] sm:text-[16px]"
      >
        {/* ─── 텍스트 래퍼 ─── */}
        <span className="relative block h-full overflow-hidden">
          {/* ① 처음 보이는 글씨 */}
          <span
            className="
        block text-white font-nanum-bold
        transition-transform duration-300
        group-hover:-translate-y-full     /* 위로 완전히 나감 */
        group-focus-visible:-translate-y-full
      "
          >
            바로 시작하기
          </span>

          {/* ② 아래에서 올라올 글씨 */}
          <span
            className="
        absolute inset-0 flex items-center justify-center
        text-white font-nanum-bold
        transition-transform duration-300
        translate-y-full                 /* 처음엔 버튼 아래 */
        group-hover:translate-y-0        /* 중앙으로 올라옴 */
        group-focus-visible:translate-y-0
      "
          >
            바로 시작하기
          </span>
        </span>
      </Link>

      {/* ─────── 아이콘들 ─────── */}
      {[
        makeIcon(
          Icon1,
          0,
          "top-[24%] md:top-[22%] lg:top-[20%] left-[6%] w-[60px] xs:w-[70px] sm:w-[80px] md:w-[100px] lg:w-[130px]"
        ),
        makeIcon(
          Icon2,
          1,
          "bottom-[20%] lg:bottom-[14%] left-[10%] w-[60px] xs:w-[70px] sm:w-[80px] md:w-[100px] lg:w-[130px]"
        ),
        makeIcon(
          Icon3,
          2,
          "top-[27%] md:top-[25%] lg:top-[30%] right-[10%] w-[80px] xs:w-[90px] sm:w-[100px] md:w-[120px] lg:w-[150px]"
        ),
        makeIcon(
          Icon4,
          3,
          "top-[43%] lg:top-[45%] left-[5%] md:left-[20%] lg:left-[28%] w-[60px] xs:w-[70px] sm:w-[80px] md:w-[100px] lg:w-[130px]"
        ),
        makeIcon(
          Icon5,
          4,
          "top-[15%] sm:top-[10%] lg:top-[5%] left-[32%] w-[60px] xs:w-[70px] sm:w-[80px] md:w-[100px] lg:w-[130px]"
        ),
        makeIcon(
          Icon6,
          5,
          "top-[3%] lg:top-[0%] right-[30%] w-[80px] xs:w-[90px] sm:w-[100px] md:w-[120px] lg:w-[150px]"
        ),
        makeIcon(
          Icon7,
          6,
          "top-[60%] right-[20%] w-[60px] xs:w-[70px] sm:w-[80px] md:w-[100px] lg:w-[130px]"
        ),
      ]}
    </section>
  );
};

export default Main;
