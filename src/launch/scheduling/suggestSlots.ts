/**
 * Suggest free diary slots for a new step, best time of day first.
 * Pure and tested, used by Home and when conversation steps go into my diary.
 */
export interface BusyItem { date: string; time: string; end_time?: string | null; status?: string }
export interface Slot { date: string; time: string; atPeak: boolean }

export const DEFAULT_PEAK_HOURS = ['09:00', '10:00', '11:00', '12:00'];
const DAY_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const GAP = 15; // minutes kept clear around commitments
const LENGTH = 30; // minutes a step is assumed to take

const toMin = (t: string) => { const [h, m] = t.slice(0, 5).split(':').map(Number); return h * 60 + (m || 0); };
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export interface SuggestOptions {
  busy: BusyItem[];
  peakHours?: string[];
  maxDaily?: number;
  /** Last date (YYYY-MM-DD) the step should land on */
  dueDate?: string;
  now?: Date;
  count?: number;
  days?: number;
}

export function suggestSlots({ busy, peakHours, maxDaily = 3, dueDate, now = new Date(), count = 3, days = 7 }: SuggestOptions): Slot[] {
  const peaks = peakHours && peakHours.length ? peakHours : DEFAULT_PEAK_HOURS;
  const live = busy.filter(b => b.status !== 'cancelled' && b.status !== 'done');
  const out: Slot[] = [];
  const nowMin = now.getHours() * 60 + now.getMinutes();

  for (let i = 0; i < days && out.length < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const date = iso(d);
    if (dueDate && date > dueDate) break;
    const dayItems = live.filter(b => b.date === date);
    let placedToday = dayItems.length + out.filter(s => s.date === date).length;
    if (placedToday >= maxDaily) continue;

    const ordered = [...peaks, ...DAY_HOURS.filter(h => !peaks.includes(h))];
    for (const time of ordered) {
      if (out.length >= count || placedToday >= maxDaily) break;
      const start = toMin(time);
      if (i === 0 && start < nowMin + 30) continue;
      const end = start + LENGTH;
      const clash = [...dayItems, ...out.filter(s => s.date === date)].some(b => {
        const bs = toMin(b.time);
        const be = 'end_time' in b && b.end_time ? toMin(b.end_time) : bs + LENGTH;
        return start < be + GAP && end + GAP > bs;
      });
      if (clash) continue;
      out.push({ date, time, atPeak: peaks.includes(time) });
      placedToday++;
    }
  }
  return out;
}

const PREF_KEY = (uid?: string) => `myrhythm.suggestTimes.${uid ?? 'anon'}`;
export function suggestTimesEnabled(uid?: string): boolean {
  try { return localStorage.getItem(PREF_KEY(uid)) !== 'off'; } catch { return true; }
}
export function setSuggestTimesEnabled(uid: string | undefined, on: boolean) {
  try { localStorage.setItem(PREF_KEY(uid), on ? 'on' : 'off'); } catch { /* noop */ }
}
/** Peak hours saved from my answers (by the assessment scheduling hook), if any. */
export function savedPeakHours(uid?: string): string[] | null {
  if (!uid) return null;
  try {
    const raw = localStorage.getItem(`schedule_mapping_${uid}`);
    const hours = raw ? JSON.parse(raw)?.peakHours : null;
    return Array.isArray(hours) && hours.length ? hours : null;
  } catch { return null; }
}
