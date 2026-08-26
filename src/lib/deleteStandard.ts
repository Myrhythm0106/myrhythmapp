/**
 * MyRhythm delete standard — single source of truth for wording.
 *
 * Tier 1 (undo)    : routine removals. No dialog. Toast with Undo for 10s.
 * Tier 2 (confirm) : irreversible single item. Dialog, plain permanence line.
 * Tier 3 (type)    : everything at once. Dialog requiring the word DELETE.
 *
 * Documented in docs/data-and-deletion-standard.md.
 */

export const UNDO_WINDOW_MS = 10_000;

export const DELETE_WORDING = {
  /** Tier 2 — irreversible, single item. */
  permanent: "This is permanent. It can't be recovered.",
  /** Tier 1 — item came from a capture; reference code survives. */
  traceable:
    "Removed. Its reference code and source stay, so you can still trace it.",
  /** Tier 3 — account / all data. */
  everything:
    "This removes everything below and can't be undone. Type DELETE to confirm.",
} as const;

export type DeletePermanence = keyof typeof DELETE_WORDING;

/** Toast title used for every Tier 1 removal. */
export function undoToastTitle(label?: string) {
  return label ? `Removed "${label}"` : "Removed";
}

export const TYPE_TO_CONFIRM_WORD = "DELETE";
