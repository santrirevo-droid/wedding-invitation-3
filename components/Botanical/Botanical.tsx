import type { ReactNode } from "react";

type BotanicalVariant = "garland" | "vine" | "wreath" | "cluster";

type BotanicalProps = {
  variant: BotanicalVariant;
  className?: string;
};

/**
 * Drawn floral line-art: garlands, vines, wreaths and corner clusters.
 *
 * The page wants flowers everywhere without turning muddy, and stacked
 * watercolour PNGs can't do that — at the density this design needs they
 * fight each other and read as clutter. Hairline botanicals can: they layer
 * indefinitely, stay crisp at any scale, and cost nothing to load. The
 * watercolour art still appears, but only as large, very faint atmosphere
 * *behind* these.
 *
 * Every stroke uses `vector-effect: non-scaling-stroke`, so a wreath at
 * 300px and a garland at 90px both keep the same engraved hairline instead
 * of the big one going fat and the small one disappearing.
 */

const STROKE = { vectorEffect: "non-scaling-stroke" } as const;

/**
 * A rolled garden rose: outer bud, three petal folds, and a spiral wound
 * tight to the centre. The spiral has to fill most of the bud — at the
 * first pass it started at r=5.6 inside an r=9 circle and the gap made it
 * read as "circle with a squiggle" rather than a flower.
 */
function Rose({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="0" r="9" style={STROKE} />
      <path
        d="M0-7.6A7.6 7.6 0 1 1-6.1 4.5 5.3 5.3 0 1 0 3.5 2.5 3.3 3.3 0 1 1-1-2.3 1.5 1.5 0 1 0 0.5 0"
        style={STROKE}
      />
      {/* petal folds where the outer bloom turns */}
      <path d="M-9 0A9 9 0 0 1-3.4-8.3" opacity="0.55" style={STROKE} />
      <path d="M9 0A9 9 0 0 1 4.5 7.8" opacity="0.55" style={STROKE} />
    </g>
  );
}

/** A pointed leaf with a midrib, growing along `rot` degrees. */
function Leaf({
  x,
  y,
  rot,
  len,
  opacity = 1,
}: {
  x: number;
  y: number;
  rot: number;
  len: number;
  opacity?: number;
}) {
  const w = len * 0.27;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
      <path
        d={`M0 0C${len * 0.3} ${-w} ${len * 0.72} ${-w} ${len} 0C${len * 0.72} ${w} ${len * 0.3} ${w} 0 0Z`}
        style={STROKE}
      />
      <path d={`M0 0H${len}`} opacity="0.45" style={STROKE} />
    </g>
  );
}

/** Three-berry sprig — the small filler that keeps clusters from looking sparse. */
function Berries({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0 0 8 -7M0 0 11 2M0 0 6 9" opacity="0.6" style={STROKE} />
      <circle cx="9.5" cy="-8.5" r="2.6" style={STROKE} />
      <circle cx="13" cy="2.5" r="2.6" style={STROKE} />
      <circle cx="7" cy="11" r="2.6" style={STROKE} />
    </g>
  );
}

