export type Family = {
  /** URL-safe id — kept internally as the storage key for every guest
   * entry (see lib/guestList.ts), even though there's only one list now. */
  slug: string;
  /** Shown in duplicate-name warnings */
  label: string;
};

/**
 * The site used to split /daftar-tamu into one link per family so each
 * side only saw their own entries. That's gone — everyone now adds to and
 * sees one shared list — but the guest-list storage/API still key each
 * entry by a "family" slug, so this single entry is kept as that shared
 * key rather than threading a bigger rename through the API routes and
 * GuestListClient/RekapClient.
 */
export const families: Family[] = [{ slug: "tamu-undangan", label: "Daftar Tamu" }];

/** The one shared guest list — see the comment above. */
export const guestListFamily: Family = families[0];

export function findFamily(slug: string): Family | undefined {
  return families.find((family) => family.slug === slug);
}
