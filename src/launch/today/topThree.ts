import type { LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';

export const MAX_TOP = 3;

type Ev = Pick<LaunchCalendarEvent, 'id' | 'time' | 'status' | 'source'> & { extractedActionId?: string | null };

const mins = (t: string) => { const [h, m] = (t || '00:00').split(':').map(Number); return h * 60 + (m || 0); };
const rank = (e: Ev, starred: string[]) =>
  starred.includes(e.id) ? 0 : (e.source === 'memory_bridge' || e.extractedActionId) ? 1 : 2;

/** Today's top 3 from the diary: starred, then from conversations, then by time. Only pending items. */
export function pickTopThree<T extends Ev>(events: T[], starredIds: string[] = [], pinned: string[] = []): T[] {
  const open = events.filter(e => e.status === 'pending');
  const byPin = pinned.map(id => open.find(e => e.id === id)).filter(Boolean) as T[];
  const rest = open
    .filter(e => !byPin.includes(e))
    .sort((a, b) => rank(a, starredIds) - rank(b, starredIds) || mins(a.time) - mins(b.time));
  return [...byPin, ...rest].slice(0, MAX_TOP);
}

export function pinKey(userId: string | undefined, d = new Date()) {
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return `myrhythm.top3pins.${userId ?? 'guest'}.${iso}`;
}
export function loadPins(key: string): string[] {
  try { const v = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []; } catch { return []; }
}
export function savePins(key: string, ids: string[]) {
  try { localStorage.setItem(key, JSON.stringify(ids.slice(0, MAX_TOP))); } catch { /* noop */ }
}
