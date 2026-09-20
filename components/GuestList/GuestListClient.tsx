"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Family } from "@/lib/families";
import { buildInviteLink, buildWhatsAppUrl, fillWhatsAppTemplate } from "@/lib/inviteLink";
import { useWhatsAppTemplate } from "@/hooks/useWhatsAppTemplate";
import GuestEntryActions from "./GuestEntryActions";
import MessageTemplateEditor from "./MessageTemplateEditor";

type GuestEntry = {
  id: string;
  name: string;
  familySlug: string;
  familyLabel: string;
  relation: string;
  guestCount: number;
  createdAt: number;
};

type SimilarMatch = { name: string; familyLabel: string; score: number };

const fieldClass =
  "w-full rounded-xl border-2 border-border bg-paper px-4 py-3 text-base text-ink outline-none transition-colors focus:border-gold-dark";
const labelClass = "mb-2 block text-base font-semibold text-ink";
const buttonClass =
  "min-h-14 rounded-xl px-6 py-3 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

function parseNameLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function GuestListClient({
  family,
  intro,
  footer,
}: {
  family: Family;
  /** Copy shown under the heading — page-specific, so it's passed in rather
   * than hardcoded here (this component no longer assumes a multi-family
   * picker flow lives above it). */
  intro?: ReactNode;
  /** Optional content rendered at the very end, inside the same padded
   * <main> column (e.g. a link to the read-only rekap view). */
  footer?: ReactNode;
}) {
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const [namesText, setNamesText] = useState("");
  const [similar, setSimilar] = useState<Record<string, SimilarMatch[]>>({});
  // Tracks which exact textarea text the "tetap tambahkan" checkbox was
  // ticked for, so editing the names after confirming automatically
  // un-confirms it without needing an effect to reset a separate boolean.
  const [confirmedText, setConfirmedText] = useState<string | null>(null);
  const hasSimilar = Object.keys(similar).length > 0;
  const confirmedDespiteSimilar = confirmedText !== null && confirmedText === namesText;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messageTemplate, setMessageTemplate] = useWhatsAppTemplate();

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRequestId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/guest-list?family=${family.slug}`, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && res.ok) setEntries(data.entries ?? []);
      } finally {
        if (!cancelled) setIsLoadingList(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [family.slug]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);

    async function runSearch(lines: string[]) {
      if (lines.length === 0) {
        setSimilar({});
        return;
      }
      const requestId = ++searchRequestId.current;
      try {
        const results = await Promise.all(
          lines.map(async (line) => {
            const res = await fetch(`/api/guest-list/search?q=${encodeURIComponent(line)}`);
            const data = await res.json();
            return [line, res.ok ? (data.matches as SimilarMatch[] ?? []) : []] as const;
          })
        );
        if (requestId !== searchRequestId.current) return;
        const next: Record<string, SimilarMatch[]> = {};
        for (const [line, matches] of results) {
          if (matches.length > 0) next[line] = matches;
        }
        setSimilar(next);
      } catch {
        // ignore — duplicate check is a helper, not a hard requirement
      }
    }

    searchTimer.current = setTimeout(() => runSearch(parseNameLines(namesText)), 400);

    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [namesText]);

  const totalPeople = entries.reduce((sum, entry) => sum + entry.guestCount, 0);
  const nameLines = parseNameLines(namesText);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (nameLines.length === 0) {
      setFormError("Mohon isi minimal satu nama tamu.");
      return;
    }
    if (hasSimilar && !confirmedDespiteSimilar) {
      setFormError("Mohon periksa nama mirip di atas sebelum menambahkan.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const added: GuestEntry[] = [];
    const failed: string[] = [];
    for (const line of nameLines) {
      try {
        const res = await fetch("/api/guest-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ familySlug: family.slug, name: line }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        added.push(data.entry);
      } catch {
        failed.push(line);
      }
    }

    if (added.length > 0) {
      setEntries((current) => [...added.reverse(), ...current]);
    }
    if (failed.length === 0) {
      setSuccessMessage(
        added.length === 1 ? `"${added[0].name}" berhasil ditambahkan.` : `${added.length} nama berhasil ditambahkan.`
      );
      setNamesText("");
      setSimilar({});
      setConfirmedText(null);
    } else {
      setFormError(`Gagal menambahkan: ${failed.join(", ")}. Nama lainnya sudah tersimpan.`);
      setNamesText(failed.join("\n"));
    }

    setIsSubmitting(false);
  }

  async function handleCopyLink(entry: GuestEntry) {
    const link = buildInviteLink(window.location.origin, entry.name);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId((current) => (current === entry.id ? null : current)), 2000);
    } catch {
      setFormError("Gagal menyalin link. Coba lagi.");
    }
  }

  function handleShareWhatsApp(entry: GuestEntry) {
    const link = buildInviteLink(window.location.origin, entry.name);
    const message = fillWhatsAppTemplate(messageTemplate, entry.name, link);
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  async function handleDelete(entry: GuestEntry) {
    if (!window.confirm(`Hapus "${entry.name}" dari daftar tamu?`)) return;
    try {
      const res = await fetch(`/api/guest-list/${entry.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familySlug: family.slug }),
      });
      if (!res.ok) throw new Error();
      setEntries((current) => current.filter((e) => e.id !== entry.id));
    } catch {
      setFormError("Gagal menghapus nama. Coba lagi.");
    }
  }

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col px-6 py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Formulir Tamu Undangan
        </p>
        <h1 className="mt-2 text-2xl font-bold text-on-maroon">{family.label}</h1>
        <span className="rule-gild mt-4 block w-16" />
        {intro}
      </header>

      <form onSubmit={handleSubmit} className="card-stock mt-8 flex flex-col gap-6 rounded-[3px] p-7">
        <div>
          <label className={labelClass} htmlFor="guest-names">
            Nama Tamu
          </label>
          <textarea
            id="guest-names"
            value={namesText}
            onChange={(e) => {
              setNamesText(e.target.value);
              if (formError) setFormError(null);
            }}
            placeholder={"Contoh:\nBudi Santoso\nSiti Aminah\nAhmad Fauzi"}
            rows={5}
            className={`${fieldClass} resize-y`}
          />
          {nameLines.length > 0 && (
            <p className="mt-2 text-sm text-ink-soft">{nameLines.length} nama akan ditambahkan.</p>
          )}

          {hasSimilar && (
            <div className="notice-caution mt-3 rounded-xl px-4 py-3">
              <p className="text-base font-semibold text-gold-dark">
                ⚠ Sudah ada nama mirip:
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {Object.entries(similar).map(([line, matches]) => (
                  <li key={line} className="text-base text-ink">
                    {line}
                    <span className="block text-sm text-ink-soft">
                      mirip dengan {matches.map((m) => `${m.name} (${m.familyLabel})`).join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
              <label className="mt-3 flex items-center gap-3 text-base text-ink">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-gold-dark"
                  checked={confirmedDespiteSimilar}
                  onChange={(e) => setConfirmedText(e.target.checked ? namesText : null)}
                />
                Ini semua orang yang berbeda, tetap tambahkan
              </label>
            </div>
          )}
        </div>

        {formError && <p className="text-base font-medium text-red-600">{formError}</p>}
        {successMessage && !formError && (
          <p className="text-base font-medium text-sage-dark">✅ {successMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${buttonClass} bg-gold-dark text-paper hover:brightness-90`}
        >
          {isSubmitting ? "Menyimpan…" : "+ Tambah Tamu"}
        </button>
      </form>

      <MessageTemplateEditor value={messageTemplate} onChange={setMessageTemplate} />

      <section className="mt-10">
        <h2 className="text-lg font-bold text-on-maroon">
          Tamu yang Sudah Anda Tambahkan
        </h2>
        <p className="mt-1 text-sm text-on-maroon-soft">
          {entries.length} nama · {totalPeople} orang
        </p>

        {isLoadingList ? (
          <p className="mt-4 text-sm text-on-maroon-soft">Memuat…</p>
        ) : entries.length === 0 ? (
          <p className="mt-4 text-sm text-on-maroon-soft">Belum ada nama yang ditambahkan.</p>
        ) : (
          <ol className="mt-4 flex flex-col gap-3">
            {entries.map((entry, index) => (
              <li
                key={entry.id}
                className="card-stock flex items-center gap-3 rounded-[3px] px-4 py-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-dark text-sm font-bold text-paper">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-ink">{entry.name}</p>
                  {(entry.relation || entry.guestCount > 1) && (
                    <p className="mt-0.5 truncate text-xs text-ink-soft">
                      {[entry.relation, entry.guestCount > 1 ? `${entry.guestCount} orang` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>

                <GuestEntryActions
                  guestName={entry.name}
                  copied={copiedId === entry.id}
                  onShareWhatsApp={() => handleShareWhatsApp(entry)}
                  onCopyLink={() => handleCopyLink(entry)}
                  onDelete={() => handleDelete(entry)}
                />
              </li>
            ))}
          </ol>
        )}
      </section>

      {footer}
    </main>
  );
}
