"use client";

import { useRef } from "react";
import Botanical, { SectionFloral } from "@/components/Botanical";
import FloralLayer from "@/components/FloralLayer";
import SectionHeading from "@/components/SectionHeading";
import { useFloralParallax } from "@/hooks/useFloralParallax";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { couple, type CoupleRole } from "@/lib/weddingData";

type Person = {
  name: string;
  shortName: string;
  father: string;
  mother: string;
  instagram: string;
};

/**
 * Each half of the couple, introduced under an arched plate carrying their
 * initial. The arch stands in for the portrait this invitation doesn't have
 * yet — an empty frame drawn on purpose reads far better than a gap, and it
 * can be swapped for a real photo later without touching the layout.
 */
function PersonBlock({ person, role }: { person: Person; role: CoupleRole }) {
  return (
    <div data-reveal className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center">
        {/* a wreath rings the arch — the flower-heavy frame a printed
            invitation would put around a portrait */}
        <Botanical
          variant="wreath"
          className="pointer-events-none absolute w-[13.5rem] text-accent/40"
        />

        <div className="relative flex h-[7.5rem] w-[6.5rem] items-center justify-center rounded-t-full border border-accent/38 bg-paper/70">
          <span className="absolute inset-[5px] rounded-t-full border border-accent/28" />
          <span className="text-gilded font-script text-[3.4rem] leading-none">
            {person.shortName.charAt(0)}
          </span>
        </div>
      </div>

      <h3 className="text-gilded mt-7 font-display text-[30px] font-light leading-tight">
        {person.name}
      </h3>

      <p className="mt-3 font-accent text-[11px] font-normal uppercase tracking-[0.38em] text-accent-dark">
        {role === "putra" ? "Putra" : "Putri"} dari
      </p>

      <p className="mt-3 max-w-[18rem] font-display text-[18px] font-normal italic leading-[1.75] text-on-maroon-soft">
        {person.father}
        <br />
        &amp; {person.mother}
      </p>

      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram.replace(/^@/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 border border-accent/32 px-4 py-2 font-handle text-[11px] font-normal lowercase tracking-[0.22em] text-accent-dark transition-colors hover:border-accent-dark hover:text-on-maroon"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
          </svg>
          {person.instagram}
        </a>
      )}
    </div>
  );
}

export default function Mempelai() {
  const sectionRef = useRef<HTMLElement>(null);
  const sprayRef = useRef<HTMLImageElement>(null);
  useRevealOnScroll(sectionRef, { stagger: 0.12, y: 26 });
  useFloralParallax(sectionRef, sprayRef);

  return (
    <section
      id="mempelai"
      ref={sectionRef}
      className="relative overflow-hidden px-8 py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-24 w-[20rem] select-none opacity-[0.06] blur-[1.5px] sm:-right-12 sm:w-[26rem]"
      >
        <FloralLayer
          ref={sprayRef}
          src="/floral/floral-wc-spray-b.png"
          width={1000}
          height={753}
          sizes="(min-width: 640px) 416px, 320px"
          className="h-auto w-full -scale-x-100"
        />
      </div>

      <SectionFloral />

      <div className="relative mx-auto max-w-md text-center">
        <SectionHeading eyebrow="Mempelai" title="Kedua Mempelai" />

        <p
          data-reveal
          className="mx-auto mt-7 max-w-sm font-display text-[18px] font-normal italic leading-[1.75] text-on-maroon-soft"
        >
          Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud
          menyelenggarakan pernikahan putra-putri kami:
        </p>

        <div className="mt-14 flex flex-col items-center gap-12">
          <PersonBlock person={couple.bride} role="putri" />

          <div data-reveal className="flex items-center gap-5">
            <span className="rule-gild w-12" />
            <span className="text-gilded font-script text-[3.2rem] leading-none">
              &amp;
            </span>
            <span className="rule-gild w-12" />
          </div>

          <PersonBlock person={couple.groom} role="putra" />
        </div>

        <Botanical
          variant="garland"
          className="mx-auto mt-16 w-60 -scale-y-100 text-accent/50"
        />
      </div>
    </section>
  );
}
