"use client";

import { useRef } from "react";
import Botanical from "@/components/Botanical";
import { useHeadingReveal } from "@/hooks/useHeadingReveal";

type SectionHeadingProps = {
  eyebrow: string;
  title?: string;
  className?: string;
  /** force a small kicker treatment even without a title — for spots where
   * the real "title" of the moment is a different element below (Footer's
   * closing names) rather than this label itself */
  kickerOnly?: boolean;
  /** overrides the title's font family — for one-off headings that break
   * from the shared font-display treatment (e.g. RSVP's script) */
  titleClassName?: string;
};

/**
 * Every section opens the same way: a hairline-tracked kicker, an oversized
 * gilded serif title, then a floral garland. The repetition is the point —
 * it's the page's masthead, and a consistent one is most of what separates
 * an art-directed invitation from a template.
 *
 * Its entrance is its own — useHeadingReveal, not the parent section's
 * uniform data-reveal stagger — so no data-reveal here; the masthead gets
 * a deliberate three-beat reveal instead of being one more block in line.
 */
export default function SectionHeading({
  eyebrow,
  title,
  className = "",
  kickerOnly = false,
  titleClassName = "font-display font-light",
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  useHeadingReveal(ref);

  const headline = title ?? eyebrow;
  const showKicker = Boolean(title) || kickerOnly;

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center text-center ${className}`}
    >
      {showKicker && (
        <p
          data-heading-kicker
          className="font-accent text-[11px] font-normal uppercase tracking-[0.45em] text-accent-dark"
        >
          {eyebrow}
        </p>
      )}

      {!kickerOnly && (
        <h2
          data-heading-title
          className={`${titleClassName} text-gilded mt-3 text-[clamp(2.4rem,9vw,3.4rem)] leading-[1.06]`}
        >
          {headline}
        </h2>
      )}

      <div
        data-heading-flourish
        className={`${kickerOnly ? "mt-3" : "mt-4"} inline-block`}
      >
        <Botanical variant="garland" className="w-56 text-accent/50 sm:w-64" />
      </div>
    </div>
  );
}
