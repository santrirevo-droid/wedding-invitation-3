import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { GUEST_LIST_KEY, parseGuestEntry, type GuestEntry } from "@/lib/guestList";
import { nameSimilarity, SIMILARITY_THRESHOLD } from "@/lib/nameSimilarity";

// Above this, an O(n^2) similarity scan risks a serverless timeout — the
// full guest list is still returned, just without duplicate clustering.
const MAX_ENTRIES_FOR_CLUSTERING = 3000;

export type DuplicateCluster = {
  entries: { id: string; name: string; familyLabel: string }[];
};

function findDuplicateClusters(entries: GuestEntry[]): DuplicateCluster[] {
  if (entries.length > MAX_ENTRIES_FOR_CLUSTERING) return [];

  const parent = new Map(entries.map((entry) => [entry.id, entry.id]));
  function find(id: string): string {
    let root = id;
    while (parent.get(root) !== root) root = parent.get(root)!;
    return root;
  }
  function union(a: string, b: string) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent.set(rootA, rootB);
  }

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      if (nameSimilarity(entries[i].name, entries[j].name) >= SIMILARITY_THRESHOLD) {
        union(entries[i].id, entries[j].id);
      }
    }
  }

  const groups = new Map<string, GuestEntry[]>();
  for (const entry of entries) {
    const root = find(entry.id);
    const group = groups.get(root) ?? [];
    group.push(entry);
    groups.set(root, group);
  }

  return Array.from(groups.values())
    .filter((group) => group.length > 1)
    .map((group) => ({
      entries: group
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((entry) => ({ id: entry.id, name: entry.name, familyLabel: entry.familyLabel })),
    }));
}

/**
 * Full guest list across every family, read-only. No password — same "no
 * auth by design" choice as /api/wishes, since this is a small private tool
 * shared only within the family. Editing still only happens per-family (see
 * /api/guest-list/[id]), so this route never needs write access.
 */
export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Storage belum terhubung ke situs ini." }, { status: 503 });
  }

  const raw = await redis.hgetall<Record<string, unknown>>(GUEST_LIST_KEY);
  const entries = raw
    ? Object.values(raw)
        .map(parseGuestEntry)
        .filter((entry): entry is GuestEntry => entry !== null)
        .sort((a, b) => b.createdAt - a.createdAt)
    : [];

  const duplicateClusters = findDuplicateClusters(entries);

  return NextResponse.json({ entries, duplicateClusters });
}
