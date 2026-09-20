export type GuestEntry = {
  id: string;
  name: string;
  familySlug: string;
  familyLabel: string;
  relation: string;
  guestCount: number;
  createdAt: number;
};

export { GUEST_LIST_KEY } from "./storageKeys";
export const MAX_NAME_LENGTH = 80;
export const MAX_RELATION_LENGTH = 120;

export function parseGuestEntry(entry: unknown): GuestEntry | null {
  const value = typeof entry === "string" ? tryParseJson(entry) : entry;
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  if (
    typeof record.id !== "string" ||
    typeof record.name !== "string" ||
    typeof record.familySlug !== "string" ||
    typeof record.familyLabel !== "string"
  ) {
    return null;
  }

  return {
    id: record.id,
    name: record.name,
    familySlug: record.familySlug,
    familyLabel: record.familyLabel,
    relation: typeof record.relation === "string" ? record.relation : "",
    guestCount: typeof record.guestCount === "number" && record.guestCount > 0 ? record.guestCount : 1,
    createdAt: typeof record.createdAt === "number" ? record.createdAt : 0,
  };
}

function tryParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
