/**
 * YES — the first three weeks. Single source of truth for the three YES
 * letters. YES is the brief start; MYRHYTHM (myrhythm.ts) is the full app.
 * Neutral, non-clinical wording. No practitioner or programme names.
 */
export type YesId = 'Y' | 'E' | 'S';

export interface YesLetter {
  id: YesId;
  week: 1 | 2 | 3;
  word: string;
  meaning: string;
  /** One line saying what this part changes in the app. */
  shapes: string;
}

export const YES_LETTERS: readonly YesLetter[] = [
  {
    id: 'Y',
    week: 1,
    word: 'Your Starting Point',
    meaning: 'Know where my memory is today — what slips and what already helps.',
    shapes: 'Shapes how and when I remind you.',
  },
  {
    id: 'E',
    week: 2,
    word: 'Everyday Energy',
    meaning: 'The everyday basics behind a steady brain: rest, movement, food and calm.',
    shapes: 'Helps me pace your day around your energy.',
  },
  {
    id: 'S',
    week: 3,
    word: 'Steady Rhythm',
    meaning: 'When my day starts, when I think best, and one thing that matters this week.',
    shapes: 'Builds your daily rhythm on the calendar.',
  },
] as const;

export const YES_BY_ID: Record<YesId, YesLetter> = Object.fromEntries(
  YES_LETTERS.map((l) => [l.id, l])
) as Record<YesId, YesLetter>;

/* ---------- Full Picture (MYRHYTHM) progress, stored on this device ---------- */

const FULL_KEY = 'myrhythm_full_picture';

export interface FullPictureState {
  completedLetters: string[];
  lastCompletedAt: number | null;
  snoozedUntil: number | null;
}

export function loadFullPicture(): FullPictureState {
  try {
    const raw = JSON.parse(localStorage.getItem(FULL_KEY) || '{}');
    return {
      completedLetters: Array.isArray(raw.completedLetters) ? raw.completedLetters : [],
      lastCompletedAt: typeof raw.lastCompletedAt === 'number' ? raw.lastCompletedAt : null,
      snoozedUntil: typeof raw.snoozedUntil === 'number' ? raw.snoozedUntil : null,
    };
  } catch {
    return { completedLetters: [], lastCompletedAt: null, snoozedUntil: null };
  }
}

export function saveFullPicture(next: FullPictureState) {
  try { localStorage.setItem(FULL_KEY, JSON.stringify(next)); } catch {/* noop */}
}

export function markLetterComplete(letterId: string) {
  const s = loadFullPicture();
  if (!s.completedLetters.includes(letterId)) s.completedLetters.push(letterId);
  s.lastCompletedAt = Date.now();
  saveFullPicture(s);
}

export function snoozeFullPicture(days = 2) {
  const s = loadFullPicture();
  s.snoozedUntil = Date.now() + days * 86400000;
  saveFullPicture(s);
}

/** One letter every 2–3 days: is a gentle check-in due now? */
export function isCheckInDue(s: FullPictureState = loadFullPicture()): boolean {
  const now = Date.now();
  if (s.snoozedUntil && s.snoozedUntil > now) return false;
  if (!s.lastCompletedAt) return true;
  return now - s.lastCompletedAt >= 2 * 86400000;
}
