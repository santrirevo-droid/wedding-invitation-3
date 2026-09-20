"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CoverRefs } from "./useCoverRefs";

gsap.registerPlugin(ScrollTrigger);

/**
 * Tahap 3 — Scroll Reveal.
 *
 * Pins the cover while it eases back and fades, revealing the invitation
 * content underneath. Driven entirely by GSAP ScrollTrigger with scrub —
 * no CSS animation.
 */
export function useScrollReveal(refs: CoverRefs) {
  useEffect(() => {
    const section = refs.section.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=70%",
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
          },
        })
        .to(refs.background.current, { scale: 1.05, ease: "none", duration: 1 }, 0)
        .to(
          refs.content.current,
          { yPercent: -18, opacity: 0, ease: "none", duration: 0.85 },
          0.05
        )
        .to(refs.coverInner.current, { opacity: 0, ease: "none", duration: 0.4 }, 0.6);
    }, section);

    return () => ctx.revert();
  }, [refs]);
}
