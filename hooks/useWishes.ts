"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Wish = {
  id: number;
  name: string;
  attend: "hadir" | "tidak";
  guests: string;
  message: string;
};

const EMPTY_WISHES: Wish[] = [];

// module-level cache shared by every component that mounts this hook (RSVP
// form + Wishes list), so they don't each fetch independently and stay in
// sync with each other in the same tab.
let cache: Wish[] = EMPTY_WISHES;
let hasFetched = false;
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

async function fetchWishes() {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const res = await fetch("/api/wishes", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      cache = Array.isArray(data.wishes) ? data.wishes : EMPTY_WISHES;
      hasFetched = true;
      notify();
    } catch {
      // offline or the API is unreachable — keep whatever's cached
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (!hasFetched) fetchWishes();
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  return cache;
}

function getServerSnapshot() {
  return EMPTY_WISHES;
}

/**
 * Shared RSVP/wishes data, backed by /api/wishes (Vercel KV / Upstash
 * Redis) so every visitor sees the same list instead of only their own
 * browser's localStorage. Multiple components (RSVP form, Wishes list) can
 * mount this hook independently and share one in-memory cache plus one
 * in-flight fetch.
 */
export function useWishes() {
  const wishes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addWish = useCallback(async (entry: Omit<Wish, "id">) => {
    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!res.ok) {
      throw new Error("Gagal mengirim ucapan.");
    }
    await fetchWishes();
  }, []);

  return { wishes, addWish };
}
