"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The masthead's own entrance — every section on the page opens with the
 * same kicker/title/flourish (SectionHeading), so it's the one piece of
 * text worth a dedicated, more deliberate reveal instead of just being
 * one more block in that section's uniform stagger:
 *
 *   1. the kicker steps in first, a quick beat
 *   2. the title pulls into focus out of a soft blur — deeper blur and a
 *      longer hold than the page's usual reveal, reserved for the one
 *      line of text every section is actually named after
 *   3. the flourish beneath draws itself in from the centre outward
 *      (scaleX), like a line of ink rather than something that just fades
 *
 * Looks for `[data-heading-kicker]`, `[data-heading-title]` and
 * `[data-heading-flourish]` inside containerRef; any that aren't present
 * (e.g. kicker-only headings have no title) are simply skipped.
 */
export function useHeadingReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const kicker = container.querySelector<HTMLElement>("[data-heading-kicker]");
    const title = container.querySelector<HTMLElement>("[data-heading-title]");
    const flourish = container.querySelector<HTMLElement>("[data-heading-flourish]");
    const parts = [kicker, title, flourish].filter(
      (el): el is HTMLElement => el !== null
    );
    if (parts.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(parts, { opacity: 1, y: 0, scaleX: 1, filter: "blur(0px)" });
        return;
      }

      if (kicker) gsap.set(kicker, { opacity: 0, y: 10 });
      if (title) gsap.set(title, { opacity: 0, y: 20, filter: "blur(11px)" });
      if (flourish) {
        gsap.set(flourish, { opacity: 0, scaleX: 0.25, transformOrigin: "50% 50%" });
      }

      ScrollTrigger.create({
        trigger: container,
        start: "top 82%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (kicker) {
            tl.to(kicker, { opacity: 1, y: 0, duration: 0.4 }, 0);
          }
          if (title) {
            tl.to(
              title,
              { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.95 },
              0.12
            );
          }
          if (flourish) {
            tl.to(
              flourish,
              { opacity: 1, scaleX: 1, duration: 0.75, ease: "power2.out" },
              0.5
            );
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}
