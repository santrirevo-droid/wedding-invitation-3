"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ScrollTriggerSync() {
  // keeps ScrollTrigger's cached positions in sync with Lenis's
  // interpolated scroll position every frame
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function onTick(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(onTick);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
