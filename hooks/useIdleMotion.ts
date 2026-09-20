"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { CoverRefs } from "./useCoverRefs";

/**
 * The cover's ambient "alive" motion before the invitation is opened: the
 * light glow breathes gently. An infinite yoyo tween — call stop() once
 * (from useOpenInvitation) so it doesn't fight the open timeline.
 */
export function useIdleMotion(refs: CoverRefs) {
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    const section = refs.section.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(refs.glow.current, {
        opacity: 0.22,
        x: 14,
        y: -10,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      stopRef.current = () => ctx.revert();
    }, section);

    return () => ctx.revert();
  }, [refs]);

  return {
    stop: () => stopRef.current(),
  };
}
