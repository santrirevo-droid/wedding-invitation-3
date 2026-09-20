"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Check, ChevronLeft, ChevronRight, Pencil, X, Phone, MapPin, Calendar,
  Wallet, Loader2, Users2, PartyPopper, Plus, Trash2, Undo2, Redo2,
  Clock, BedDouble, Route, Plane, Link as LinkIcon, Search, ReceiptText,
} from "lucide-react";
import {
  CREAM, EDGE, GOLD, INK, LINE, MUTED, NAVY, NAVY_DARK, ROSE,
  PERSIAPAN_GLOBAL_STYLES, fmtIDR, fmtLongDate, fmtShortDate, iso,
} from "./theme";
import type { CalendarEvent, Settings, Task } from "./types";
import { AddBtn, Card, Field, Section } from "./ui";
import { useProgressData } from "./useProgressData";

/* ---------- Countdown ---------- */
function useCountdown(dateStr: string, timeStr: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  // explicit +07:00 (WIB) offset — without it, browsers parse this as the
  // viewer's own local timezone, so anyone outside WIB (or the server
  // region, which typically defaults to UTC) gets a countdown that's off
  // by the timezone difference
  const target = new Date(`${dateStr}T${timeStr || "08:00"}:00+07:00`).getTime();
  let diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000); diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);
  return { days, hours, mins, secs, past: target - now <= 0 };
}

