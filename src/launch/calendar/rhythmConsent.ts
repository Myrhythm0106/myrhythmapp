/**
 * "My rhythm on my calendar" — what the user agreed may appear, plus their
 * regular appointments. Device-local; nothing shows without a yes.
 */
import { readStoredProductivityWindow } from '@/launch/assessment/productivityWindow';

export type RhythmItem = 'work' | 'productive' | 'breaks';
export type Frequency = 'daily' | 'weekdays' | 'weekly' | 'fortnightly' | 'monthly';

export interface RegularAppointment {
  id: string;
  title: string;
  time: string; // HH:mm
  durationMinutes: number;
  frequency: Frequency;
  /** 0=Sun..6=Sat, used for weekly/fortnightly */
  weekday: number;
  /** ISO date of first occurrence, used for fortnightly/monthly */
  startDate: string;
}

export interface RhythmConsent {
  status: 'ask' | 'yes' | 'no';
  items: Record<RhythmItem, boolean>;
  appointments: RegularAppointment[];
}

const KEY = 'myrhythm_calendar_rhythm_v1';
const EVENT = 'myrhythm:rhythm-consent';

const DEFAULT: RhythmConsent = {
  status: 'ask',
  items: { work: false, productive: false, breaks: false },
  appointments: [],
};

export function readRhythmConsent(): RhythmConsent {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT, items: { ...DEFAULT.items } };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT, ...parsed, items: { ...DEFAULT.items, ...(parsed.items ?? {}) } };
  } catch {
    return { ...DEFAULT, items: { ...DEFAULT.items } };
  }
}

export function saveRhythmConsent(next: RhythmConsent) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* noop */
  }
}

export function onRhythmConsentChange(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

/** Called after a retake: keep appointments, ask again before showing new bands. */
export function resetRhythmConsentForRetake() {
  const cur = readRhythmConsent();
  saveRhythmConsent({ ...cur, status: 'ask' });
}

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
};
const toHHMM = (mins: number) => {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

export interface RhythmBand {
  kind: RhythmItem | 'appointment';
  label: string;
  start: string;
  end: string;
}

/** What my answers suggest — shown on the snapshot, before any permission. */
export function suggestedRhythm() {
  const w = readStoredProductivityWindow();
  if (!w) return null;
  const s = toMin(w.productiveStart);
  const e = toMin(w.productiveEnd);
  const focus = w.focusBlockMinutes || 45;
  const breakAt = Math.min(e, s + focus);
  return {
    work: { start: toHHMM(Math.max(0, s - 60)), end: toHHMM(e + 60) },
    productive: { start: w.productiveStart, end: w.productiveEnd },
    breaks: { start: toHHMM(breakAt), end: toHHMM(breakAt + Math.max(10, w.bufferMinutes || 15)) },
    focusBlockMinutes: focus,
  };
}

function occursOn(a: RegularAppointment, date: Date): boolean {
  const day = date.getDay();
  const start = new Date(a.startDate + 'T00:00:00');
  if (date < start) return false;
  switch (a.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return day >= 1 && day <= 5;
    case 'weekly':
      return day === a.weekday;
    case 'fortnightly': {
      if (day !== a.weekday) return false;
      const weeks = Math.floor((date.getTime() - start.getTime()) / (7 * 86400000));
      return weeks % 2 === 0;
    }
    case 'monthly':
      return date.getDate() === start.getDate();
  }
}

/** Bands for one day — only what the user has agreed to, plus their regular appointments. */
export function bandsForDate(date: Date): RhythmBand[] {
  const c = readRhythmConsent();
  const bands: RhythmBand[] = [];
  const s = c.status === 'yes' ? suggestedRhythm() : null;
  if (s) {
    if (c.items.work) bands.push({ kind: 'work', label: 'My best time to work', ...s.work });
    if (c.items.productive) bands.push({ kind: 'productive', label: 'My most productive window', ...s.productive });
    if (c.items.breaks) bands.push({ kind: 'breaks', label: 'Break', ...s.breaks });
  }
  for (const a of c.appointments) {
    if (occursOn(a, date)) {
      bands.push({ kind: 'appointment', label: a.title, start: a.time, end: toHHMM(toMin(a.time) + a.durationMinutes) });
    }
  }
  return bands.sort((x, y) => toMin(x.start) - toMin(y.start));
}

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  daily: 'Every day',
  weekdays: 'Weekdays',
  weekly: 'Every week',
  fortnightly: 'Every 2 weeks',
  monthly: 'Every month',
};
