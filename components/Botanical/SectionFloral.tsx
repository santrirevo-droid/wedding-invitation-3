import Botanical from "./Botanical";

type SectionFloralProps = {
  /** dial the whole set up or down per section */
  className?: string;
};

/**
 * The standing floral corners every section carries.
 *
 * They live in the section's vertical padding (py-28) and bleed off the
 * horizontal edges, which is the only way to get this much flora onto a
 * 430px-wide phone without it crossing the text column — side rails would
 * sit straight on top of the copy at that width. Density comes from the
 * padding zones, not the margins.
 */
export default function SectionFloral({ className = "" }: SectionFloralProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute -left-10 -top-7 w-32 text-accent/45 sm:-left-6 sm:w-44">
        <Botanical variant="cluster" className="w-full" />
      </div>
      <div className="absolute -bottom-7 -right-10 w-32 -scale-100 text-accent/45 sm:-right-6 sm:w-44">
        <Botanical variant="cluster" className="w-full" />
      </div>
    </div>
  );
}