/* ---------- Calendar ---------- */
function CalendarView({ weddingDate, events }: { weddingDate: string; events: Record<string, CalendarEvent[]> }) {
  const wedding = new Date(weddingDate + "T00:00:00");
  const [cursor, setCursor] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState<string | null>(null);

  const y = cursor.getFullYear(), m = cursor.getMonth();
  const first = new Date(y, m, 1);
  const startPad = (first.getDay() + 6) % 7; // Senin = 0
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const todayIso = iso(new Date());

  const cells: Array<Date | null> = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));

  const selectedEvents = selected ? events[selected] || [] : [];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCursor(new Date(y, m - 1, 1))} className="p-1.5 rounded-lg" aria-label="Bulan sebelumnya">
          <ChevronLeft size={16} style={{ color: MUTED }} />
        </button>
        <button
          onClick={() => setCursor(new Date(wedding.getFullYear(), wedding.getMonth(), 1))}
          className="pf-display text-base px-2 py-0.5 rounded-lg"
          style={{ color: NAVY }}
          title="Lompat ke bulan hari-H"
        >
          {cursor.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </button>
        <button onClick={() => setCursor(new Date(y, m + 1, 1))} className="p-1.5 rounded-lg" aria-label="Bulan berikutnya">
          <ChevronRight size={16} style={{ color: MUTED }} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, i) => (
          <div key={d} className="text-center pf-mono text-[10px] py-1"
            style={{ color: i >= 5 ? ROSE : MUTED }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const key = iso(d);
          const isWedding = key === weddingDate;
          const isToday = key === todayIso;
          const evs = events[key] || [];
          const isSel = selected === key;
          return (
            <button
              key={i}
              onClick={() => setSelected(isSel ? null : key)}
              className="aspect-square rounded-lg flex flex-col items-center justify-center relative"
              style={{
                background: isWedding ? GOLD : isSel ? NAVY : isToday ? "#F0EBE0" : "transparent",
                border: isToday && !isWedding && !isSel ? `1px solid ${GOLD}` : "1px solid transparent",
              }}
            >
              <span
                className="pf-mono text-xs"
                style={{ color: isWedding || isSel ? "#FFFFFF" : INK, fontWeight: isWedding ? 600 : 400 }}
              >
                {d.getDate()}
              </span>
              {isWedding ? (
                <PartyPopper size={9} color="#FFFFFF" style={{ marginTop: 1 }} />
              ) : evs.length > 0 ? (
                <div className="flex gap-0.5 mt-0.5">
                  {evs.slice(0, 3).map((e, k) => (
                    <span key={k} className="w-1 h-1 rounded-full" style={{ background: isSel ? "#FFFFFF" : e.color }} />
                  ))}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t" style={{ borderColor: LINE }}>
        {([["Tugas", NAVY], ["Kedatangan keluarga", ROSE], ["Hari-H", GOLD]] as const).map(([l, c]) => (
          <span key={l} className="flex items-center gap-1.5 text-[10px]" style={{ color: MUTED }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} /> {l}
          </span>
        ))}
      </div>

      {selected && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: LINE }}>
          <div className="text-xs font-medium mb-2" style={{ color: NAVY }}>{fmtLongDate(selected)}</div>
          {selectedEvents.length === 0 ? (
            <div className="text-xs" style={{ color: MUTED }}>
              Belum ada agenda di tanggal ini. Tetapkan tanggal pada tugas di checklist agar muncul di sini.
            </div>
          ) : (
            <div className="space-y-1.5">
              {selectedEvents.map((e, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: e.color }} />
                  <span style={{ color: INK, textDecoration: e.done ? "line-through" : "none" }}>{e.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

type OpenSectionKey = "calendar" | "checklist" | "rundown" | "arrivals" | "lodging" | "routes" | "vendors" | "budget";

/* ================= MAIN ================= */
export default function Persiapan() {
  const { data, loading, saving, loadError, past, future, undo, redo, commit, draft, persist, addRow, delRow, editRow } = useProgressData();
  const [taskQuery, setTaskQuery] = useState("");
  const [openSection, setOpenSection] = useState<Record<OpenSectionKey, boolean>>({
    calendar: true, checklist: true, rundown: true, arrivals: true,
    lodging: true, routes: true, vendors: false, budget: false,
  });
  const toggleSection = (k: OpenSectionKey) => setOpenSection(s => ({ ...s, [k]: !s[k] }));
  const [showSettings, setShowSettings] = useState(false);

  const isEditor = true; // akses terbuka — siapa pun bisa mengedit, sama seperti /daftar-tamu

  const requireEdit = (action: () => void) => action();
  const lockedPrompt = () => {};

  const newId = () => Math.random().toString(36).slice(2, 9);

  /* tasks (flat) */
  const toggleTask = (tid: string) => requireEdit(() => persist({
    ...data, tasks: data.tasks.map(t => t.id === tid ? { ...t, done: !t.done } : t),
  }));
  const editTask = (tid: string, field: keyof Task, value: string) => draft({
    tasks: data.tasks.map(t => t.id === tid ? { ...t, [field]: value } : t),
  });
  const addTask = () => requireEdit(() => {
    const today = iso(new Date());
    persist({ ...data, tasks: [...data.tasks, { id: newId(), text: "", pic: "", date: today, done: false }] });
  });
  const delTask = (tid: string) => requireEdit(() => persist({
    ...data, tasks: data.tasks.filter(t => t.id !== tid),
  }));

  const updateSettings = (f: keyof Settings, v: string | number) => draft({ settings: { ...data.settings, [f]: v } });
  const commitSettings = () => { persist(data); setShowSettings(false); };

  /* derived */
  const allTasks = data.tasks;
  const doneCount = allTasks.filter(t => t.done).length;
  const totalCount = allTasks.length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const cd = useCountdown(data.settings.weddingDate, data.settings.ceremonyTime);

  const sortedTasks = useMemo(() =>
    data.tasks.slice().sort((a, b) => {
      const da = a.date || "9999-99-99", db = b.date || "9999-99-99";
      return da === db ? 0 : da < db ? -1 : 1;
    }), [data.tasks]);

  const visibleTasks = useMemo(() => {
    const q = taskQuery.trim().toLowerCase();
    if (!q) return sortedTasks;
    return sortedTasks.filter(t =>
      (t.text || "").toLowerCase().includes(q) ||
      (t.pic || "").toLowerCase().includes(q) ||
      (t.date || "").includes(q)
    );
  }, [sortedTasks, taskQuery]);

  const budgetLow = data.budgetItems.reduce((s, b) => s + (b.low || 0), 0);
  const budgetHigh = data.budgetItems.reduce((s, b) => s + (b.high || 0), 0);
  const overBudget = budgetHigh > data.settings.totalBudget;

  const expenses = data.expenses || [];
  const spentTotal = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const paidTotal = expenses.filter(e => e.paid).reduce((s, e) => s + (e.amount || 0), 0);
  const unpaidTotal = spentTotal - paidTotal;
  const remaining = data.settings.totalBudget - spentTotal;
  const overSpent = spentTotal > data.settings.totalBudget;

  const calendarEvents = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    const push = (d: string, ev: CalendarEvent) => { if (!d) return; (map[d] = map[d] || []).push(ev); };
    allTasks.forEach(t => t.date && push(t.date, { label: t.text || "(tugas tanpa nama)", color: NAVY, done: t.done }));
    data.arrivals.forEach(a => a.date && push(a.date, { label: `Tiba: ${a.group || "keluarga"}${a.time ? " · " + a.time : ""}`, color: ROSE }));
    return map;
  }, [data, allTasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: CREAM }}>
        <Loader2 className="animate-spin" size={28} style={{ color: NAVY }} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: CREAM, fontFamily: "var(--font-persiapan-body), sans-serif", color: INK }}
    >
      <style>{PERSIAPAN_GLOBAL_STYLES}</style>

      {/* ---------- HERO + COUNTDOWN ---------- */}
      <div style={{ background: `linear-gradient(150deg, ${NAVY} 0%, ${NAVY_DARK} 100%)` }}>
        <div className="max-w-2xl mx-auto px-6 pt-10 pb-9">
          <div className="flex items-center justify-between mb-6">
            <span className="pf-mono text-xs tracking-widest uppercase" style={{ color: GOLD }}>
              Rencana Persiapan Pernikahan
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={undo}
                disabled={past.length === 0}
                className="p-2 rounded-full flex items-center justify-center transition"
                style={{ background: "rgba(255,255,255,0.08)", opacity: past.length === 0 ? 0.35 : 1 }}
                aria-label="Urungkan (undo)"
                title="Urungkan — Ctrl+Z"
              >
                <Undo2 size={14} color={GOLD} />
              </button>
              <button
                onClick={redo}
                disabled={future.length === 0}
                className="p-2 rounded-full flex items-center justify-center transition"
                style={{ background: "rgba(255,255,255,0.08)", opacity: future.length === 0 ? 0.35 : 1 }}
                aria-label="Ulangi (redo)"
                title="Ulangi — Ctrl+Shift+Z"
              >
                <Redo2 size={14} color={GOLD} />
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} aria-label="Ubah detail acara">
                <Pencil size={13} color={GOLD} />
              </button>
            </div>
          </div>

          <h1 className="pf-display text-4xl sm:text-5xl leading-tight text-white">
            {data.settings.nameFirst} <span style={{ color: GOLD }}>&</span> {data.settings.nameSecond}
          </h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm" style={{ color: "#D9DFE8" }}>
            <span className="flex items-center gap-1.5"><MapPin size={14} style={{ color: GOLD }} /> {data.settings.venue}</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} style={{ color: GOLD }} /> {fmtLongDate(data.settings.weddingDate)}
            </span>
            <span className="flex items-center gap-1.5"><Clock size={14} style={{ color: GOLD }} /> {data.settings.ceremonyTime} WIB</span>
          </div>

          {/* live countdown */}
          <div className="grid grid-cols-4 gap-2 mt-7">
            {([["Hari", cd.days], ["Jam", cd.hours], ["Menit", cd.mins], ["Detik", cd.secs]] as const).map(([label, val]) => (
              <div key={label} className="rounded-xl py-3 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="pf-mono text-2xl sm:text-3xl font-semibold" style={{ color: GOLD }}>
                  {String(val).padStart(2, "0")}
                </div>
                <div className="pf-mono text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "#A8B2C0" }}>{label}</div>
              </div>
            ))}
          </div>
          {cd.past && (
            <div className="text-center pf-mono text-xs mt-3" style={{ color: GOLD }}>Hari bahagia telah tiba 🎉</div>
          )}

          <div className="mt-6">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GOLD, transition: "width .4s ease" }} />
            </div>
            <div className="pf-mono text-xs mt-1.5" style={{ color: "#A8B2C0" }}>
              {doneCount}/{totalCount} tugas selesai · {pct}%
            </div>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="max-w-2xl mx-auto px-6 mt-4">
          <div className="text-sm rounded-lg px-4 py-3" style={{ background: "#FBEAEA", color: ROSE }}>
            Gagal memuat data tersimpan. Muat ulang halaman untuk mencoba lagi.
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs flex-1" style={{ color: MUTED }}>
            Halaman bersama untuk keluarga besar. Semua yang membuka tautan ini melihat progres yang sama.
            {saving && <span className="ml-2" style={{ color: GOLD }}>Menyimpan…</span>}
          </p>
          <button
            onClick={() => {
              const keys: OpenSectionKey[] = ["calendar", "checklist", "rundown", "arrivals", "lodging", "routes", "vendors", "budget"];
              const anyOpen = keys.some(k => openSection[k]);
              setOpenSection(Object.fromEntries(keys.map(k => [k, !anyOpen])) as Record<OpenSectionKey, boolean>);
            }}
            className="text-xs pf-mono shrink-0 ml-3 px-2.5 py-1 rounded-lg"
            style={{ color: NAVY, border: `1px solid ${EDGE}` }}
          >
            {Object.values(openSection).some(Boolean) ? "Tutup semua" : "Buka semua"}
          </button>
        </div>

        {/* ---------- KALENDER ---------- */}
        <Section icon={Calendar} title="Timeline Kalender" open={openSection.calendar} onToggle={() => toggleSection("calendar")}>
          <CalendarView weddingDate={data.settings.weddingDate} events={calendarEvents} />
        </Section>

        {/* ---------- CHECKLIST ---------- */}
        <Section icon={PartyPopper} title="Checklist Persiapan" open={openSection.checklist} onToggle={() => toggleSection("checklist")}
          badge={<span className="pf-mono text-xs" style={{ color: MUTED }}>{doneCount}/{totalCount}</span>}>

          {/* search + add bar */}
          <div className="flex gap-2 mb-3">
            <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl" style={{ background: "#FFF", border: `1px solid ${EDGE}` }}>
              <Search size={15} style={{ color: MUTED }} className="shrink-0" />
              <input
                value={taskQuery}
                onChange={(e) => setTaskQuery(e.target.value)}
                placeholder="Cari tugas, penanggung jawab, atau tanggal…"
                className="text-sm w-full bg-transparent"
                style={{ color: INK }}
              />
              {taskQuery && (
                <button onClick={() => setTaskQuery("")} aria-label="Hapus pencarian">
                  <X size={14} style={{ color: MUTED }} />
                </button>
              )}
            </div>
            {isEditor && (
              <button
                onClick={addTask}
                className="flex items-center gap-1.5 px-3.5 rounded-xl text-sm font-medium shrink-0"
                style={{ background: NAVY, color: "#FFF" }}
              >
                <Plus size={15} /> Tugas
              </button>
            )}
          </div>

          <Card className="overflow-hidden">
            {visibleTasks.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm" style={{ color: MUTED }}>
                {taskQuery ? `Tidak ada tugas yang cocok dengan "${taskQuery}".` : "Belum ada tugas."}
              </div>
            ) : (
              visibleTasks.map((task, idx) => {
                const prev = visibleTasks[idx - 1];
                const showDateHeader = !taskQuery && task.date && (!prev || prev.date !== task.date);
                return (
                  <div key={task.id}>
                    {showDateHeader && (
                      <div className="flex items-center gap-2 px-4 pt-3 pb-1" style={{ background: "#FBF8F2" }}>
                        <Calendar size={11} style={{ color: GOLD }} />
                        <span className="pf-mono text-[11px] font-semibold uppercase tracking-wide"
                          style={{ color: task.date === data.settings.weddingDate ? GOLD : NAVY }}>
                          {fmtLongDate(task.date)}
                          {task.date === data.settings.weddingDate && " · HARI-H"}
                        </span>
                      </div>
                    )}
                    <div className="task-row flex items-start gap-3 px-4 py-2.5 border-t" style={{ borderColor: LINE }}>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="task-check mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0"
                        style={{ border: `1.5px solid ${task.done ? GOLD : "#D3CBB8"}`, background: task.done ? GOLD : "transparent" }}
                        aria-label={task.done ? "Tandai belum selesai" : "Tandai selesai"}
                      >
                        {task.done && <Check size={13} color="#FFF" strokeWidth={3} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        {isEditor ? (
                          <input value={task.text} onChange={(e) => editTask(task.id, "text", e.target.value)} onBlur={commit}
                            placeholder="Tulis tugas…" className="text-sm w-full bg-transparent"
                            style={{ color: task.done ? MUTED : INK, textDecoration: task.done ? "line-through" : "none" }} />
                        ) : (
                          <div className="text-sm" style={{ color: task.done ? MUTED : INK, textDecoration: task.done ? "line-through" : "none" }}>
                            {task.text}
                          </div>
                        )}
                        <div className="flex gap-3 mt-1.5 items-center flex-wrap">
                          <Field value={task.pic} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                            onChange={(v) => editTask(task.id, "pic", v)} placeholder="Penanggung jawab…"
                            className="text-xs flex-1 min-w-[6rem] border-b py-0.5" style={{ color: GOLD, borderColor: LINE }} />

                          {/* chip tanggal — selalu terlihat, bisa diklik untuk edit */}
                          <label
                            className="relative flex items-center gap-1 px-2 py-1 rounded-md shrink-0"
                            style={{ background: "#F4F1EA", cursor: "pointer" }}
                            onClick={(e) => { if (!isEditor) { e.preventDefault(); lockedPrompt(); } }}
                          >
                            <Calendar size={11} style={{ color: GOLD }} className="shrink-0" />
                            <span className="text-xs pf-mono" style={{ color: task.date ? NAVY : MUTED }}>
                              {task.date ? fmtShortDate(task.date) : "atur tgl"}
                            </span>
                            {isEditor && (
                              <input
                                type="date"
                                value={task.date || ""}
                                onChange={(e) => editTask(task.id, "date", e.target.value)}
                                onBlur={commit}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                aria-label="Ubah tanggal tugas"
                              />
                            )}
                          </label>
                        </div>
                      </div>
                      {isEditor && (
                        <button onClick={() => delTask(task.id)} className="mt-0.5 p-1" aria-label="Hapus tugas">
                          <Trash2 size={13} style={{ color: MUTED }} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </Card>
          <div className="pf-mono text-xs mt-2 text-right" style={{ color: MUTED }}>
            {taskQuery ? `${visibleTasks.length} dari ${totalCount} tugas` : `${doneCount}/${totalCount} tugas selesai`}
          </div>
        </Section>

        {/* ---------- RUNDOWN ---------- */}
        <Section icon={Clock} title="Rundown Hari-H" open={openSection.rundown} onToggle={() => toggleSection("rundown")}>
          <Card>
            <div className="px-4 pt-4 pb-1">
              {data.rundown
                .slice()
                .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                .map((r, i, arr) => (
                  <div key={r.id} className="flex gap-3 pb-5">
                    {/* timeline rail */}
                    <div className={`flex flex-col items-center shrink-0 ${isEditor ? "w-24" : "w-16"}`}>
                      {isEditor ? (
                        <input
                          type="time"
                          value={r.time || ""}
                          onChange={(e) => editRow("rundown", r.id, "time", e.target.value)}
                          onBlur={commit}
                          className="pf-mono text-sm w-full px-1.5 py-1 rounded-md border text-center"
                          style={{ color: NAVY, borderColor: EDGE, background: "#FFF" }}
                        />
                      ) : (
                        <span
                          className="pf-mono text-sm font-semibold px-2 py-1 rounded-md w-full text-center"
                          style={{ color: NAVY, background: "#F4F1EA", letterSpacing: "0.02em" }}
                        >
                          {r.time || "–"}
                        </span>
                      )}
                      <span className="w-2.5 h-2.5 rounded-full mt-2 shrink-0" style={{ background: GOLD, border: `2px solid ${NAVY}` }} />
                      {i < arr.length - 1 && <span className="w-px flex-1 mt-1" style={{ background: EDGE }} />}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <Field value={r.activity} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("rundown", r.id, "activity", v)} placeholder="Nama acara"
                        className="text-sm w-full font-medium" style={{ color: INK }} />
                      <Field value={r.note} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("rundown", r.id, "note", v)} placeholder="Catatan…"
                        className="text-xs w-full mt-0.5" style={{ color: MUTED }} />
                      {(isEditor || r.pic) && (
                        <div className="flex items-center gap-1 mt-1">
                          <Users2 size={10} style={{ color: GOLD }} className="shrink-0" />
                          <Field value={r.pic} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                            onChange={(v) => editRow("rundown", r.id, "pic", v)} placeholder="Penanggung jawab…"
                            className="text-xs w-full" style={{ color: GOLD }} />
                        </div>
                      )}
                    </div>

                    {isEditor && (
                      <button onClick={() => delRow("rundown", r.id)} className="p-1 h-fit" aria-label="Hapus item rundown">
                        <Trash2 size={13} style={{ color: MUTED }} />
                      </button>
                    )}
                  </div>
                ))}
            </div>
            {isEditor && (
              <AddBtn onClick={() => addRow("rundown", { time: "12:00", activity: "", note: "", pic: "" })} label="Tambah acara" />
            )}
          </Card>
        </Section>

        {/* ---------- KEDATANGAN KELUARGA ---------- */}
        <Section icon={Plane} title="Kedatangan Keluarga Besar" open={openSection.arrivals} onToggle={() => toggleSection("arrivals")}>
          <Card>
            <div className="divide-y" style={{ borderColor: LINE }}>
              {data.arrivals.map(a => (
                <div key={a.id} className="p-4">
                  <div className="flex items-start gap-2">
                    <Field value={a.group} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                      onChange={(v) => editRow("arrivals", a.id, "group", v)} placeholder="Nama rombongan"
                      className="text-sm font-medium flex-1" style={{ color: INK }} />
                    {isEditor && (
                      <button onClick={() => delRow("arrivals", a.id)} className="p-1" aria-label="Hapus rombongan">
                        <Trash2 size={13} style={{ color: MUTED }} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2.5">
                    {([
                      ["Dari", "from", "text", "Kota asal"],
                      ["Jumlah orang", "count", "text", "cth. 12 orang"],
                    ] as const).map(([label, key, type, ph]) => (
                      <div key={key}>
                        <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>{label}</div>
                        <Field value={a[key]} editable={isEditor} onLocked={lockedPrompt} onBlur={commit} type={type}
                          onChange={(v) => editRow("arrivals", a.id, key, v)} placeholder={ph}
                          className="text-sm w-full border-b py-0.5" style={{ color: INK, borderColor: LINE }} />
                      </div>
                    ))}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Tanggal tiba</div>
                      <Field value={a.date} editable={isEditor} onLocked={lockedPrompt} onBlur={commit} type="date"
                        onChange={(v) => editRow("arrivals", a.id, "date", v)}
                        className="text-sm w-full border-b py-0.5 pf-mono" style={{ color: ROSE, borderColor: LINE }} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Jam tiba</div>
                      <Field value={a.time} editable={isEditor} onLocked={lockedPrompt} onBlur={commit} type="time"
                        onChange={(v) => editRow("arrivals", a.id, "time", v)}
                        className="text-sm w-full border-b py-0.5 pf-mono" style={{ color: ROSE, borderColor: LINE }} />
                    </div>
                    <div className="col-span-2">
                      <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Transportasi</div>
                      <Field value={a.transport} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("arrivals", a.id, "transport", v)} placeholder="cth. Pesawat via Bandara Supadio"
                        className="text-sm w-full border-b py-0.5" style={{ color: INK, borderColor: LINE }} />
                    </div>
                    <div className="col-span-2">
                      <Field value={a.note} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("arrivals", a.id, "note", v)} placeholder="Catatan (penjemputan, dll)…"
                        className="text-xs w-full" style={{ color: MUTED }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {isEditor && (
              <AddBtn onClick={() => addRow("arrivals", { group: "", from: "", date: "", time: "", transport: "", count: "", note: "" })} label="Tambah rombongan" />
            )}
          </Card>
        </Section>

        {/* ---------- PENGINAPAN ---------- */}
        <Section icon={BedDouble} title="Tempat Menginap" open={openSection.lodging} onToggle={() => toggleSection("lodging")}>
          <Card>
            <div className="divide-y" style={{ borderColor: LINE }}>
              {data.lodging.map(l => (
                <div key={l.id} className="p-4">
                  <div className="flex items-start gap-2">
                    <Field value={l.name} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                      onChange={(v) => editRow("lodging", l.id, "name", v)} placeholder="Nama hotel / rumah"
                      className="text-sm font-medium flex-1" style={{ color: INK }} />
                    {isEditor && (
                      <button onClick={() => delRow("lodging", l.id)} className="p-1" aria-label="Hapus penginapan">
                        <Trash2 size={13} style={{ color: MUTED }} />
                      </button>
                    )}
                  </div>
                  <Field value={l.address} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                    onChange={(v) => editRow("lodging", l.id, "address", v)} placeholder="Alamat"
                    className="text-xs w-full mt-1" style={{ color: MUTED }} />
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2.5">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Untuk rombongan</div>
                      <Field value={l.forGroup} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("lodging", l.id, "forGroup", v)} placeholder="cth. Keluarga pria"
                        className="text-sm w-full border-b py-0.5" style={{ color: INK, borderColor: LINE }} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Jumlah kamar</div>
                      <Field value={l.rooms} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("lodging", l.id, "rooms", v)} placeholder="cth. 5 kamar"
                        className="text-sm w-full border-b py-0.5" style={{ color: INK, borderColor: LINE }} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Telepon</div>
                      <Field value={l.phone} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("lodging", l.id, "phone", v)} placeholder="No. telepon"
                        className="text-sm w-full border-b py-0.5 pf-mono" style={{ color: GOLD, borderColor: LINE }} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Link peta</div>
                      {isEditor ? (
                        <Field value={l.mapUrl} editable onBlur={commit}
                          onChange={(v) => editRow("lodging", l.id, "mapUrl", v)} placeholder="Tempel link peta"
                          className="text-sm w-full border-b py-0.5" style={{ color: NAVY, borderColor: LINE }} />
                      ) : l.mapUrl ? (
                        <a href={l.mapUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm flex items-center gap-1 border-b py-0.5" style={{ color: NAVY, borderColor: LINE }}>
                          <LinkIcon size={11} /> Buka peta
                        </a>
                      ) : (
                        <div className="text-sm border-b py-0.5" style={{ color: MUTED, borderColor: LINE }}>–</div>
                      )}
                    </div>
                  </div>
                  <Field value={l.note} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                    onChange={(v) => editRow("lodging", l.id, "note", v)} placeholder="Catatan (harga, check-in, dll)…"
                    className="text-xs w-full mt-2" style={{ color: MUTED }} />
                </div>
              ))}
            </div>
            {isEditor && (
              <AddBtn onClick={() => addRow("lodging", { name: "", address: "", phone: "", rooms: "", forGroup: "", mapUrl: "", note: "" })} label="Tambah penginapan" />
            )}
          </Card>
        </Section>

        {/* ---------- RUTE ---------- */}
        <Section icon={Route} title="Rute & Transportasi" open={openSection.routes} onToggle={() => toggleSection("routes")}>
          <Card>
            <div className="divide-y" style={{ borderColor: LINE }}>
              {data.routes.map(r => (
                <div key={r.id} className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <Field value={r.from} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("routes", r.id, "from", v)} placeholder="Dari"
                        className="text-sm w-full font-medium" style={{ color: INK }} />
                      <div className="flex items-center gap-1.5 my-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
                        <span className="flex-1 h-px" style={{ background: EDGE }} />
                        <ChevronRight size={12} style={{ color: GOLD }} />
                      </div>
                      <Field value={r.to} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("routes", r.id, "to", v)} placeholder="Ke"
                        className="text-sm w-full font-medium" style={{ color: INK }} />
                    </div>
                    {isEditor && (
                      <button onClick={() => delRow("routes", r.id)} className="p-1" aria-label="Hapus rute">
                        <Trash2 size={13} style={{ color: MUTED }} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Moda</div>
                      <Field value={r.mode} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("routes", r.id, "mode", v)} placeholder="cth. Mobil"
                        className="text-sm w-full border-b py-0.5" style={{ color: INK, borderColor: LINE }} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Estimasi waktu</div>
                      <Field value={r.duration} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("routes", r.id, "duration", v)} placeholder="cth. 2 jam"
                        className="text-sm w-full border-b py-0.5 pf-mono" style={{ color: GOLD, borderColor: LINE }} />
                    </div>
                    <div className="col-span-2">
                      <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Link peta</div>
                      {isEditor ? (
                        <Field value={r.mapUrl} editable onBlur={commit}
                          onChange={(v) => editRow("routes", r.id, "mapUrl", v)} placeholder="Tempel link peta"
                          className="text-sm w-full border-b py-0.5" style={{ color: NAVY, borderColor: LINE }} />
                      ) : r.mapUrl ? (
                        <a href={r.mapUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm flex items-center gap-1 border-b py-0.5" style={{ color: NAVY, borderColor: LINE }}>
                          <LinkIcon size={11} /> Buka rute di peta
                        </a>
                      ) : (
                        <div className="text-sm border-b py-0.5" style={{ color: MUTED, borderColor: LINE }}>–</div>
                      )}
                    </div>
                  </div>
                  <Field value={r.note} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                    onChange={(v) => editRow("routes", r.id, "note", v)} placeholder="Catatan…"
                    className="text-xs w-full mt-2" style={{ color: MUTED }} />
                </div>
              ))}
            </div>
            {isEditor && (
              <AddBtn onClick={() => addRow("routes", { from: "", to: "", mode: "", duration: "", mapUrl: "", note: "" })} label="Tambah rute" />
            )}
          </Card>
        </Section>

        {/* ---------- VENDOR ---------- */}
        <Section icon={Users2} title="Kontak Vendor" open={openSection.vendors} onToggle={() => toggleSection("vendors")}>
          <Card>
            <div className="divide-y" style={{ borderColor: LINE }}>
              {data.vendors.map(v => (
                <div key={v.id} className="p-4">
                  <div className="flex items-start gap-2">
                    <Field value={v.category} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                      onChange={(val) => editRow("vendors", v.id, "category", val)} placeholder="Kategori vendor"
                      className="text-sm font-medium flex-1 min-w-0" style={{ color: NAVY }} />
                    {isEditor && (
                      <button onClick={() => delRow("vendors", v.id)} className="p-1 shrink-0" aria-label="Hapus vendor">
                        <Trash2 size={13} style={{ color: MUTED }} />
                      </button>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Nama</div>
                    <Field value={v.name} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                      onChange={(val) => editRow("vendors", v.id, "name", val)} placeholder="Nama vendor"
                      className="text-sm w-full border-b py-0.5" style={{ color: INK, borderColor: LINE }} />
                  </div>
                  <div className="mt-2">
                    <div className="text-[10px] uppercase tracking-wide pf-mono" style={{ color: MUTED }}>Telepon</div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} style={{ color: MUTED }} className="shrink-0" />
                      <Field value={v.phone} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(val) => editRow("vendors", v.id, "phone", val)} placeholder="No. telepon"
                        className="text-sm w-full min-w-0 border-b py-0.5 pf-mono" style={{ color: GOLD, borderColor: LINE }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {isEditor && <AddBtn onClick={() => addRow("vendors", { category: "", name: "", phone: "" })} label="Tambah vendor" />}
          </Card>
        </Section>

        {/* ---------- ANGGARAN (paling bawah) ---------- */}
        <Section icon={Wallet} title="Anggaran" open={openSection.budget} onToggle={() => toggleSection("budget")}>
          <Card className="p-5">
            <div className="flex justify-between items-baseline mb-3">
              <span className="pf-mono text-2xl font-semibold" style={{ color: NAVY }}>{fmtIDR(data.settings.totalBudget)}</span>
              <span className="text-xs" style={{ color: MUTED }}>total anggaran</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "#F0EBE0" }}>
              <div className="h-full rounded-full" style={{
                width: `${Math.min(100, (budgetHigh / (data.settings.totalBudget || 1)) * 100)}%`,
                background: overBudget ? ROSE : `linear-gradient(90deg, ${NAVY}, ${GOLD})`,
              }} />
            </div>
            <div className="flex justify-between pf-mono text-xs" style={{ color: MUTED }}>
              <span>Estimasi seluruh pos</span>
              <span style={{ color: overBudget ? ROSE : NAVY }}>{fmtIDR(budgetLow)} – {fmtIDR(budgetHigh)}</span>
            </div>
            {overBudget && (
              <div className="text-xs mt-2 rounded-lg px-3 py-2" style={{ background: "#FBEAEA", color: ROSE }}>
                Estimasi tertinggi melebihi total anggaran sebesar {fmtIDR(budgetHigh - data.settings.totalBudget)}. Pangkas pos yang paling tidak terlihat tamu.
              </div>
            )}

            <div className="mt-4">
              <div className="pf-mono text-[11px] uppercase tracking-wide mb-1" style={{ color: MUTED }}>Estimasi per pos</div>
                {data.budgetItems.map(b => (
                  <div key={b.id} className="flex items-start gap-2 py-2.5 border-t" style={{ borderColor: LINE }}>
                    <div className="flex-1 min-w-0">
                      <Field value={b.pos} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("budgetItems", b.id, "pos", v)} placeholder="Nama pos"
                        className="text-sm w-full" style={{ color: INK }} />
                      <Field value={b.note} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("budgetItems", b.id, "note", v)} placeholder="Catatan…"
                        className="text-xs w-full" style={{ color: MUTED }} />
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Field type="number" value={b.low} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("budgetItems", b.id, "low", Number(v) || 0)}
                        className="pf-mono text-xs w-20 text-right border-b py-0.5"
                        style={{ color: GOLD, borderColor: isEditor ? LINE : "transparent" }} />
                      <span className="text-xs" style={{ color: MUTED }}>–</span>
                      <Field type="number" value={b.high} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("budgetItems", b.id, "high", Number(v) || 0)}
                        className="pf-mono text-xs w-20 text-right border-b py-0.5"
                        style={{ color: GOLD, borderColor: isEditor ? LINE : "transparent" }} />
                    </div>
                    {isEditor && (
                      <button onClick={() => delRow("budgetItems", b.id)} className="mt-1 p-1" aria-label="Hapus pos anggaran">
                        <Trash2 size={13} style={{ color: MUTED }} />
                      </button>
                    )}
                  </div>
                ))}
                {isEditor && (
                  <button onClick={() => addRow("budgetItems", { pos: "", low: 0, high: 0, note: "" })}
                    className="flex items-center gap-1.5 text-xs mt-2 pt-3 border-t w-full" style={{ color: NAVY, borderColor: LINE }}>
                    <Plus size={13} /> Tambah pos anggaran
                  </button>
                )}
              </div>
          </Card>

          {/* ---- Pengeluaran riil ---- */}
          <Card className="p-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <ReceiptText size={15} style={{ color: NAVY }} />
              <h3 className="pf-display text-base" style={{ color: NAVY }}>Pengeluaran Riil</h3>
            </div>

            {/* ringkasan */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="rounded-lg p-2.5 text-center" style={{ background: "#F4F1EA" }}>
                <div className="pf-mono text-sm font-semibold" style={{ color: NAVY }}>{fmtIDR(spentTotal)}</div>
                <div className="pf-mono text-[9px] uppercase tracking-wide mt-0.5" style={{ color: MUTED }}>Total keluar</div>
              </div>
              <div className="rounded-lg p-2.5 text-center" style={{ background: "#F4F1EA" }}>
                <div className="pf-mono text-sm font-semibold" style={{ color: unpaidTotal > 0 ? ROSE : "#4B7B5A" }}>{fmtIDR(unpaidTotal)}</div>
                <div className="pf-mono text-[9px] uppercase tracking-wide mt-0.5" style={{ color: MUTED }}>Belum lunas</div>
              </div>
              <div className="rounded-lg p-2.5 text-center" style={{ background: overSpent ? "#FBEAEA" : "#EAF3EC" }}>
                <div className="pf-mono text-sm font-semibold" style={{ color: overSpent ? ROSE : "#4B7B5A" }}>{fmtIDR(Math.abs(remaining))}</div>
                <div className="pf-mono text-[9px] uppercase tracking-wide mt-0.5" style={{ color: MUTED }}>{overSpent ? "Lewat budget" : "Sisa budget"}</div>
              </div>
            </div>

            {/* bar realisasi vs anggaran */}
            <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: "#F0EBE0" }}>
              <div className="h-full rounded-full" style={{
                width: `${Math.min(100, (spentTotal / (data.settings.totalBudget || 1)) * 100)}%`,
                background: overSpent ? ROSE : `linear-gradient(90deg, ${NAVY}, ${GOLD})`,
              }} />
            </div>
            <div className="flex justify-between pf-mono text-[11px] mb-3" style={{ color: MUTED }}>
              <span>{Math.round((spentTotal / (data.settings.totalBudget || 1)) * 100)}% dari anggaran terpakai</span>
              <span>dari {fmtIDR(data.settings.totalBudget)}</span>
            </div>

            {/* daftar item */}
            <div>
              {expenses.length === 0 && (
                <div className="text-xs py-3 text-center" style={{ color: MUTED }}>Belum ada pengeluaran tercatat.</div>
              )}
              {expenses.map(e => (
                <div key={e.id} className="flex items-start gap-2 py-2.5 border-t" style={{ borderColor: LINE }}>
                  <button
                    onClick={() => persist({ ...data, expenses: data.expenses.map(x => x.id === e.id ? { ...x, paid: !x.paid } : x) })}
                    className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ border: `1.5px solid ${e.paid ? "#4B7B5A" : "#D3CBB8"}`, background: e.paid ? "#4B7B5A" : "transparent" }}
                    aria-label={e.paid ? "Tandai belum lunas" : "Tandai lunas"}
                    title={e.paid ? "Lunas" : "Belum lunas"}
                  >
                    {e.paid && <Check size={12} color="#FFF" strokeWidth={3} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <Field value={e.item} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                      onChange={(v) => editRow("expenses", e.id, "item", v)} placeholder="Nama pengeluaran"
                      className="text-sm w-full" style={{ color: INK }} />
                    <div className="flex gap-2 items-center flex-wrap mt-0.5">
                      <Field value={e.category} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("expenses", e.id, "category", v)} placeholder="Kategori"
                        className="text-xs" style={{ color: GOLD, width: "7rem" }} />
                      <label className="relative flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "#F4F1EA", cursor: "pointer" }}>
                        <Calendar size={10} style={{ color: GOLD }} />
                        <span className="text-[11px] pf-mono" style={{ color: e.date ? NAVY : MUTED }}>
                          {e.date ? fmtShortDate(e.date) : "tgl"}
                        </span>
                        <input type="date" value={e.date || ""} onChange={(ev) => editRow("expenses", e.id, "date", ev.target.value)}
                          onBlur={commit} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Tanggal pengeluaran" />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-0.5">
                      <span className="text-[11px]" style={{ color: MUTED }}>Rp</span>
                      <Field type="number" value={e.amount} editable={isEditor} onLocked={lockedPrompt} onBlur={commit}
                        onChange={(v) => editRow("expenses", e.id, "amount", Number(v) || 0)} placeholder="0"
                        className="pf-mono text-sm w-24 text-right border-b py-0.5" style={{ color: INK, borderColor: LINE }} />
                    </div>
                    <span className="pf-mono text-[9px] mt-1" style={{ color: e.paid ? "#4B7B5A" : ROSE }}>
                      {e.paid ? "lunas" : "belum lunas"}
                    </span>
                  </div>
                  {isEditor && (
                    <button onClick={() => delRow("expenses", e.id)} className="mt-0.5 p-1" aria-label="Hapus pengeluaran">
                      <Trash2 size={13} style={{ color: MUTED }} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => addRow("expenses", { item: "", category: "", amount: 0, date: iso(new Date()), paid: false, note: "" })}
              className="flex items-center gap-1.5 text-xs mt-2 pt-3 border-t w-full" style={{ color: NAVY, borderColor: LINE }}>
              <Plus size={13} /> Tambah pengeluaran
            </button>
          </Card>
        </Section>

        <p className="text-center text-xs mt-12" style={{ color: MUTED }}>
          Untuk {data.settings.nameFirst} & {data.settings.nameSecond} — semoga lancar sampai hari-H ✨
        </p>
      </div>

      {/* ---------- SETTINGS MODAL ---------- */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 overflow-y-auto" style={{ background: "rgba(19,37,57,.5)" }}>
          <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 my-auto" style={{ background: "#FFF" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="pf-display text-lg" style={{ color: NAVY }}>Ubah Detail Acara</h3>
              <button onClick={() => setShowSettings(false)} aria-label="Tutup"><X size={18} style={{ color: MUTED }} /></button>
            </div>
            <div className="space-y-4">
              {([
                ["Nama mempelai (tampil pertama)", "nameFirst", "text"],
                ["Nama mempelai (tampil kedua)", "nameSecond", "text"],
                ["Tanggal pernikahan", "weddingDate", "date"],
                ["Jam mulai acara", "ceremonyTime", "time"],
                ["Venue", "venue", "text"],
                ["Total anggaran (Rp)", "totalBudget", "number"],
              ] as const).map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-xs" style={{ color: MUTED }}>{label}</label>
                  <input
                    type={type}
                    value={data.settings[key]}
                    onChange={(e) => updateSettings(key, type === "number" ? Number(e.target.value) : e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm border"
                    style={{ borderColor: "#E4DDCE" }}
                  />
                </div>
              ))}
            </div>
            <button onClick={commitSettings} className="w-full mt-6 py-2.5 rounded-lg text-sm font-medium" style={{ background: NAVY, color: "#FFF" }}>
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
