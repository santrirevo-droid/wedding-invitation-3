// Honorifics stripped before comparing, so "Bapak Budi Santoso" and "Budi
// Santoso" score as the same name instead of merely similar.
const HONORIFICS = [
  "bapak", "ibu", "bpk", "bu", "sdr", "sdri", "saudara", "saudari",
  "mas", "mbak", "kak", "adik", "dik", "haji", "hajjah", "h", "hj",
  "dr", "drs", "dra", "prof", "ir", "drh",
];

export function normalizeName(raw: string): string {
  const words = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // strip diacritics
    .replace(/[.,]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !HONORIFICS.includes(word));
  return words.join(" ").trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current.push(Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost));
    }
    previous = current;
  }
  return previous[b.length];
}

function levenshteinRatio(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

// Catches reordered names ("Santoso Budi" vs "Budi Santoso") that a plain
// edit-distance comparison would score as very different.
function tokenOverlapRatio(a: string, b: string): number {
  const tokensA = new Set(a.split(" ").filter(Boolean));
  const tokensB = new Set(b.split(" ").filter(Boolean));
  if (!tokensA.size || !tokensB.size) return 0;

  let shared = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) shared++;
  }
  return shared / Math.max(tokensA.size, tokensB.size);
}

/** 0 (completely different) to 1 (same name after normalizing). */
export function nameSimilarity(a: string, b: string): number {
  const normA = normalizeName(a);
  const normB = normalizeName(b);
  if (!normA || !normB) return 0;
  if (normA === normB) return 1;

  return Math.max(levenshteinRatio(normA, normB), tokenOverlapRatio(normA, normB));
}

export const SIMILARITY_THRESHOLD = 0.72;

export function findSimilarNames<T extends { name: string }>(
  query: string,
  candidates: T[],
  threshold = SIMILARITY_THRESHOLD
): (T & { score: number })[] {
  return candidates
    .map((candidate) => ({ ...candidate, score: nameSimilarity(query, candidate.name) }))
    .filter((candidate) => candidate.score >= threshold)
    .sort((a, b) => b.score - a.score);
}
