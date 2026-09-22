"use client";

import { useEffect, useRef, useState } from "react";
import Botanical, { SectionFloral } from "@/components/Botanical";
import FloralLayer from "@/components/FloralLayer";
import SectionHeading from "@/components/SectionHeading";
import { useFloralParallax } from "@/hooks/useFloralParallax";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { CALENDAR_GOOGLE_URL } from "@/lib/calendar";
import { WEDDING_DATE_ISO, events, venue } from "@/lib/weddingData";
import { weddingDateLong, weddingDayName } from "@/lib/weddingDate";

// target parsed fresh inside the function (not hoisted to a module-level
// constant) so every call — including from the interval below — is a
// fully self-contained computation with nothing pre-baked/cached across
// calls or environments
function getTimeLeft() {
  const target = new Date(WEDDING_DATE_ISO).getTime();
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

function EventBlock({
  title,
  time,
  date,
  emphasis = false,
}: {
  title: string;
  time: string;
  date: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <h3
        className={`font-display font-light text-ink ${
          emphasis ? "text-[28px]" : "text-[24px]"
        } leading-tight`}
      >
        {title}
      </h3>
      <p className="mt-3 font-accent text-[15px] font-normal tracking-[0.08em] text-gold">
        {time}
      </p>
      <p className="mt-1.5 font-display text-[15px] font-normal italic text-ink-soft">
        {date}
      </p>
    </div>
  );
}

export default function Acara() {
  const sectionRef = useRef<HTMLElement>(null);
  const sprayRef = useRef<HTMLImageElement>(null);
  useRevealOnScroll(sectionRef, { stagger: 0.1, y: 26 });
  useFloralParallax(sectionRef, sprayRef);

  // lazy init so the first paint already shows real numbers instead of
  // "--"; the value legitimately differs between server and client render
  // (it's a live clock), so the digits below carry suppressHydrationWarning
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <section
      id="acara"
      ref={sectionRef}
      className="relative overflow-hidden px-8 py-28 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-16 w-[20rem] select-none opacity-[0.06] blur-[1.5px] sm:-left-16 sm:w-[25rem]"
      >
        <FloralLayer
          ref={sprayRef}
          src="/floral/floral-wc-spray-c.png"
          width={1000}
          height={1000}
          sizes="(min-width: 640px) 400px, 320px"
          className="h-auto w-full"
        />
      </div>

      <SectionFloral />

      <div className="relative mx-auto max-w-md">
        <SectionHeading eyebrow="Acara" title="Waktu & Tempat" />

        {/* save the date — the date is the section's second voice after the
            title, and must outrank the countdown digits beneath it */}
        <p
          data-reveal
          className="mt-8 font-accent text-[11px] font-normal uppercase tracking-[0.45em] text-accent-dark"
        >
          Save the Date · {weddingDayName}
        </p>
        <p
          data-reveal
          className="text-gilded mt-3 font-display text-[clamp(1.9rem,8vw,2.4rem)] font-normal leading-tight tracking-[0.02em]"
        >
          {weddingDateLong}
        </p>

        {/* countdown — quieter than the date above it */}
        <div data-reveal className="mt-8 grid grid-cols-4 gap-2.5">
          {cells.map((cell) => (
            <div
              key={cell.label}
              className="rounded-t-full border border-accent/32 bg-paper/70 px-1 pb-4 pt-6"
            >
              <div
                suppressHydrationWarning
                className="text-gilded font-display text-[24px] font-normal leading-none tabular-nums"
              >
                {String(cell.value).padStart(2, "0")}
              </div>
              <div className="mt-2.5 font-accent text-[11px] font-normal uppercase tracking-[0.3em] text-on-maroon-soft">
                {cell.label}
              </div>
            </div>
          ))}
        </div>

        {/* the invitation card itself */}
        <div
          data-reveal
          className="card-stock relative mt-12 overflow-hidden rounded-t-full rounded-b-[4px] px-7 pb-12 pt-24 sm:px-10"
        >
          <Botanical
            variant="garland"
            className="mx-auto mb-8 w-44 text-gold/60"
          />

          {events.map((event, index) => (
            <div key={event.title}>
              {index > 0 && (
                <Botanical
                  variant="garland"
                  className="mx-auto my-9 w-40 -scale-y-100 text-gold/60"
                />
              )}
              <EventBlock
                title={event.title}
                time={event.time}
                date={event.date}
                emphasis={index === events.length - 1}
              />
            </div>
          ))}

          <p className="mt-10 font-accent text-[11px] font-normal uppercase tracking-[0.4em] text-ink-soft">
            Bertempat di
          </p>
          <h4 className="mt-3 font-display text-[25px] font-light leading-tight text-ink">
            {venue.name}
          </h4>
          <p className="mx-auto mt-2.5 max-w-[19rem] font-display text-[16px] font-normal italic leading-[1.6] text-ink-soft">
            {venue.location}
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3">
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center bg-gold-dark px-7 py-3.5 font-accent text-[11px] font-medium uppercase tracking-[0.32em] text-paper transition-[filter] duration-300 hover:brightness-110"
            >
              Lihat Lokasi
            </a>
            <a
              href={CALENDAR_GOOGLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center border border-gold-dark/45 px-7 py-3.5 font-accent text-[11px] font-medium uppercase tracking-[0.32em] text-gold-dark transition-colors duration-300 hover:border-gold-dark hover:bg-gold-dark/5"
            >
              Simpan ke Kalender
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
