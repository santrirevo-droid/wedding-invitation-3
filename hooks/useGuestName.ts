"use client";

import { useSearchParams } from "next/navigation";

/**
 * Reads the guest's name from `?to=` in the share link, so a personalized
 * link (e.g. `?to=Budi+Santoso`) can greet them by name on the cover and
 * pre-fill the RSVP form. Must be called from inside a <Suspense> boundary
 * — see GuestGreeting and GuestNameAutofill for the wrapped call sites.
 */
export function useGuestName() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("to");
  if (!raw) return "";

  try {
    return decodeURIComponent(raw.replace(/\+/g, " ")).trim();
  } catch {
    return raw.replace(/\+/g, " ").trim();
  }
}
