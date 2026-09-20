"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type InvitationButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

/**
 * The cover's single call to action: a solid gold pill whose foil gradient
 * drifts slowly (`.gild-sweep`), lifting on hover. It's the only filled
 * button on the dark ground, so nothing competes with it.
 */
const InvitationButton = forwardRef<HTMLButtonElement, InvitationButtonProps>(
  ({ label = "Buka Undangan", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={[
          "gild-sweep group relative inline-flex min-h-12 cursor-pointer items-center gap-3.5 rounded-full px-11 py-4",
          "font-accent text-[11px] font-medium uppercase tracking-[0.38em] text-paper",
          "shadow-[0_18px_38px_-16px_rgba(122,90,46,0.5)]",
          "transition-transform duration-300 hover:-translate-y-0.5",
          className,
        ].join(" ")}
        {...props}
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rotate-45 bg-paper/80 transition-transform duration-300 group-hover:rotate-[135deg]"
        />
        {label}
      </button>
    );
  }
);

InvitationButton.displayName = "InvitationButton";

export default InvitationButton;
