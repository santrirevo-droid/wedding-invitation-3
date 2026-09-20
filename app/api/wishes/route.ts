import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { WISHES_KEY } from "@/lib/storageKeys";

const MAX_WISHES = 500;

export type Wish = {
  id: number;
  name: string;
  attend: "hadir" | "tidak";
  guests: string;
  message: string;
};

function notConfigured() {
  // a fresh Response each call — a shared module-level instance would have
  // its body stream consumed after the first request
  return NextResponse.json(
    { error: "Storage belum terhubung ke situs ini." },
    { status: 503 }
  );
}

// @upstash/redis auto-serializes on write and auto-deserializes on read, so
// entries normally arrive as already-parsed objects, not JSON strings —
// only fall back to JSON.parse for a raw-string entry defensively.
function parseWish(entry: unknown): Wish | null {
  const value = typeof entry === "string" ? tryParseJson(entry) : entry;
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  if (typeof record.id !== "number" || typeof record.name !== "string") return null;

  return {
    id: record.id,
    name: record.name,
    attend: record.attend === "tidak" ? "tidak" : "hadir",
    guests: typeof record.guests === "string" ? record.guests : "",
    message: typeof record.message === "string" ? record.message : "",
  };
}

function tryParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Every visitor reads the same shared list — no auth, this is a public guestbook by design. */
export async function GET() {
  const redis = getRedis();
  if (!redis) return notConfigured();

  const raw = await redis.lrange<unknown>(WISHES_KEY, 0, MAX_WISHES - 1);
  const wishes = raw.map(parseWish).filter((wish): wish is Wish => wish !== null);

  return NextResponse.json({ wishes });
}

/**
 * Reachable directly, not just through the RSVP form — validate every
 * field server-side rather than trusting the client's shape.
 */
export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) return notConfigured();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON tidak valid." }, { status: 400 });
  }

  const { name, attend, guests, message } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Nama wajib diisi." }, { status: 400 });
  }
  if (attend !== "hadir" && attend !== "tidak") {
    return NextResponse.json({ error: "Kehadiran tidak valid." }, { status: 400 });
  }

  const wish: Wish = {
    id: Date.now(),
    name: name.trim().slice(0, 80),
    attend,
    guests: typeof guests === "string" ? guests.slice(0, 10) : "",
    message: typeof message === "string" ? message.trim().slice(0, 500) : "",
  };

  await redis.lpush(WISHES_KEY, wish);
  await redis.ltrim(WISHES_KEY, 0, MAX_WISHES - 1);

  return NextResponse.json({ wish }, { status: 201 });
}
