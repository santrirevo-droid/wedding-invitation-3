"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import { easeInOutCubic } from "@/lib/easing";
import type { CoverRefs } from "./useCoverRefs";

// every section below the cover, in page order — the autoscroll hops
// between these one at a time instead of gliding the whole document
// length in one continuous (and far too rushed) motion
const AUTOSCROLL_STOPS = [
  "#ayat-pembuka",
  "#mempelai",
  "#acara",
  "#rsvp",
  "#tanda-kasih",
  "#ucapan",
  "#penutup",
];

const AUTOSCROLL_HOP_DURATION = 1.6; // s — glide between two sections
const AUTOSCROLL_PAUSE = 1800; // ms — dwell time to actually read a section

// at most one tour instance ever runs at a time, so a single module-level
// slot (rather than React state/context) is enough to let something
// outside this hook — NavDock's jump-to-section — cancel it on demand
let activeTourCancel: (() => void) | null = null;

/** Stops the autoscroll tour if one is in flight; a no-op otherwise. Call
 * this before any other programmatic scroll (see NavDock), or the tour's
 * next scheduled hop will fight it for control of lenis. */
export function stopAutoScrollTour() {
  activeTourCancel?.();
}

/**
 * Carries the visitor down through the invitation one section at a time:
 * glide, pause to read, glide to the next. Cancels itself the instant the
 * visitor scrolls/touches/presses a key themselves, so it never fights
 * manual scrolling.
 */
function autoScrollThroughInvitation(lenis: Lenis) {
  let cancelled = false;
  let pauseTimer: ReturnType<typeof setTimeout>;

  const cleanup = () => {
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("keydown", cancel);
    if (activeTourCancel === cancel) activeTourCancel = null;
  };

  const cancel = () => {
    if (cancelled) return;
    cancelled = true;
    clearTimeout(pauseTimer);
    cleanup();
  };

  // exposed via stopAutoScrollTour() so a direct jump (NavDock) can call
  // this same cancel path instead of fighting the tour for control of lenis
  activeTourCancel = cancel;

  window.addEventListener("wheel", cancel, { passive: true, once: true });
  window.addEventListener("touchstart", cancel, { passive: true, once: true });
  window.addEventListener("keydown", cancel, { once: true });

  let index = 0;
  const advance = () => {
    if (cancelled) return;

    const target = AUTOSCROLL_STOPS[index];
    index += 1;

    if (!target || !document.querySelector(target)) {
      if (index < AUTOSCROLL_STOPS.length) advance();
      else cleanup();
      return;
    }

    lenis.scrollTo(target, {
      duration: AUTOSCROLL_HOP_DURATION,
      easing: easeInOutCubic,
      onComplete: () => {
        if (cancelled) return;
        if (index < AUTOSCROLL_STOPS.length) {
          pauseTimer = setTimeout(advance, AUTOSCROLL_PAUSE);
        } else {
          cleanup();
        }
      },
    });
  };

  advance();
}

/**
 * Orchestrates the "Buka Undangan" cover animation (Tahap 2): scroll
 * locks, music starts, a soft glow blooms and the title lifts with a
 * gentle zoom — then scroll unlocks and, once unlocked,
 * autoScrollThroughInvitation carries the visitor down through the rest
 * of the page at a readable pace. Skipped under reduced-motion so those
 * visitors keep manual control.
 *
 * Kept separate from the Hero markup so the animation timeline can
 * be tuned without touching layout/JSX.
 */
export function useOpenInvitation(refs: CoverRefs) {
  const [isOpened, setIsOpened] = useState(false);
  const isAnimating = useRef(false);
  const lenis = useLenis();

  // scroll stays locked to the cover until "Buka Undangan" is pressed — a
  // guest can't scroll (and thus can't dodge) past it, and the CTA tap is
  // also a real click, which is the one gesture mobile browsers reliably
  // accept for unlocking audio playback.
  //
  // The CSS class alone isn't enough: Lenis drives scroll itself (it
  // intercepts wheel/touch and calls its own scrollTo), so a wheel/touch
  // event still moves the page even with html.scroll-locked's overflow:
  // hidden in place. lenis.stop() is what actually halts Lenis's internal
  // scroll loop; the class is kept alongside it for the CSS-only fallback
  // (no-JS, or before Lenis has initialised) and for the overflow-hidden
  // visual it provides during the reveal animation.
  useEffect(() => {
    document.documentElement.classList.add("scroll-locked");
    lenis?.stop();
    return () => {
      document.documentElement.classList.remove("scroll-locked");
      lenis?.start();
    };
  }, [lenis]);

  const open = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIsOpened(true);

    // already locked by the mount effect above; scroll stays locked
    // through the reveal animation and is released in onComplete below
    refs.music.current?.play();

    // "Tersingkap": the floral frame parts outward from the centre, like
    // drawing back a curtain of flowers. Each corner is pushed along its
    // own diagonal, read off data-cover-floral ("tl" | "tr" | "bl" | "br"),
    // so one tween covers all four without four separate refs.
    const section = refs.section.current;
    if (section) {
      const corners = section.querySelectorAll<HTMLElement>("[data-cover-floral]");
      gsap.to(corners, {
        x: (_i, el: HTMLElement) =>
          (el.dataset.coverFloral ?? "").includes("l") ? -88 : 88,
        y: (_i, el: HTMLElement) =>
          (el.dataset.coverFloral ?? "").includes("t") ? -66 : 66,
        scale: 1.12,
        opacity: 0.55,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.documentElement.classList.remove("scroll-locked");
          lenis?.start();

          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
          }

          if (lenis) autoScrollThroughInvitation(lenis);
        },
      })
      .set(refs.button.current, { pointerEvents: "none" }, 0)
      .to(refs.button.current, { opacity: 0, y: 12, duration: 0.35 }, 0)
      .to(refs.glow.current, { opacity: 1, duration: 0.6, ease: "power1.out" }, 0)
      .fromTo(
        refs.title.current,
        { scale: 0.94 },
        { scale: 1.05, duration: 0.45, ease: "power2.out" },
        0.1
      )
      .to(refs.title.current, { scale: 1, duration: 0.55, ease: "power2.inOut" }, 0.55)
      .to(refs.glow.current, { opacity: 0, duration: 0.55, ease: "power1.in" }, 0.75);
  }, [refs, lenis]);

  return { isOpened, open };
}
