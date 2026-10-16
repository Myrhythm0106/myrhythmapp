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
    shapes: 'Remembered: what slips, and how MyRhythm keeps it.',
  },
  {
    id: 'E',
    week: 2,
    word: 'Everyday Energy',
    meaning: 'The everyday basics behind a steady brain: rest, movement, food and calm.',
    shapes: 'Resilient: my energy, my mood, and the voice in my head.',
  },
  {
    id: 'S',
    week: 3,
    word: 'Steady Rhythm',
    meaning: 'When my day starts, when I think best, and one thing that matters this week.',
    shapes: 'Reliable: when I’m sharp, what stops me, and what I follow through.',
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

/* ---------- YES weeks on the calendar ---------- */

const START_KEY = 'myrhythm_yes_start';

function dayStart(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }

export function setYesStart(date = new Date()) {
  try { localStorage.setItem(START_KEY, dayStart(date).toISOString()); } catch {/* noop */}
}

/** Day 1 = "Start week 1" tap, otherwise the day the questions were finished. */
export function getYesStart(): Date | null {
  try {
    const raw = localStorage.getItem(START_KEY);
    if (raw) return new Date(raw);
    const done = JSON.parse(localStorage.getItem('myrhythm_launch_mode') || '{}')?.assessmentResults?.completedAt;
    return done ? dayStart(new Date(done)) : null;
  } catch { return null; }
}

export function getYesWeek(date: Date): 1 | 2 | 3 | 'done' | null {
  const start = getYesStart();
  if (!start) return null;
  const days = Math.floor((dayStart(date).getTime() - start.getTime()) / 86400000);
  if (days < 0) return null;
  if (days < 21) return (Math.floor(days / 7) + 1) as 1 | 2 | 3;
  return 'done';
}
