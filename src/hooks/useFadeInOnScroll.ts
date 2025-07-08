import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useFadeInOnScroll = (
  sectionRef: React.RefObject<HTMLElement>,
  selector = "[data-fade]"
) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(
        sectionRef.current!.querySelectorAll(selector)
      );

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.15, // ⬅️  순차적으로 나타나게
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: "top center",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }, sectionRef); // <— context: 섹션 노드

    return () => ctx.revert(); // 언마운트 시 깔끔하게 제거
  }, [sectionRef, selector]);
};

export default useFadeInOnScroll;
