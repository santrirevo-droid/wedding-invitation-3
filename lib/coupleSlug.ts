import { couple } from "./weddingData";

/**
 * URL-safe slug built from the couple's short names, e.g. "morgan-samira".
 *
 * Doubles as the Redis key namespace prefix (see storageKeys.ts) — this
 * codebase gets duplicated per couple, and every duplicate ships with the
 * exact same hardcoded Redis key names (wishes:v1, guestlist:v1, etc.). If
 * two duplicates ever end up sharing one Redis/Upstash instance (e.g. to
 * stay on a free tier instead of provisioning a separate database per
 * wedding), unprefixed keys would collide and merge both sites' RSVPs and
 * guest lists into one list. Deriving the prefix from the couple's own
 * data means it's automatically unique per duplicate with no extra step.
 */
export const coupleSlug = `${couple.groom.shortName}-${couple.bride.shortName}`
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-");
