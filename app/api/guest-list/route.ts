import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { findFamily } from "@/lib/families";
import {
  GUEST_LIST_KEY,
  MAX_NAME_LENGTH,
  MAX_RELATION_LENGTH,
  parseGuestEntry,
  type GuestEntry,
} from "@/lib/guestList";

function notConfigured() {
  // a fresh Response each call — a shared module-level instance would have
  // its body stream consumed after the first request
  return NextResponse.json(
    { error: "Storage belum terhubung ke situs ini." },
    { status: 503 }
  );
}

async function loadAllEntries(): Promise<GuestEntry[]> {
  const redis = getRedis();
  if (!redis) return [];
  const raw = await redis.hgetall<Record<string, unknown>>(GUEST_LIST_KEY);
  if (!raw) return [];
  return Object.values(raw)
    .map(parseGuestEntry)
    .filter((entry): entry is GuestEntry => entry !== null);
}

/** Returns only the requesting family's own entries — pass ?family=slug. */
export async function GET(request: Request) {
  const redis = getRedis();
  if (!redis) return notConfigured();

  const { searchParams } = new URL(request.url);
  const familySlug = searchParams.get("family");
  if (!familySlug || !findFamily(familySlug)) {
    return NextResponse.json({ error: "Keluarga tidak dikenali." }, { status: 400 });
  }

  const entries = await loadAllEntries();
  const own = entries
    .filter((entry) => entry.familySlug === familySlug)
    .sort((a, b) => b.createdAt - a.createdAt);

  return NextResponse.json({ entries: own });
}

export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) return notConfigured();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON tidak valid." }, { status: 400 });
  }

  const { familySlug, name, relation, guestCount } = (body ?? {}) as Record<string, unknown>;

  const family = typeof familySlug === "string" ? findFamily(familySlug) : undefined;
  if (!family) {
    return NextResponse.json({ error: "Keluarga tidak dikenali." }, { status: 400 });
  }
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Nama tamu wajib diisi." }, { status: 400 });
  }

  const count = typeof guestCount === "number" && guestCount > 0 ? Math.min(Math.floor(guestCount), 20) : 1;

  const entry: GuestEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim().slice(0, MAX_NAME_LENGTH),
    familySlug: family.slug,
    familyLabel: family.label,
    relation: typeof relation === "string" ? relation.trim().slice(0, MAX_RELATION_LENGTH) : "",
    guestCount: count,
    createdAt: Date.now(),
  };

  await redis.hset(GUEST_LIST_KEY, { [entry.id]: entry });

  return NextResponse.json({ entry }, { status: 201 });
}
