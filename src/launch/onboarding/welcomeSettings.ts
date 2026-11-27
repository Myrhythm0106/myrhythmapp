/** The two settings asked in the welcome: best focus time and where reminders go. Device-local, per user. */
export type FocusWindow = 'morning' | 'afternoon' | 'evening';
export type ReminderChoice = 'email' | 'both';

export const FOCUS_HOURS: Record<FocusWindow, string[]> = {
  morning: ['09:00', '10:00', '11:00'],
  afternoon: ['13:00', '14:00', '15:00'],
  evening: ['16:00', '17:00', '18:00'],
};

/** Server sends email for 'push' too, so "both" maps to push. */
export const reminderChannel = (c: ReminderChoice): 'push' | 'email' => (c === 'email' ? 'email' : 'push');

const remKey = (uid?: string | null) => `myrhythm_reminder_choice:${uid ?? 'visitor'}`;
const peakKey = (uid?: string | null) => `schedule_mapping_${uid ?? 'visitor'}`;

export function focusFromHours(hours: unknown): FocusWindow | null {
  if (!Array.isArray(hours) || !hours.length) return null;
  return (Object.keys(FOCUS_HOURS) as FocusWindow[]).find(k => FOCUS_HOURS[k][0] === hours[0]) ?? null;
}
export function readFocus(uid?: string | null): FocusWindow | null {
  try { return focusFromHours(JSON.parse(localStorage.getItem(peakKey(uid)) || '{}')?.peakHours); } catch { return null; }
}
export function saveFocus(uid: string | null | undefined, w: FocusWindow) {
  try {
    const prev = JSON.parse(localStorage.getItem(peakKey(uid)) || '{}') || {};
    localStorage.setItem(peakKey(uid), JSON.stringify({ ...prev, peakHours: FOCUS_HOURS[w] }));
  } catch { /* storage unavailable */ }
}
export function readReminderChoice(uid?: string | null): ReminderChoice | null {
  try { const v = localStorage.getItem(remKey(uid)); return v === 'email' || v === 'both' ? v : null; } catch { return null; }
}
export function saveReminderChoice(uid: string | null | undefined, c: ReminderChoice) {
  try { localStorage.setItem(remKey(uid), c); } catch { /* storage unavailable */ }
}
