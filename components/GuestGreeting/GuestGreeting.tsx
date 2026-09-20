"use client";

import { useGuestName } from "@/hooks/useGuestName";

function GreetingCardShell({ guestName }: { guestName: string }) {
  return (
    <div className="relative w-full max-w-[17rem] bg-paper/70 px-7 py-6 text-center backdrop-blur-[2px]">
      {/* corner marks rather than a full box — a printer's crop-mark frame,
          which leaves the name sitting in open space instead of a label */}
      <span aria-hidden="true" className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-accent/55" />
      <span aria-hidden="true" className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-accent/55" />
      <span aria-hidden="true" className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-accent/55" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-accent/55" />

      <p className="font-accent text-[11px] font-normal uppercase tracking-[0.36em] text-on-maroon-soft">
        Kepada Yth.
      </p>
      <p className="mt-1.5 font-accent text-[11px] font-normal uppercase tracking-[0.26em] text-on-maroon-soft">
        Bapak / Ibu / Saudara&#47;i
      </p>

      {guestName && (
        <>
          <span className="rule-gild mx-auto mt-4 block w-12" />
          <p className="mt-3.5 font-display text-[26px] font-light leading-tight text-on-maroon">
            {guestName}
          </p>
        </>
      )}
    </div>
  );
}

/** Personalized greeting card — reads the guest's name from the URL. */
export default function GuestGreeting() {
  const guestName = useGuestName();
  return <GreetingCardShell guestName={guestName} />;
}

/** Suspense fallback: identical shell with the generic sapaan, so there's
 * no layout shift once the real (possibly personalized) card hydrates in. */
export function GuestGreetingFallback() {
  return <GreetingCardShell guestName="" />;
}
