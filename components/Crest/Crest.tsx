type CrestProps = {
  className?: string;
};

/**
 * A small upright sprig, set above a name or a passage as an opening mark.
 *
 * This is all that's left of the geometric ornament set the design started
 * with: once `components/Botanical` took over garlands, dividers and corner
 * work, the flourish and corner variants had no call sites left. The crest
 * survives because it does something the botanicals don't — it reads as a
 * single centred mark rather than a spread.
 */
export default function Crest({ className = "" }: CrestProps) {
  return (
    <svg
      viewBox="0 0 64 44"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M32 42V14" strokeWidth="0.75" opacity="0.7" />
      <path
        d="M32 16c-9-1-14-6-15-14 9 1 14 6 15 14Z"
        strokeWidth="0.75"
        opacity="0.85"
      />
      <path
        d="M32 16c9-1 14-6 15-14-9 1-14 6-15 14Z"
        strokeWidth="0.75"
        opacity="0.85"
      />
      <path
        d="M32 28c-7-1-11-5-12-11 7 1 11 5 12 11Z"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <path
        d="M32 28c7-1 11-5 12-11-7 1-11 5-12 11Z"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <circle cx="32" cy="9" r="2" strokeWidth="0.75" />
    </svg>
  );
}
