"use client";

import { Suspense, useRef, useState, type FormEvent } from "react";
import { SectionFloral } from "@/components/Botanical";
import FloralLayer from "@/components/FloralLayer";
import { GuestNameAutofill } from "@/components/GuestGreeting";
import SectionHeading from "@/components/SectionHeading";
import { useFloralParallax } from "@/hooks/useFloralParallax";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useWishes } from "@/hooks/useWishes";

type SentWish = {
  name: string;
  attend: "hadir" | "tidak";
  guests: string;
  message: string;
};

const fieldClass =
  "min-h-12 w-full border border-accent/32 bg-paper/75 px-4 py-3.5 font-display text-[17px] font-normal text-on-maroon outline-none transition-colors placeholder:text-on-maroon-soft/55 focus:border-accent/75";
const labelClass =
  "mb-2.5 block font-accent text-[11px] font-normal uppercase tracking-[0.38em] text-accent-dark";

export default function RSVP() {
  const sectionRef = useRef<HTMLElement>(null);
  const sprayRef = useRef<HTMLImageElement>(null);
  useRevealOnScroll(sectionRef, { stagger: 0.09, y: 24 });
  useFloralParallax(sectionRef, sprayRef);

  const { wishes, addWish } = useWishes();
  const [attend, setAttend] = useState<"hadir" | "tidak">("hadir");
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("2");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentWish, setSentWish] = useState<SentWish | null>(null);

  const hadirCount = wishes.filter((w) => w.attend === "hadir").length;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Mohon isi nama Anda terlebih dahulu.");
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);
    const payload: SentWish = {
      name: name.trim(),
      attend,
      guests: attend === "hadir" ? guests : "",
      message: message.trim(),
    };
    try {
      await addWish(payload);
      setSentWish(payload);
      setName("");
      setMessage("");
    } catch {
      setErrorMessage("Gagal mengirim ucapan. Periksa koneksi Anda dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      className="relative overflow-hidden px-8 py-28 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 w-[19rem] select-none opacity-[0.06] blur-[1.5px] sm:-right-14 sm:w-[24rem]"
      >
        <FloralLayer
          ref={sprayRef}
          src="/floral/floral-wc-spray-e.png"
          width={1000}
          height={1000}
          sizes="(min-width: 640px) 384px, 304px"
          className="h-auto w-full"
        />
      </div>

      <SectionFloral />

      <div className="relative mx-auto max-w-md">
        <SectionHeading
          eyebrow="RSVP"
          title="Konfirmasi Kehadiran"
          titleClassName="font-rsvp font-normal"
        />

        <p
          data-reveal
          className="mt-7 font-display text-[19px] font-normal italic leading-[1.75] text-on-maroon-soft"
        >
          Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i
          berkenan hadir dan memberikan doa restu.
        </p>

        <form onSubmit={handleSubmit} className="mt-11 flex flex-col gap-6 text-left">
          <Suspense fallback={null}>
            <GuestNameAutofill setName={setName} />
          </Suspense>

          <div data-reveal>
            <label className={labelClass} htmlFor="rsvp-name">
              Nama
            </label>
            <input
              id="rsvp-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Nama Anda"
              autoComplete="name"
              className={fieldClass}
            />
          </div>

          <div data-reveal>
            <span className={labelClass}>Kehadiran</span>
            <div className="flex gap-3">
              {(["hadir", "tidak"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAttend(value)}
                  className={[
                    "min-h-12 flex-1 cursor-pointer border px-3 py-3.5 font-accent text-[11px] font-medium uppercase tracking-[0.24em] transition-colors duration-300",
                    attend === value
                      ? "border-accent-dark bg-accent-dark text-paper"
                      : "border-accent/32 bg-paper/70 text-on-maroon-soft hover:border-accent/65",
                  ].join(" ")}
                >
                  {value === "hadir" ? "Hadir" : "Berhalangan"}
                </button>
              ))}
            </div>
          </div>

          {attend === "hadir" && (
            <div data-reveal>
              <label className={labelClass} htmlFor="rsvp-guests">
                Jumlah Tamu
              </label>
              <input
                id="rsvp-guests"
                type="number"
                min={1}
                max={10}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className={fieldClass}
              />
            </div>
          )}

          <div data-reveal>
            <label className={labelClass} htmlFor="rsvp-message">
              Ucapan &amp; Doa
            </label>
            <textarea
              id="rsvp-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis ucapan & doa untuk kedua mempelai…"
              className={`${fieldClass} resize-none`}
            />
          </div>

          {errorMessage && (
            <p data-reveal className="font-display text-[15px] italic text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            data-reveal
            type="submit"
            disabled={isSubmitting}
            className="mt-1 min-h-12 cursor-pointer bg-accent-dark py-4 font-accent text-[11px] font-medium uppercase tracking-[0.36em] text-paper transition-[filter] duration-300 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isSubmitting ? "Mengirim…" : "Kirim Konfirmasi"}
          </button>
        </form>

        {sentWish && (
          <div
            data-reveal
            className="mt-7 border-y border-r border-accent/28 border-l-2 border-l-accent/65 bg-paper/75 px-6 py-5 text-left"
          >
            <p className="font-accent text-[11px] font-normal uppercase tracking-[0.38em] text-accent-dark">
              Ucapan Terkirim
            </p>
            <div className="mt-4 flex items-center gap-3.5">
              <span className="flex h-11 w-9 shrink-0 items-center justify-center rounded-t-full border border-accent/45 font-display text-lg font-normal text-accent">
                {sentWish.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
              <div className="min-w-0">
                <div className="truncate font-display text-[18px] font-normal text-on-maroon">
                  {sentWish.name}
                </div>
                <div
                  className={[
                    "font-accent text-[11px] uppercase tracking-[0.24em]",
                    sentWish.attend === "hadir" ? "text-sage-light" : "text-on-maroon-soft",
                  ].join(" ")}
                >
                  {sentWish.attend === "hadir"
                    ? sentWish.guests
                      ? `Hadir · ${sentWish.guests} orang`
                      : "Hadir"
                    : "Berhalangan hadir"}
                </div>
              </div>
            </div>
            {sentWish.message && (
              <p className="mt-4 font-display text-[16px] font-normal italic leading-[1.7] text-on-maroon-soft">
                {sentWish.message}
              </p>
            )}
          </div>
        )}

        <div data-reveal className="mt-12 flex items-stretch justify-center gap-10">
          <div>
            <div className="text-gilded font-display text-[34px] font-light leading-none tabular-nums">
              {wishes.length}
            </div>
            <div className="mt-2.5 font-accent text-[11px] font-normal uppercase tracking-[0.3em] text-on-maroon-soft">
              Ucapan
            </div>
          </div>
          <div className="w-px bg-accent/20" />
          <div>
            <div className="text-gilded font-display text-[34px] font-light leading-none tabular-nums">
              {hadirCount}
            </div>
            <div className="mt-2.5 font-accent text-[11px] font-normal uppercase tracking-[0.3em] text-on-maroon-soft">
              Hadir
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
