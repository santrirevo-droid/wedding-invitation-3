"use client";

import { useId, useState } from "react";
import { DEFAULT_WHATSAPP_MESSAGE_TEMPLATE } from "@/lib/inviteLink";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * The WhatsApp invite wording, edited once here rather than per guest —
 * {{nama}} and {{link}} are swapped in automatically for whoever the send
 * icon is tapped for (see fillWhatsAppTemplate). Collapsed by default so
 * it doesn't compete with the name form for attention; the textarea only
 * mounts once opened, since most visitors never need to touch it.
 */
export default function MessageTemplateEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <section className="card-stock mt-6 rounded-[3px] p-5">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block text-base font-semibold text-ink">Pesan Pengantar WhatsApp</span>
          <span className="mt-0.5 block text-sm text-ink-soft">
            {isOpen ? "Sedang mengedit kalimatnya" : "Ketuk edit untuk menyesuaikan kalimatnya"}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-ink">
          {isOpen ? "Tutup" : "Edit"}
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="flex flex-col gap-3 overflow-hidden">
          <p className="text-sm text-ink-soft">
            Tulis <code className="rounded bg-maroon px-1.5 py-0.5 text-xs">{"{{nama}}"}</code> dan{" "}
            <code className="rounded bg-maroon px-1.5 py-0.5 text-xs">{"{{link}}"}</code> di mana
            saja — otomatis diganti nama tamu dan tautan undangannya masing-masing saat dikirim.
          </p>

          <textarea
            aria-label="Pesan Pengantar WhatsApp"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-xl border-2 border-border bg-paper px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-gold-dark"
          />

          {value !== DEFAULT_WHATSAPP_MESSAGE_TEMPLATE && (
            <button
              type="button"
              onClick={() => onChange(DEFAULT_WHATSAPP_MESSAGE_TEMPLATE)}
              className="self-start text-sm font-semibold text-ink-soft underline decoration-border underline-offset-4 hover:text-ink"
            >
              Kembalikan ke teks asli
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
