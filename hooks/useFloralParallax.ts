"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Slow, non-pinned drift for a single decorative floral element as its
 * section passes through the viewport — lighter-weight than the Hero's
 * pinned useScrollReveal timeline. transform/opacity only, skipped under
 * reduced-motion (element just stays put).
 */
export function useFloralParallax(
  sectionRef: RefObject<HTMLElement | null>,
  elRef: RefObject<HTMLElement | null>,
  speed = 14
) {
  useEffect(() => {
    const section = sectionRef.current;
    const el = elRef.current;
    if (!section || !el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [sectionRef, elRef, speed]);
}
