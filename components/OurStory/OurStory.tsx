"use client";

import { useRef } from "react";
import Botanical, { SectionFloral } from "@/components/Botanical";
import SectionHeading from "@/components/SectionHeading";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { couple } from "@/lib/weddingData";

type Milestone = {
  year: string;
  label: string;
  desc: string;
};

// PLACEHOLDER — this whole file is generic filler prose, not a real love
// story. Rewrite the four paragraphs below and this timeline with the
// couple's actual story before shipping.
const milestones: Milestone[] = [
  {
    year: "[Tahun]",
    label: "Bertemu",
    desc: "[Ceritakan bagaimana dan di mana kalian pertama bertemu]",
  },
  {
    year: "[Tahun]",
    label: "Dekat",
    desc: "[Momen yang membuat hubungan kalian menjadi serius]",
  },
  {
    year: "[Tahun]",
    label: "Khitbah",
    desc: "[Silaturahmi dan lamaran, mempertemukan kedua keluarga]",
  },
  {
    year: "[Tahun]",
    label: "Menikah",
    desc: "[Ijab kabul, menyatukan dua nama menjadi satu kisah]",
  },
];

/**
 * The love story — placed between Mempelai and Acara so the narrative reads
 * in order: who they are, how they came to be a "they", then the logistics
 * of the day itself. Prose stays centred like OpeningQuote's (this site's
 * other long-form text), the timeline below switches to text-left the same
 * way RSVP's form does inside an otherwise centred section.
 */
export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealOnScroll(sectionRef, { stagger: 0.1, y: 26 });

  return (
    <section
      id="kisah-kami"
      ref={sectionRef}
      className="relative overflow-hidden px-8 py-28 text-center"
    >
      <SectionFloral />

      <div className="relative mx-auto max-w-md">
        <SectionHeading eyebrow="Our Story" title="Kisah Kami" />

        <div className="mt-8 flex flex-col gap-5 font-display text-[17px] font-normal italic leading-[1.85] text-on-maroon-soft">
          <p data-reveal>
            [Paragraf 1 — bagaimana {couple.groom.shortName} dan{" "}
            {couple.bride.shortName} pertama kali mengenal satu sama lain.
            Ganti seluruh teks placeholder di file ini
            (components/OurStory/OurStory.tsx) dengan kisah nyata kalian.]
          </p>

          <p data-reveal>
            [Paragraf 2 — momen atau tempat yang mempertemukan kalian secara
            lebih dekat.]
          </p>

          <p data-reveal>
            [Paragraf 3 — bagaimana perasaan itu tumbuh, atau momen yang
            menjadi titik balik hubungan kalian.]
          </p>

          <p data-reveal>
            [Paragraf 4 — bagaimana kisah ini akhirnya berujung pada
            keputusan untuk menikah.]
          </p>
        </div>

        <Botanical
          variant="garland"
          className="mx-auto mt-10 w-56 text-accent/50"
        />

        {/* the resolution, as a timeline rather than more prose — the
            reveal/khitbah/wedding read better as dated beats than as one
            more paragraph competing with the four above */}
        <div className="relative mt-12 flex flex-col gap-9 text-left">
          <span
            aria-hidden="true"
            className="absolute bottom-1.5 left-[7px] top-1.5 w-px bg-accent/30"
          />
          {milestones.map((m) => (
            <div key={m.year} data-reveal className="relative pl-9">
              <span
                aria-hidden="true"
                className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 border-accent-dark bg-maroon-light"
              />
              <p className="font-accent text-[11px] font-normal uppercase tracking-[0.35em] text-accent-dark">
                {m.year}
              </p>
              <p className="mt-1.5 font-display text-[22px] font-normal italic leading-tight text-on-maroon">
                {m.label}
              </p>
              <p className="mt-1 font-display text-[16px] font-normal leading-[1.6] text-on-maroon-soft">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
