"use client";

import { Suspense } from "react";
import Botanical from "@/components/Botanical";
import FloralLayer from "@/components/FloralLayer";
import GuestGreeting, { GuestGreetingFallback } from "@/components/GuestGreeting";
import InvitationButton from "@/components/InvitationButton";
import MusicPlayer from "@/components/MusicPlayer";
import NavDock from "@/components/NavDock";
import { useCoverRefs } from "@/hooks/useCoverRefs";
import { useIdleMotion } from "@/hooks/useIdleMotion";
import { useOpenInvitation } from "@/hooks/useOpenInvitation";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { couple } from "@/lib/weddingData";
import { weddingDay, weddingMonth, weddingYear } from "@/lib/weddingDate";

export default function Hero() {
  const refs = useCoverRefs();
  const idle = useIdleMotion(refs);
  const { isOpened, open } = useOpenInvitation(refs);
  useScrollReveal(refs);

  const { section, coverInner, background, glow, content, title, button, music } = refs;

  return (
    // MusicPlayer and NavDock render as siblings of #cover, not descendants
    // of it: useScrollReveal pins #cover via a GSAP transform while it
    // scrolls out, and a transformed ancestor becomes the containing block
    // for any `position: fixed` descendant — a fixed child of #cover would
    // scroll away with the pin's transform instead of staying glued to the
    // real viewport. Confirmed empirically (getComputedStyle on the pinned
    // section showed a non-"none" `transform` while MusicPlayer's own
    // rect had scrolled off-screen) before restructuring this way.
    <>
      <section
        id="cover"
        ref={section}
        className="relative min-h-svh w-full overflow-hidden bg-maroon-deep"
      >
        <div ref={coverInner} className="absolute inset-0">
          {/* local wash — brighter behind the names, so the type sits in its
              own pool of light instead of on an even field */}
          <div
            ref={background}
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(78% 52% at 50% 38%, #fdfdf6 0%, #f3f6e6 52%, #e6edd3 100%)",
            }}
          />

          {/* watercolour atmosphere, far behind everything */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-16 w-[26rem] select-none opacity-[0.1] blur-[2px]"
          >
            <FloralLayer
              src="/floral/floral-wc-spray-b.png"
              width={1000}
              height={753}
              sizes="416px"
              priority
              className="h-auto w-full"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-24 w-[22rem] select-none opacity-[0.09] blur-[2px]"
          >
            <FloralLayer
              src="/floral/floral-wc-spray-a.png"
              width={571}
              height={1000}
              sizes="352px"
              className="h-auto w-full"
            />
          </div>

          {/* a wreath sits behind the names — the densest floral moment on the
              page, kept legible by living entirely behind the type */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[46%] w-[23rem] -translate-x-1/2 -translate-y-1/2 text-accent/25 sm:w-[26rem]"
          >
            <Botanical variant="wreath" className="w-full" />
          </div>

          {/* hairline frame, with floral clusters bursting over its corners.
              These four carry data-cover-floral so useOpenInvitation can part
              them outward when the invitation is opened. */}
          <div className="pointer-events-none absolute inset-4 border border-accent/28 sm:inset-6" />

          <div className="pointer-events-none absolute inset-2 sm:inset-4">
            <div data-cover-floral="tl" className="absolute left-0 top-0 w-28 text-accent/62 sm:w-36">
              <Botanical variant="cluster" className="w-full" />
            </div>
            <div
              data-cover-floral="tr"
              className="absolute right-0 top-0 w-28 -scale-x-100 text-accent/62 sm:w-36"
            >
              <Botanical variant="cluster" className="w-full" />
            </div>
            <div
              data-cover-floral="bl"
              className="absolute bottom-0 left-0 w-28 -scale-y-100 text-accent/62 sm:w-36"
            >
              <Botanical variant="cluster" className="w-full" />
            </div>
            <div
              data-cover-floral="br"
              className="absolute bottom-0 right-0 w-28 -scale-100 text-accent/62 sm:w-36"
            >
              <Botanical variant="cluster" className="w-full" />
            </div>
          </div>

          {/* bloom on open */}
          <div
            ref={glow}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0"
            style={{
              background:
                "radial-gradient(circle at 50% 36%, rgba(255,251,242,0.95), transparent 62%)",
            }}
          />

          <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-8 px-8 py-20 text-center">
            <div ref={content} className="flex flex-col items-center">
              <p
                dir="rtl"
                lang="ar"
                className="font-arabic text-xl leading-relaxed text-accent-dark"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              <p className="mt-7 font-accent text-[11px] font-normal uppercase tracking-[0.5em] text-on-maroon-soft">
                The Wedding Of
              </p>

              {/* monogram — the couple's initials, not a generic sprig, so it
                  stays correct automatically if shortName ever changes */}
              <div aria-hidden="true" className="mt-6 flex items-center justify-center gap-3">
                <span className="rule-gild w-7 sm:w-9" />
                <span className="text-gilded font-script text-[2.75rem] leading-none sm:text-[3.25rem]">
                  {couple.bride.shortName.charAt(0)}
                </span>
                <span className="font-display text-lg font-normal italic leading-none text-accent-dark sm:text-xl">
                  &amp;
                </span>
                <span className="text-gilded font-script text-[2.75rem] leading-none sm:text-[3.25rem]">
                  {couple.groom.shortName.charAt(0)}
                </span>
                <span className="rule-gild w-7 sm:w-9" />
              </div>

              {/* the couple's names — the one place the script face appears at
                  full scale, gilded and slowly drifting */}
              <h1 ref={title} className="mt-3 flex flex-col items-center leading-none">
                <span className="text-gilded text-gilded-drift font-script text-[clamp(3.2rem,20vw,5.5rem)] leading-[0.95]">
                  {couple.bride.shortName}
                </span>
                <span className="my-1 font-display text-2xl font-light italic text-accent-dark">
                  &amp;
                </span>
                <span className="text-gilded text-gilded-drift font-script text-[clamp(3.2rem,20vw,5.5rem)] leading-[0.95]">
                  {couple.groom.shortName}
                </span>
              </h1>

              {/* date, set as three tracked numerals between hairlines */}
              <div className="mt-7 flex items-center gap-4">
                <span className="rule-gild w-10 sm:w-14" />
                <p className="flex items-baseline gap-2.5 font-display text-lg font-normal tracking-[0.18em] text-on-maroon">
                  <span>{weddingDay}</span>
                  <span className="text-accent-dark">·</span>
                  <span>{weddingMonth}</span>
                  <span className="text-accent-dark">·</span>
                  <span>{weddingYear}</span>
                </p>
                <span className="rule-gild w-10 sm:w-14" />
              </div>

              <div className="mt-9">
                <Suspense fallback={<GuestGreetingFallback />}>
                  <GuestGreeting />
                </Suspense>
              </div>
            </div>

            <div ref={button} className="flex flex-col items-center gap-4">
              <InvitationButton
                onClick={() => {
                  idle.stop();
                  open();
                }}
              />
              <p className="font-accent text-[11px] font-normal uppercase tracking-[0.4em] text-on-maroon-soft">
                Ketuk untuk membuka
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* bottom-20: clears NavDock's bar, which is now stuck flush to the
          true bottom edge instead of floating mid-screen */}
      <MusicPlayer ref={music} className="fixed bottom-20 right-4 z-20" />
      <NavDock enabled={isOpened} />
    </>
  );
}
