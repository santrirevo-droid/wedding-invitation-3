"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { CREAM, EDGE, GOLD, INK, LINE, MUTED, NAVY, PERSIAPAN_GLOBAL_STYLES, fmtLongDate, fmtShortDate } from "./theme";
import { Field } from "./ui";
import { useProgressData } from "./useProgressData";

// pengaman ringan saja (bukan keamanan sungguhan — data di baliknya tetap
// lewat endpoint tanpa auth) supaya tidak ke-edit tidak sengaja saat dibuka
const EDIT_PASSWORD = "0000";

export default function Itinerary() {
  const { data, loading, saving, loadError, commit, addRow, delRow, editRow } = useProgressData();
  // terkunci (read-only) secara default — tombol "Edit" di atas membukanya,
  // supaya teks tidak berubah tidak sengaja saat sekadar dibaca
  const [isEditor, setIsEditor] = useState(false);
  const lockedPrompt = () => {};

  const handleEditToggle = () => {
    if (isEditor) {
      setIsEditor(false);
      return;
    }
    const input = window.prompt("Masukkan password untuk mode edit:");
    if (input === null) return;
    if (input === EDIT_PASSWORD) setIsEditor(true);
    else window.alert("Password salah.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: CREAM }}>
        <Loader2 className="animate-spin" size={28} style={{ color: NAVY }} />
      </div>
    );
  }

  const steps = data.familyItinerary
    .slice()
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  // kelompokkan per tanggal supaya tiap hari punya tombol "+ Tambah
  // kegiatan" sendiri, bukan satu tombol global di bawah semuanya
  const groups: { date: string; items: typeof steps }[] = [];
  for (const step of steps) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === step.date) lastGroup.items.push(step);
    else groups.push({ date: step.date, items: [step] });
  }

  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: CREAM, fontFamily: "var(--font-persiapan-body), sans-serif", color: INK }}
    >
      <style>{PERSIAPAN_GLOBAL_STYLES}</style>

      <div className="max-w-2xl mx-auto px-6 pt-10">
        <Link
          href="/persiapan"
          className="pf-mono inline-flex items-center gap-1 text-xs uppercase tracking-widest"
          style={{ color: MUTED }}
        >
          <ChevronLeft size={13} /> Rencana Persiapan
        </Link>
        <div className="flex items-center justify-between gap-3 mt-2">
          <h1 className="pf-display text-2xl" style={{ color: NAVY }}>Itinerary Keluarga</h1>
          <button
            onClick={handleEditToggle}
            className="pf-mono inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
            style={
              isEditor
                ? { color: "#FFF", background: NAVY }
                : { color: NAVY, border: `1px solid ${EDGE}`, background: "#FFF" }
            }
          >
            <Pencil size={12} /> {isEditor ? "Selesai" : "Edit"}
          </button>
        </div>
        {saving && <p className="pf-mono text-xs mt-1" style={{ color: GOLD }}>Menyimpan…</p>}
      </div>

      {loadError && (
        <div className="max-w-2xl mx-auto px-6 mt-4">
          <div className="text-sm rounded-lg px-4 py-3" style={{ background: "#FBEAEA", color: "#C1666B" }}>
            Gagal memuat data tersimpan. Muat ulang halaman untuk mencoba lagi.
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 mt-8">
        {groups.length === 0 ? (
          <p className="text-sm" style={{ color: MUTED }}>Belum ada jadwal.</p>
        ) : (
          groups.map((group) => (
            <div key={group.date || "no-date"} className="mt-6 first:mt-0">
              <div
                className="pf-mono inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                style={{ color: GOLD, background: "rgba(184,152,90,0.12)", border: `1px solid ${GOLD}` }}
              >
                {fmtLongDate(group.date) || "Tanggal belum diatur"}
              </div>

              {group.items.map((step) => (
                <div key={step.id} className="flex items-start gap-3 py-3 border-t" style={{ borderColor: LINE }}>
                  <div className="shrink-0 w-24 pt-0.5 flex flex-col gap-1">
                    {isEditor ? (
                      <input
                        type="time"
                        value={step.time || ""}
                        onChange={(e) => editRow("familyItinerary", step.id, "time", e.target.value)}
                        onBlur={commit}
                        className="pf-mono text-sm font-semibold w-full rounded-md border px-1.5 py-1 text-center"
                        style={{ color: NAVY, borderColor: EDGE, background: "#FFF" }}
                      />
                    ) : (
                      <span className="pf-mono text-sm font-semibold" style={{ color: NAVY }}>{step.time || "–"}</span>
                    )}
                    {isEditor ? (
                      <input
                        type="date"
                        value={step.date || ""}
                        onChange={(e) => editRow("familyItinerary", step.id, "date", e.target.value)}
                        onBlur={commit}
                        className="pf-mono text-[10px] w-full rounded-md border px-1 py-0.5 text-center"
                        style={{ color: MUTED, borderColor: EDGE, background: "#FFF" }}
                      />
                    ) : (
                      <span className="pf-mono text-[10px]" style={{ color: MUTED }}>{fmtShortDate(step.date) || "–"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Field value={step.activity} editable={isEditor} onLocked={lockedPrompt} onBlur={commit} multiline
                      onChange={(v) => editRow("familyItinerary", step.id, "activity", v)} placeholder="cth. Berangkat dari Surabaya"
                      className={`text-sm w-full font-medium leading-snug ${isEditor ? "border-b py-0.5" : ""}`}
                      style={{ color: INK, borderColor: LINE }} />
                    {(isEditor || step.note) && (
                      <Field value={step.note} editable={isEditor} onLocked={lockedPrompt} onBlur={commit} multiline
                        onChange={(v) => editRow("familyItinerary", step.id, "note", v)} placeholder="Catatan…"
                        className={`text-xs w-full mt-1.5 leading-snug ${isEditor ? "border-b py-0.5" : ""}`}
                        style={{ color: MUTED, borderColor: LINE }} />
                    )}
                  </div>
                  {isEditor && (
                    <button onClick={() => delRow("familyItinerary", step.id)} className="p-1" aria-label="Hapus jadwal">
                      <Trash2 size={13} style={{ color: MUTED }} />
                    </button>
                  )}
                </div>
              ))}

              {isEditor && (
                <button
                  onClick={() => addRow("familyItinerary", { date: group.date, time: "", activity: "", note: "" })}
                  className="flex items-center gap-1.5 text-xs mt-2 pt-2 border-t"
                  style={{ color: NAVY, borderColor: LINE }}
                >
                  <Plus size={13} /> Tambah kegiatan
                </button>
              )}
            </div>
          ))
        )}

        {isEditor && (
          <button
            onClick={() => addRow("familyItinerary", { date: groups[groups.length - 1]?.date || "", time: "", activity: "", note: "" })}
            className="pf-mono flex items-center gap-1.5 text-xs mt-6"
            style={{ color: MUTED }}
          >
            <Plus size={13} /> Tambah hari baru
          </button>
        )}
      </div>
    </div>
  );
}
