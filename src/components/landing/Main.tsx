"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Main = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const line1Ref = useRef<HTMLHeadingElement | null>(null);
  const line2Ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;

    // gsap.context → React에서 스코프 관리 + clean-up
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // line1: 왼쪽 ➜ 중앙
      tl.fromTo(
        line1Ref.current,
        { x: "-100vw", opacity: 0 },
        { x: 0, opacity: 1, duration: 3, ease: "power3.out" }
      );

      // line2: 오른쪽 ➜ 중앙 (0.1s 겹치기)
      tl.fromTo(
        line2Ref.current,
        { x: "100vw", opacity: 0 },
        { x: 0, opacity: 1, duration: 3, ease: "power3.out" },
        "<1" // ← 이전 스텝 1초 뒤에 시작
      );
    }, containerRef);

    // clean-up (메모리 누수 방지)
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="h-screen flex flex-col items-center justify-center gap-[50px] bg-gradient-to-b from-main to-main/20"
    >
      <div className="font-nanum-extrabold text-white text-[64px] mt-[-30px]">
        <h1 ref={line1Ref} className="ml-[-80px]">
          누구나 전문가처럼 쓰는 시대,
        </h1>
        <h1 ref={line2Ref} className="text-right mr-[-80px] mt-[-10px]">
          Phraiz로.
        </h1>
      </div>
      <Link
        href="/ai-paraphrase"
        className="rounded-full bg-[#7752fe] text-white py-[14px] px-[40px] hover:font-nanum-bold"
      >
        바로 시작하기
      </Link>
      {/* <h1 className="text-[30px] tracking-[5px]">
        Phraiz로 더 정확하고 빠르게 인용하고 리라이팅하세요
      </h1>
      <div className="flex flex-wrap justify-center gap-[50px]">
        {SERVICE_LINK.map((link, index) => (
          <Link
            key={link.label}
            href={link.href}
            className={clsx(
              "rounded-[10px] px-[90px] py-[40px] [box-shadow:8px_8px_16px_rgba(0,0,0,0.25)] flex flex-col items-center",
              hoverStates[index] ? "bg-[#D0A2F7]" : "bg-[#E5D4FF]"
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <Image
              src={link.icon}
              alt={link.alt}
              width={150}
              height={100}
              className={clsx(
                hoverStates[index]
                  ? "[filter:drop-shadow(4px_4px_4px_rgba(0,0,0,0.5))]"
                  : "[filter:drop-shadow(4px_4px_4px_rgba(0,0,0,0.25))]"
              )}
            />
            <p
              className={clsx(
                "text-[24px] mt-[-5px] [text-shadow:2px_2px_4px_rgba(0,0,0,0.25)]",
                hoverStates[index] && "font-nanum-bold"
              )}
            >
              {link.label}
            </p>
          </Link>
        ))}
      </div> */}
    </section>
  );
};

export default Main;
