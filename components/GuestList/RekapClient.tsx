"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

type DuplicateCluster = {
  entries: { id: string; name: string; familyLabel: string }[];
};

export default function RekapClient() {
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [clusters, setClusters] = useState<DuplicateCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messageTemplate, setMessageTemplate] = useWhatsAppTemplate();

  async function handleCopyLink(entry: GuestEntry) {
    const link = buildInviteLink(window.location.origin, entry.name);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId((current) => (current === entry.id ? null : current)), 2000);
    } catch {
      // clipboard access failure — rare, not worth replacing the whole page for
    }
  }

  function handleShareWhatsApp(entry: GuestEntry) {
    const link = buildInviteLink(window.location.origin, entry.name);
    const message = fillWhatsAppTemplate(messageTemplate, entry.name, link);
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/guest-list/rekap", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Gagal memuat data.");
          return;
        }
        setEntries(data.entries ?? []);
        setClusters(data.duplicateClusters ?? []);
      } catch {
        if (!cancelled) setError("Gagal memuat data. Periksa koneksi Anda.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <p className="text-base text-on-maroon-soft">Memuat…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-2xl font-bold text-on-maroon">Rekap Daftar Tamu</h1>
        <p className="mt-4 text-base font-medium text-red-700">{error}</p>
      </main>
    );
  }

  const totalPeople = entries.reduce((sum, entry) => sum + entry.guestCount, 0);

  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        Ringkasan
      </p>
      <h1 className="mt-2 text-2xl font-bold text-on-maroon">Rekap Daftar Tamu</h1>
      <span className="rule-gild mt-4 block w-16" />
      <p className="mt-4 text-base text-on-maroon-soft">
        {entries.length} nama · {totalPeople} orang
      </p>

      <MessageTemplateEditor value={messageTemplate} onChange={setMessageTemplate} />

      {clusters.length > 0 && (
        <section className="notice-caution mt-8 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gold-dark">
            ⚠ Kemungkinan Nama Duplikat ({clusters.length})
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Periksa apakah nama-nama ini merujuk ke orang yang sama.
          </p>
          <ul className="mt-4 flex flex-col gap-4">
            {clusters.map((cluster, i) => (
              <li key={i} className="rounded-xl bg-paper p-4">
                <ul className="flex flex-col gap-1">
                  {cluster.entries.map((entry) => (
                    <li key={entry.id} className="text-base text-ink">
                      {entry.name}{" "}
                      <span className="text-sm text-ink-soft">— {entry.familyLabel}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ol className="mt-10 flex flex-col gap-3">
        {entries.map((entry, index) => (
          <li key={entry.id} className="card-stock flex items-center gap-3 rounded-[3px] px-4 py-3">
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
            />
          </li>
        ))}
      </ol>

      <p className="mt-12 text-sm text-on-maroon-soft">
        Untuk menghapus atau mengubah nama, buka{" "}
        <Link href="/daftar-tamu" className="underline decoration-accent/60 underline-offset-4">
          /daftar-tamu
        </Link>
        .
      </p>
    </main>
  );
}
