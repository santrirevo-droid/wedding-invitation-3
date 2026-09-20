/** Gentle glide in, cruise, gentle glide out — the one easing curve every
 * scripted Lenis scroll on this site uses (the autoscroll tour, NavDock's
 * jump-to-section), so every programmatic scroll feels like the same hand
 * moved it. */
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
