// Lightweight session-scoped store for the MVP prototype flow.
// No backend coupling — keeps the prototype isolated and revertible.

export type ReminderOffset =
  | '5_min_before' | '15_min_before' | '30_min_before'
  | '1_hour_before' | '1_day_before' | 'morning_of';

export type ReminderChannel = 'in_app' | 'push' | 'email';

export interface PrototypeReminder {
  id: string;
  offset: ReminderOffset;
  channels: ReminderChannel[];
}

export interface PrototypeAct {
  id: string;
  text: string;
  assignee: string;
  dueContext: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  proposedDate?: string;
  proposedTime?: string;
  attendees?: string[];
  reminders?: PrototypeReminder[];
  status: 'pending' | 'confirmed' | 'rejected' | 'scheduled';
}

const KEY = 'prototype:acts';
const TRANSCRIPT_KEY = 'prototype:transcript';

export function loadActs(): PrototypeAct[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
export function saveActs(acts: PrototypeAct[]) {
  sessionStorage.setItem(KEY, JSON.stringify(acts));
}
export function clearActs() {
  sessionStorage.removeItem(KEY);
  sessionStorage.removeItem(TRANSCRIPT_KEY);
}
export function saveTranscript(text: string) {
  sessionStorage.setItem(TRANSCRIPT_KEY, text);
}
export function loadTranscript(): string {
  return sessionStorage.getItem(TRANSCRIPT_KEY) || '';
}

// SMART reminder defaults based on ACT shape.
export function smartReminderDefaults(act: PrototypeAct): PrototypeReminder[] {
  const reminders: PrototypeReminder[] = [];
  const push = (offset: ReminderOffset, channels: ReminderChannel[] = ['in_app', 'push']) =>
    reminders.push({ id: crypto.randomUUID(), offset, channels });

  // Baseline: morning of the day.
  push('morning_of', ['in_app', 'email']);

  // Priority rules.
  if (act.priority === 'high') {
    push('1_day_before', ['in_app', 'email']);
    push('15_min_before');
  } else if (act.priority === 'medium') {
    push('15_min_before');
  }
  // low priority -> just morning_of

  // Attendee rule: if inviting people, give yourself an hour to prep.
  if ((act.attendees?.length || 0) > 0) push('1_hour_before');

  // Energy-fit rule: low-energy window = early morning or late evening.
  const h = parseInt((act.proposedTime || '12:00').slice(0, 2), 10);
  if (h < 8 || h >= 20) push('30_min_before');

  // De-dup by offset.
  const seen = new Set<ReminderOffset>();
  return reminders.filter(r => (seen.has(r.offset) ? false : seen.add(r.offset)));
}

export const REMINDER_LABEL: Record<ReminderOffset, string> = {
  '5_min_before': '5 min before',
  '15_min_before': '15 min before',
  '30_min_before': '30 min before',
  '1_hour_before': '1 hour before',
  '1_day_before': '1 day before',
  'morning_of': 'Morning of',
};

// Sample ACTs used when bypass is on or sample-meeting selected.
export function getSampleActs(): PrototypeAct[] {
  const today = new Date();
  const inDays = (n: number) => {
    const d = new Date(today); d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const base: PrototypeAct[] = [
    { id: crypto.randomUUID(), text: 'Book follow-up appointment with Dr. Patel', assignee: 'me', dueContext: 'this week', priority: 'high', confidence: 0.92, proposedDate: inDays(2), proposedTime: '10:00', attendees: ['Dr. Patel'], status: 'pending' },
    { id: crypto.randomUUID(), text: 'Call Sarah to discuss the school meeting', assignee: 'me', dueContext: 'tomorrow', priority: 'medium', confidence: 0.85, proposedDate: inDays(1), proposedTime: '14:30', attendees: ['Sarah'], status: 'pending' },
    { id: crypto.randomUUID(), text: 'Pick up prescription from pharmacy', assignee: 'me', dueContext: 'today', priority: 'high', confidence: 0.95, proposedDate: inDays(0), proposedTime: '16:00', attendees: [], status: 'pending' },
    { id: crypto.randomUUID(), text: 'Share weekly update with Mum', assignee: 'me', dueContext: 'Sunday', priority: 'low', confidence: 0.78, proposedDate: inDays(4), proposedTime: '18:00', attendees: ['Mum'], status: 'pending' },
  ];
  return base.map(a => ({ ...a, reminders: smartReminderDefaults(a) }));
}

export const SUGGESTED_CONTACTS = [
  'Sarah', 'Dr. Patel', 'Mum', 'Dad', 'James (OT)', 'Care coordinator',
];

// Auth bypass — persistent, friction-free demo mode.
const BYPASS_KEY = 'prototype:bypassAuth';
export function isBypassAuth(): boolean {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).get('bypass') === '1') return true;
  if ((import.meta as any).env?.VITE_MOCK_SECURITY === 'true') return true;
  return localStorage.getItem(BYPASS_KEY) === '1';
}
export function setBypassAuth(on: boolean) {
  localStorage.setItem(BYPASS_KEY, on ? '1' : '0');
}
