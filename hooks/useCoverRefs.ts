"use client";

import { useRef } from "react";
import type { MusicPlayerHandle } from "@/components/MusicPlayer";

/**
 * Single source of truth for the refs shared between the Hero's two
 * animation hooks — useOpenInvitation (Tahap 2, click) and
 * useScrollReveal (Tahap 3, scroll) both animate the same DOM nodes.
 */
export function useCoverRefs() {
  return {
    section: useRef<HTMLElement>(null),
    coverInner: useRef<HTMLDivElement>(null),
    background: useRef<HTMLDivElement>(null),
    glow: useRef<HTMLDivElement>(null),
    content: useRef<HTMLDivElement>(null),
    title: useRef<HTMLHeadingElement>(null),
    // wraps the button + "tap to open" hint so both fade together on open
    button: useRef<HTMLDivElement>(null),
    music: useRef<MusicPlayerHandle>(null),
  };
}

export type CoverRefs = ReturnType<typeof useCoverRefs>;
