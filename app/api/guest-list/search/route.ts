import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { GUEST_LIST_KEY, parseGuestEntry, type GuestEntry } from "@/lib/guestList";
import { findSimilarNames } from "@/lib/nameSimilarity";

const MAX_RESULTS = 5;

/**
 * Checks a typed name against every family's list (not just the caller's
 * own) so two families don't independently invite the same person without
 * knowing it. Only name + family label are returned — no relation/notes —
 * to keep this endpoint safe to call while typing, without a password.
 */
export async function GET(request: Request) {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ matches: [] });

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) return NextResponse.json({ matches: [] });

  const raw = await redis.hgetall<Record<string, unknown>>(GUEST_LIST_KEY);
  const entries = raw
    ? Object.values(raw)
        .map(parseGuestEntry)
        .filter((entry): entry is GuestEntry => entry !== null)
    : [];

  const matches = findSimilarNames(query, entries)
    .slice(0, MAX_RESULTS)
    .map((match) => ({ name: match.name, familyLabel: match.familyLabel, score: match.score }));

  return NextResponse.json({ matches });
}
