/**
 * The page's material: four fixed layers stacked behind all content —
 * base gradient, a blush and a sage wash for depth, paper grain, then a
 * soft vignette. Rendered once in the root layout.
 *
 * Inverted from the dark build, and not just in colour: the grain blends
 * `multiply` here rather than `overlay`, because on a bright ground an
 * overlay grain lightens as much as it darkens and just looks like noise —
 * multiplied, the same texture reads as the tooth of the paper. The
 * vignette is warm brown at a fraction of the old opacity for the same
 * reason.
 *
 * Needs an explicit negative z-index: a `position: fixed` element with
 * z-index:auto paints *after* normal-flow siblings regardless of DOM order
 * (CSS2.1 stacking order, step 6 vs step 3) — it only stayed behind content
 * on pages where something else (e.g. Lenis's transformed scroll wrapper)
 * happened to give that content its own stacking context. Explicit -z-10
 * makes it correct everywhere.
 */
export default function BackgroundPattern() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      {/* base — brightest at the top, settling warmer toward the foot */}
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-light via-maroon to-maroon-deep" />

      {/* blush and sage washes: the ivory never looks like a flat fill */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(62% 42% at 80% 6%, rgba(224,170,158,0.3), transparent 72%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 40% at 10% 64%, rgba(172,186,152,0.26), transparent 74%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 34% at 88% 88%, rgba(228,198,160,0.28), transparent 72%)",
        }}
      />

      {/* paper grain */}
      <div
        className="absolute inset-0 opacity-[0.055] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* vignette — warm and very faint, just enough to hold the centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 78% at 50% 42%, transparent 48%, rgba(154,120,86,0.14) 100%)",
        }}
      />
    </div>
  );
}
