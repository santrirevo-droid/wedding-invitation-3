"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_DATA } from "./defaultData";
import type { ListKey, ProgressData } from "./types";

/** GET/POST /api/progress — a single shared JSON doc, same no-auth
 * "everyone with the link can edit" model as /daftar-tamu. Both the main
 * /persiapan dashboard and the standalone /persiapan/itinerary page read
 * and write through this same hook, so edits in one show up in the other. */
const PROGRESS_ENDPOINT = "/api/progress";

/**
 * Loads the shared planning doc, keeps it saved (debounced) on every
 * change, and provides generic + task-specific mutators plus undo/redo.
 * Shared by every /persiapan page so they all read/write the same data.
 */
export function useProgressData() {
  const [data, setData] = useState<ProgressData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [past, setPast] = useState<ProgressData[]>([]);
  const [future, setFuture] = useState<ProgressData[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  const lastCommitted = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(PROGRESS_ENDPOINT);
        if (!res.ok) throw new Error("failed to load");
        const json = (await res.json()) as { data: Partial<ProgressData> | null };
        if (json.data) {
          const parsed = json.data;
          const merged: ProgressData = {
            ...DEFAULT_DATA,
            ...parsed,
            settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
          };
          lastCommitted.current = merged;
          dataRef.current = merged;
          setData(merged);
        } else {
          lastCommitted.current = DEFAULT_DATA;
          await fetch(PROGRESS_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(DEFAULT_DATA),
          });
        }
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scheduleSave = useCallback((next: ProgressData) => {
    setSaving(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await fetch(PROGRESS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });
      } catch { /* retry on next change */ }
      finally { setSaving(false); }
    }, 400);
  }, []);

  // persist = terapkan perubahan + catat titik riwayat (untuk undo)
  const persist = useCallback((next: ProgressData) => {
    setPast(p => [...p.slice(-59), lastCommitted.current]);
    setFuture([]);
    lastCommitted.current = next;
    dataRef.current = next;
    setData(next);
    scheduleSave(next);
  }, [scheduleSave]);

  const undo = useCallback(() => {
    setPast(p => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      setFuture(f => [lastCommitted.current, ...f].slice(0, 60));
      lastCommitted.current = prev;
      dataRef.current = prev;
      setData(prev);
      scheduleSave(prev);
      return p.slice(0, -1);
    });
  }, [scheduleSave]);

  const redo = useCallback(() => {
    setFuture(f => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast(p => [...p, lastCommitted.current].slice(-60));
      lastCommitted.current = next;
      dataRef.current = next;
      setData(next);
      scheduleSave(next);
      return f.slice(1);
    });
  }, [scheduleSave]);

  // pintasan keyboard Ctrl/Cmd+Z (undo) dan Ctrl/Cmd+Shift+Z / Ctrl+Y (redo)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((k === "z" && e.shiftKey) || k === "y") { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const newId = () => Math.random().toString(36).slice(2, 9);
  const commit = () => persist(dataRef.current);
  const draft = (patch: Partial<ProgressData>) => setData(d => { const n = { ...d, ...patch }; dataRef.current = n; return n; });

  /* generic list ops */
  const addRow = <K extends ListKey>(key: K, row: Omit<ProgressData[K][number], "id">) => {
    const list = dataRef.current[key] as ProgressData[K];
    const newRow = { id: newId(), ...row } as ProgressData[K][number];
    persist({ ...dataRef.current, [key]: [...list, newRow] } as ProgressData);
  };
  const delRow = <K extends ListKey>(key: K, id: string) => {
    const list = dataRef.current[key] as Array<{ id: string }>;
    persist({ ...dataRef.current, [key]: list.filter(r => r.id !== id) } as ProgressData);
  };
  const editRow = <K extends ListKey>(key: K, id: string, field: string, value: unknown) => {
    const list = dataRef.current[key] as Array<Record<string, unknown> & { id: string }>;
    const nextList = list.map(r => (r.id === id ? { ...r, [field]: value } : r));
    draft({ [key]: nextList } as unknown as Partial<ProgressData>);
  };

  return {
    data, loading, saving, loadError,
    past, future, undo, redo,
    commit, draft, persist,
    addRow, delRow, editRow,
  };
}
