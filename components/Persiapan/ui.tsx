"use client";

import { ChevronDown, Plus, type LucideIcon } from "lucide-react";
import { EDGE, LINE, MUTED, NAVY } from "./theme";

/* ---------- Small UI pieces shared across the /persiapan pages ---------- */

export function Section({
  icon: Icon, title, open, onToggle, badge, children,
}: {
  icon: LucideIcon;
  title: string;
  open: boolean;
  onToggle: () => void;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <button onClick={onToggle} className="flex items-center gap-2 mb-3 w-full text-left">
        <Icon size={16} style={{ color: NAVY }} className="shrink-0" />
        <h2 className="pf-display text-lg" style={{ color: NAVY }}>{title}</h2>
        {badge}
        <ChevronDown
          size={16}
          style={{ color: MUTED, marginLeft: "auto", transform: open ? "none" : "rotate(-90deg)", transition: "transform .2s" }}
        />
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </section>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl ${className}`} style={{ background: "#FFFFFF", border: `1px solid ${EDGE}` }}>
      {children}
    </div>
  );
}

export function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-xs w-full px-4 py-3 border-t" style={{ color: NAVY, borderColor: LINE }}>
      <Plus size={13} /> {label}
    </button>
  );
}

export function Field({
  value, onChange, onBlur, editable, placeholder, className = "", style = {}, type = "text", onLocked, multiline,
}: {
  value: string | number | undefined;
  onChange: (value: string) => void;
  onBlur?: () => void;
  editable: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  type?: string;
  onLocked?: () => void;
  /** wraps onto multiple lines instead of clipping/scrolling horizontally
   * — for text that can run long (e.g. itinerary activity/note). */
  multiline?: boolean;
}) {
  if (multiline) {
    return (
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        readOnly={!editable}
        onFocus={(e) => { if (!editable) { e.target.blur(); onLocked?.(); } }}
        placeholder={editable ? placeholder : ""}
        rows={1}
        ref={(el) => {
          if (!el) return;
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
        }}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
        }}
        className={`bg-transparent resize-none overflow-hidden ${className}`}
        style={{ cursor: editable ? "text" : "default", ...style }}
      />
    );
  }

  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      readOnly={!editable}
      onFocus={(e) => { if (!editable) { e.target.blur(); onLocked?.(); } }}
      placeholder={editable ? placeholder : ""}
      className={`bg-transparent ${className}`}
      style={{ cursor: editable ? "text" : "default", ...style }}
    />
  );
}
