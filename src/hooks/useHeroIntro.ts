"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RefEl = React.RefObject<HTMLElement>;
type MutableRefEls = React.MutableRefObject<HTMLElement[]>;

interface FloatOptions {
  enabled?: boolean;
  delay?: number;
  xRange?: [number, number]; // 아이콘 좌우 이동 범위(px)
  durationRange?: [number, number]; // 왕복 시간 범위(초)
  ease?: string;
}

interface Options {
  start?: string; // ScrollTrigger start
  titlesDuration?: number;
  titleStagger?: number;
  iconsDuration?: number;
  iconsStagger?: number;
  overlapSeconds?: number; // 타이틀 시작 기준 아이콘 등장 겹침( "<+=n" )
  reducedMotionRespect?: boolean; // OS 감속 모드 존중
  float?: FloatOptions; // 아이콘 부유 트윈 옵션
}

const useHeroIntro = (
  containerRef: RefEl,
  h1Ref: RefEl,
  pRef: RefEl,
  iconRefs: MutableRefEls,
  opts: Options = {}
) => {
  useLayoutEffect(() => {
    const {
      start = "top center",
      titlesDuration = 3.5,
      titleStagger = 0.3,
      iconsDuration = 2,
      iconsStagger = 0.12,
      overlapSeconds = 3,
      reducedMotionRespect = true,
      float = {},
    } = opts;

    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;

    const prefersReduced =
      reducedMotionRespect &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([h1Ref.current, pRef.current, iconRefs.current], {
          clearProps: "all",
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: containerRef.current, start },
      });

      tl.from([h1Ref.current, pRef.current], {
        x: (i: number) => (i === 0 ? "-110vw" : "110vw"),
        opacity: 0,
        duration: titlesDuration,
        ease: "power3.out",
        stagger: titleStagger,
      });

      tl.from(
        iconRefs.current,
        {
          y: "80vh",
          opacity: 0,
          duration: iconsDuration,
          ease: "power3.out",
          stagger: iconsStagger,
        },
        `<+=${overlapSeconds}`
      );

      const {
        enabled = true,
        delay = 10,
        xRange = [25, 45],
        durationRange = [3, 5],
        ease = "sine.inOut",
      } = float;

      if (enabled && iconRefs.current?.length) {
        iconRefs.current.forEach((icon) => {
          if (!icon) return;
          const dx = gsap.utils.random(xRange[0], xRange[1]);
          const dur = gsap.utils.random(durationRange[0], durationRange[1]);
          gsap.to(icon, {
            x: dx,
            duration: dur,
            ease,
            yoyo: true,
            repeat: -1,
            delay,
            force3D: true,
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, h1Ref, pRef, iconRefs, opts]);
};

export default useHeroIntro;
