import { Redis } from "@upstash/redis";

// Vercel's Storage tab can inject either the legacy "Vercel KV" names or the
// native Upstash marketplace names depending on how the store was attached —
// support both rather than assuming one.
export function getRedis() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}
