"use client";

import { useRef, useState } from "react";
import Botanical, { SectionFloral } from "@/components/Botanical";
import SectionHeading from "@/components/SectionHeading";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { bankAccounts, giftAddress } from "@/lib/weddingData";

/**
 * The envelope this section is named after: a flap folded down over the
 * card stock and closed with a wax seal. The seal is opaque `bg-paper`, so
 * it covers the point where the two fold lines meet the way a real one
 * would — that overlap is what stops it reading as a drawn triangle.
 */
function EnvelopeFlap() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 text-gold"
    >
      <svg
        viewBox="0 0 400 84"
        preserveAspectRatio="none"
        fill="none"
        className="h-[84px] w-full"
      >
        <path d="M0 0 200 72 400 0Z" fill="currentColor" opacity="0.05" />
        <path
          d="M0 0 200 72 400 0"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
          opacity="0.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span className="absolute left-1/2 top-[72px] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/35 bg-paper">
        <span className="h-2 w-2 rotate-45 bg-gold/55" />
      </span>
    </div>
  );
}

export default function Gift() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealOnScroll(sectionRef, { stagger: 0.12, y: 26 });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function handleCopy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((cur) => (cur === key ? null : cur)), 1800);
  }

  const cardClass =
    "card-stock relative overflow-hidden rounded-[4px] px-7 pb-9 pt-[6.75rem]";
  const copyButtonClass =
    "mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center border px-7 py-3 font-accent text-[11px] font-medium uppercase tracking-[0.3em] transition-colors duration-300";

  return (
    <section
      id="tanda-kasih"
      ref={sectionRef}
      className="relative overflow-hidden px-8 py-28 text-center"
    >
      <SectionFloral />

      <div className="relative mx-auto max-w-md">
        <SectionHeading eyebrow="Tanda Kasih" title="Amplop Digital" />

        <p
          data-reveal
          className="mt-7 font-display text-[19px] font-normal italic leading-[1.75] text-on-maroon-soft"
        >
          Kehadiran dan doa restu Anda sudah lebih dari cukup bagi kami.
          Bila berkenan memberi tanda kasih, kami sediakan pilihan berikut.
        </p>

        <div className="mt-11 flex flex-col gap-7">
          {bankAccounts.map((account) => (
            <div key={account.number} data-reveal className={cardClass}>
              <EnvelopeFlap />

              <p className="font-accent text-[11px] font-normal uppercase tracking-[0.4em] text-ink-soft">
                Transfer Bank
              </p>
              <div className="mt-3 font-display text-[26px] font-light leading-tight text-ink">
                {account.bank}
              </div>

              <Botanical variant="garland" className="mx-auto my-5 w-36 text-gold/60" />

              <div className="font-display text-[24px] font-normal tabular-nums tracking-[0.18em] text-gold-dark">
                {account.number}
              </div>
              <div className="mt-2 font-display text-[16px] font-normal italic text-ink-soft">
                a.n. {account.holder}
              </div>

              <button
                type="button"
                onClick={() => handleCopy(account.number, account.number)}
                className={[
                  copyButtonClass,
                  copiedKey === account.number
                    ? "border-sage-dark bg-sage-dark text-paper"
                    : "border-gold-dark/45 text-gold-dark hover:border-gold-dark hover:bg-gold-dark/5",
                ].join(" ")}
              >
                {copiedKey === account.number ? "Tersalin ✓" : "Salin Nomor"}
              </button>
            </div>
          ))}

          <div data-reveal className={cardClass}>
            <EnvelopeFlap />

            <p className="font-accent text-[11px] font-normal uppercase tracking-[0.4em] text-ink-soft">
              Kirim Hadiah
            </p>
            <div className="mt-3 font-display text-[26px] font-light leading-tight text-ink">
              Alamat Pengiriman
            </div>

            <Botanical variant="garland" className="mx-auto my-5 w-36 text-gold/60" />

            <div className="mx-auto max-w-[19rem] font-display text-[17px] font-normal leading-[1.65] text-gold-dark">
              {giftAddress.address}
            </div>
            <div className="mt-2 font-display text-[16px] font-normal italic text-ink-soft">
              a.n. {giftAddress.recipient}
            </div>

            <button
              type="button"
              onClick={() => handleCopy(giftAddress.address, "address")}
              className={[
                copyButtonClass,
                copiedKey === "address"
                  ? "border-sage-dark bg-sage-dark text-paper"
                  : "border-gold-dark/45 text-gold-dark hover:border-gold-dark hover:bg-gold-dark/5",
              ].join(" ")}
            >
              {copiedKey === "address" ? "Tersalin ✓" : "Salin Alamat"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
