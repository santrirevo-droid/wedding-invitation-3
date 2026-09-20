import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { GUEST_LIST_KEY, parseGuestEntry } from "@/lib/guestList";

function notConfigured() {
  return NextResponse.json(
    { error: "Storage belum terhubung ke situs ini." },
    { status: 503 }
  );
}

/** A family may only delete its own entries — familySlug in the JSON body must match. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const redis = getRedis();
  if (!redis) return notConfigured();

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON tidak valid." }, { status: 400 });
  }
  const familySlug = (body as Record<string, unknown> | null)?.familySlug;

  const raw = await redis.hget<Record<string, unknown>>(GUEST_LIST_KEY, id);
  const entry = parseGuestEntry(raw);
  if (!entry) {
    return NextResponse.json({ error: "Data tamu tidak ditemukan." }, { status: 404 });
  }

  if (entry.familySlug !== familySlug) {
    return NextResponse.json({ error: "Anda tidak bisa menghapus nama dari keluarga lain." }, { status: 403 });
  }

  await redis.hdel(GUEST_LIST_KEY, id);

  return NextResponse.json({ ok: true });
}
