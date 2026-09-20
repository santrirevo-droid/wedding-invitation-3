"use client";

import { useEffect, useState } from "react";
import { DEFAULT_WHATSAPP_MESSAGE_TEMPLATE } from "@/lib/inviteLink";

const STORAGE_KEY = "wa-message-template:v1";

/** The sender's WhatsApp invite wording, edited once and reused for every
 * guest (see fillWhatsAppTemplate) — persisted locally so it survives a
 * reload between sends. Shared by /daftar-tamu and its /rekap view. */
export function useWhatsAppTemplate() {
  const [template, setTemplate] = useState(DEFAULT_WHATSAPP_MESSAGE_TEMPLATE);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setTemplate(saved);
    } catch {
      // localStorage unavailable (private mode, etc.) — template just
      // won't persist across reloads, which is a fine fallback
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, template);
    } catch {
      // ignore, same as above
    }
  }, [template]);

  return [template, setTemplate] as const;
}
