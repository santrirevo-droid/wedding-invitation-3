"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  /** px to rise from */
  y?: number;
  duration?: number;
  /** stagger between matched children, in seconds */
  stagger?: number;
  /** ScrollTrigger start position */
  start?: string;
  /** selector (within the container) for the elements to stagger in; falls back to the container itself */
  selector?: string;
  /** resting opacity once revealed — lets ambient washes settle at their intended faintness instead of snapping to fully opaque */
  opacity?: number;
  /** starting scale, eases up to 1 */
  scale?: number;
  /** starting blur in px, clearing to 0 as the element settles — the
   * "soft focus pulling sharp" read that makes this a cinematic entrance
   * rather than a flat fade. Set to 0 to opt out (e.g. for a section whose
   * content shouldn't ever look soft, if one ever needs that). */
  blur?: number;
};

/**
 * Generic "section entrance" reveal: elements blur into focus while they
 * fade, rise and settle into scale, once, when scrolled into view. Driven
 * by GSAP ScrollTrigger (not scrub — this plays once, unlike the Hero's
 * pinned scroll-reveal timeline).
 */
export function useRevealOnScroll(
  containerRef: RefObject<HTMLElement | null>,
  {
    y = 22,
    duration = 0.7,
    stagger = 0.08,
    start = "top 82%",
    selector = "[data-reveal]",
    opacity = 1,
    scale = 0.97,
    blur = 7,
  }: RevealOptions = {}
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const matched = gsap.utils.toArray<HTMLElement>(selector);
      const els = matched.length ? matched : [container];

      if (reduceMotion) {
        gsap.set(els, { opacity, y: 0, scale: 1, filter: "blur(0px)" });
        return;
      }

      gsap.set(els, { opacity: 0, y, scale, filter: `blur(${blur}px)` });
      ScrollTrigger.create({
        trigger: container,
        start,
        once: true,
        onEnter: () => {
          gsap.to(els, {
            opacity,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration,
            stagger,
            ease: "power3.out",
          });
        },
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef, y, duration, stagger, start, selector, opacity, scale, blur]);
}
