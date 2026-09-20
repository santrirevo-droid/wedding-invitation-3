// Shared palette + formatting helpers for the /persiapan family of pages
// (the main dashboard and the standalone itinerary view) — kept in one
// place so both stay visually and behaviorally consistent.

export const NAVY = "#1F3A5F";
export const NAVY_DARK = "#132539";
export const GOLD = "#B8985A";
export const CREAM = "#FAF6EF";
export const INK = "#26313F";
export const MUTED = "#8A93A0";
export const ROSE = "#C1666B";
export const LINE = "#F1EBDD";
export const EDGE = "#EAE3D6";

// Pakai komponen tanggal LOKAL — toISOString() akan menggeser tanggal
// mundur satu hari untuk zona waktu UTC+ seperti WIB.
export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fmtIDR = (n: number) => "Rp " + Math.round(n || 0).toLocaleString("id-ID");

export const fmtLongDate = (s: string) =>
  s
    ? new Date(s + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

export const fmtShortDate = (s: string) =>
  s ? new Date(s + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "";

/** Shared <style> block for the pf-display/pf-mono font classes and a few
 * small behavior tweaks — identical markup needed on every /persiapan page. */
export const PERSIAPAN_GLOBAL_STYLES = `
  .pf-display { font-family: var(--font-persiapan-display), serif; }
  .pf-mono { font-family: var(--font-persiapan-mono), monospace; }
  input:focus, textarea:focus { outline: none; }
  /* cegah teks tembus batas: input tidak dipaksa selebar isinya */
  input, textarea { min-width: 0; max-width: 100%; box-sizing: border-box; }
  input::placeholder { overflow: hidden; text-overflow: ellipsis; }
  .task-check { transition: all .15s ease; }
  .task-row:hover .task-check { border-color: ${GOLD}; }
  .accordion-body { animation: expand .25s ease; }
  @keyframes expand { from { opacity:0; transform: translateY(-4px);} to { opacity:1; transform:none;} }
  @media (prefers-reduced-motion: reduce) { .accordion-body { animation: none; } }
`;
