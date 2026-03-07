import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useGsapMayorPage = (rootRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-animate='hero']", { opacity: 0, y: 24, duration: 0.6, ease: "power2.out" });

      gsap.utils.toArray<HTMLElement>("[data-animate='card']").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-animate='form']").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 26,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-animate='faq']").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [rootRef]);
};
