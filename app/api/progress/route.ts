import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { PROGRESS_KEY } from "@/lib/storageKeys";

const MAX_BYTES = 200_000; // guard against abuse on this no-auth endpoint

function notConfigured() {
  // a fresh Response each call — a shared module-level instance would have
  // its body stream consumed after the first request
  return NextResponse.json(
    { error: "Storage belum terhubung ke situs ini." },
    { status: 503 }
  );
}

function tryParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Single shared planning doc — same no-auth "everyone with the link can edit" model as /daftar-tamu. */
export async function GET() {
  const redis = getRedis();
  if (!redis) return notConfigured();

  // @upstash/redis auto-serializes on write and auto-deserializes on read, so
  // this normally arrives already-parsed — only fall back to JSON.parse for
  // a raw-string entry defensively (see app/api/wishes/route.ts).
  const raw = await redis.get<unknown>(PROGRESS_KEY);
  if (raw == null) return NextResponse.json({ data: null });

  const data = typeof raw === "string" ? tryParseJson(raw) : raw;
  return NextResponse.json({ data: data ?? null });
}

export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) return notConfigured();

  const text = await request.text();
  if (text.length > MAX_BYTES) {
    return NextResponse.json({ error: "Data terlalu besar." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "JSON tidak valid." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  await redis.set(PROGRESS_KEY, body);

  return NextResponse.json({ ok: true });
}
