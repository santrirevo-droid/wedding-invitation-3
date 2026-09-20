import { coupleSlug } from "./coupleSlug";

/**
 * Every Redis key this site writes, namespaced by coupleSlug — see the
 * comment there for why. Keep every new Redis-backed feature's key here
 * (not hand-rolled inline) so a shared Upstash instance stays safe by
 * construction instead of by remembering to prefix each one.
 */
export const WISHES_KEY = `${coupleSlug}:wishes:v1`;
export const GUEST_LIST_KEY = `${coupleSlug}:guestlist:v1`;
export const PROGRESS_KEY = `${coupleSlug}:wedding-progress:v1`;