function Svg({
  viewBox,
  className,
  children,
}: {
  viewBox: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export default function Botanical({ variant, className = "" }: BotanicalProps) {
  if (variant === "garland") {
    // drawn as one half, then mirrored — keeps it symmetric for free
    const half = (
      <>
        <path d="M200 40C164 62 116 64 66 48" opacity="0.55" style={STROKE} />
        <path d="M198 34C170 50 130 54 86 44" opacity="0.35" style={STROKE} />
        <Leaf x={176} y={48} rot={168} len={26} />
        <Leaf x={150} y={54} rot={196} len={22} opacity={0.8} />
        <Leaf x={126} y={52} rot={172} len={27} />
        <Leaf x={104} y={48} rot={202} len={20} opacity={0.75} />
        <Leaf x={84} y={46} rot={176} len={24} opacity={0.85} />
        <Leaf x={140} y={38} rot={148} len={18} opacity={0.6} />
        <Leaf x={108} y={34} rot={152} len={16} opacity={0.5} />
        <Berries x={64} y={44} rot={166} />
        <Rose x={160} y={44} s={0.72} />
        <Rose x={116} y={44} s={0.52} />
      </>
    );

    return (
      <Svg viewBox="0 0 400 80" className={className}>
        {half}
        <g transform="translate(400 0) scale(-1 1)">{half}</g>
        <Rose x={200} y={38} s={1.05} />
        <Leaf x={200} y={30} rot={-90} len={20} opacity={0.6} />
      </Svg>
    );
  }

  if (variant === "vine") {
    // leaves alternate down a serpentine stem; positions follow the stem's
    // own curve so they read as growing from it rather than pinned on
    const nodes = [
      { x: 47, y: 34, rot: -28, len: 30 },
      { x: 33, y: 78, rot: 196, len: 27 },
      { x: 52, y: 120, rot: -14, len: 32 },
      { x: 38, y: 168, rot: 202, len: 25 },
      { x: 44, y: 212, rot: -32, len: 30 },
      { x: 34, y: 258, rot: 188, len: 28 },
      { x: 50, y: 302, rot: -18, len: 31 },
      { x: 38, y: 348, rot: 200, len: 24 },
      { x: 46, y: 388, rot: -34, len: 27 },
    ];

    return (
      <Svg viewBox="0 0 96 420" className={className}>
        <path
          d="M46 0C22 62 70 128 42 196 14 264 68 328 46 420"
          opacity="0.5"
          style={STROKE}
        />
        {nodes.map((n, i) => (
          <Leaf key={i} {...n} opacity={i % 3 === 2 ? 0.6 : 0.92} />
        ))}
        <Rose x={50} y={96} s={0.6} />
        <Rose x={40} y={236} s={0.75} />
        <Rose x={48} y={336} s={0.52} />
        <Berries x={30} y={140} rot={150} />
        <Berries x={56} y={276} rot={-20} />
      </Svg>
    );
  }

  if (variant === "wreath") {
    const R = 86;
    const cx = 110;
    const cy = 110;
    // A leaf ring, skipping the top few slots so the wreath reads as open.
    //
    // Every coordinate is rounded to 2dp before it reaches the DOM: Math.cos
    // and Math.sin aren't required to be correctly rounded, so Node and the
    // browser can disagree in the last bit and render "110" against
    // "110.00000000000001" — which React reports as a hydration mismatch.
    const r2 = (n: number) => Math.round(n * 100) / 100;
    const leaves = Array.from({ length: 22 }, (_, i) => {
      const a = -100 + (i * 340) / 22;
      const rad = (a * Math.PI) / 180;
      return {
        x: r2(cx + Math.cos(rad) * R),
        y: r2(cy + Math.sin(rad) * R),
        rot: r2(a + 92),
        len: i % 2 === 0 ? 27 : 19,
        opacity: i % 2 === 0 ? 0.9 : 0.6,
      };
    });

    return (
      <Svg viewBox="0 0 220 220" className={className}>
        <circle cx={cx} cy={cy} r={R} opacity="0.16" style={STROKE} />
        {leaves.map((l, i) => (
          <Leaf key={i} {...l} />
        ))}
        <Rose x={110} y={196} s={0.95} />
        <Rose x={64} y={182} s={0.62} />
        <Rose x={156} y={182} s={0.62} />
        <Berries x={34} y={140} rot={120} />
        <Berries x={176} y={128} rot={-40} />
      </Svg>
    );
  }

  // cluster — a dense corner bloom, anchored top-left of its box
  return (
    <Svg viewBox="0 0 210 210" className={className}>
      <path d="M6 6C54 18 92 52 112 104" opacity="0.45" style={STROKE} />
      <path d="M8 34C46 44 76 70 94 108" opacity="0.3" style={STROKE} />
      <path d="M34 8C68 20 96 46 116 84" opacity="0.3" style={STROKE} />

      <Leaf x={30} y={26} rot={34} len={40} />
      <Leaf x={20} y={54} rot={68} len={32} opacity={0.8} />
      <Leaf x={54} y={20} rot={8} len={34} opacity={0.85} />
      <Leaf x={62} y={58} rot={44} len={44} />
      <Leaf x={26} y={92} rot={84} len={30} opacity={0.7} />
      <Leaf x={92} y={34} rot={16} len={30} opacity={0.65} />
      <Leaf x={88} y={90} rot={54} len={34} opacity={0.75} />
      <Leaf x={48} y={118} rot={96} len={26} opacity={0.55} />
      <Leaf x={12} y={12} rot={52} len={26} opacity={0.5} />
      <Leaf x={74} y={10} rot={-6} len={24} opacity={0.5} />
      <Leaf x={116} y={62} rot={28} len={28} opacity={0.6} />
      <Leaf x={74} y={96} rot={72} len={28} opacity={0.6} />

      <Rose x={52} y={52} s={1.15} />
      <Rose x={96} y={26} s={0.68} />
      <Rose x={24} y={104} s={0.58} />
      <Rose x={104} y={84} s={0.8} />

      <Berries x={118} y={52} rot={30} />
      <Berries x={62} y={130} rot={96} />
      <Berries x={4} y={74} rot={132} />
    </Svg>
  );
}
