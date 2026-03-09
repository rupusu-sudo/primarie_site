import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

interface UseGsapSectionRevealOptions {
  dependencies?: readonly unknown[];
}

const setOptimizedStyles = (elements: HTMLElement[]) => {
  if (!elements.length) {
    return;
  }

  gsap.set(elements, { willChange: "transform, opacity" });
};

const clearOptimizedStyles = (elements: HTMLElement[]) => {
  if (!elements.length) {
    return;
  }

  gsap.set(elements, { clearProps: "willChange" });
};

export const useGsapSectionReveal = (
  rootRef: RefObject<HTMLElement>,
  options: UseGsapSectionRevealOptions = {},
) => {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        return;
      }

      const copyBlocks = gsap.utils.toArray<HTMLElement>("[data-reveal='copy']", root);
      copyBlocks.forEach((element, index) => {
        setOptimizedStyles([element]);
        gsap.from(element, {
          opacity: 0,
          y: 18,
          duration: 0.55,
          delay: index * 0.04,
          ease: "power2.out",
          clearProps: "willChange",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        });
      });

      const mediaBlocks = gsap.utils.toArray<HTMLElement>("[data-reveal='media']", root);
      mediaBlocks.forEach((element) => {
        setOptimizedStyles([element]);
        gsap.from(element, {
          opacity: 0,
          y: 24,
          scale: 0.985,
          duration: 0.65,
          ease: "power2.out",
          clearProps: "willChange",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true,
          },
        });
      });

      const singleItems = gsap.utils.toArray<HTMLElement>("[data-reveal='item']", root);
      singleItems.forEach((element) => {
        setOptimizedStyles([element]);
        gsap.from(element, {
          opacity: 0,
          y: 14,
          duration: 0.45,
          ease: "power2.out",
          clearProps: "willChange",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            once: true,
          },
        });
      });

      const groups = gsap.utils.toArray<HTMLElement>("[data-reveal='group']", root);
      groups.forEach((group) => {
        const children = Array.from(group.children).filter(
          (child): child is HTMLElement => child instanceof HTMLElement,
        );

        if (!children.length) {
          return;
        }

        setOptimizedStyles(children);
        gsap.from(children, {
          opacity: 0,
          y: 18,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          onComplete: () => clearOptimizedStyles(children),
          scrollTrigger: {
            trigger: group,
            start: "top 86%",
            once: true,
          },
        });
      });
    },
    {
      scope: rootRef,
      dependencies: options.dependencies ?? [],
      revertOnUpdate: true,
    },
  );
};
