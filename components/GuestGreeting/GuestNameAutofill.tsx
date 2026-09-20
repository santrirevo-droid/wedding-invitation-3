"use client";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useGuestName } from "@/hooks/useGuestName";

/**
 * Invisible helper: fills the RSVP name field from the same `?to=` guest
 * name shown on the cover, without ever overwriting something the guest
 * has already typed.
 */
export default function GuestNameAutofill({
  setName,
}: {
  setName: Dispatch<SetStateAction<string>>;
}) {
  const guestName = useGuestName();

  useEffect(() => {
    if (!guestName) return;
    setName((current) => current || guestName);
  }, [guestName, setName]);

  return null;
}
