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

import type { ContextId, ActType } from './prototypeContexts';

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
  // v7.12 SMART context fields — all optional, render only when set.
  contextId?: ContextId;
  actType?: ActType;
  clinician?: string;
  shareWith?: string[];
  cognitiveLoad?: 'high' | 'medium' | 'low';
}

const CONTEXT_KEY = 'prototype:contextId';
export function saveContextId(id: ContextId) {
  sessionStorage.setItem(CONTEXT_KEY, id);
}
export function loadContextId(): ContextId | null {
  const v = sessionStorage.getItem(CONTEXT_KEY);
  return (v as ContextId | null) ?? null;
}

// Quiet brain-health flag — production reads from the MYRHYTHM assessment.
// TODO: replace with EnergyProfile.lowEnergyToday from /prototype/rhythm.
export function isLowEnergyDay(): boolean {
  return sessionStorage.getItem('prototype:lowEnergyDay') === '1';
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

// Energy profile — in production this comes from the user's MYRHYTHM assessment.
// TODO: replace with read from assessment table.
export const ENERGY_PROFILE = {
  peakStart: 9,        // 09:00
  peakEnd: 11,         // 11:00
  dipStart: 14,        // 14:00 (avoid)
  dipEnd: 15.5,        // 15:30
  lunchStart: 12.5,    // 12:30
  lunchEnd: 13.5,      // 13:30
  workStart: 9,
  workEnd: 18,
};

// Pure SMART placement. Frontend-only prototype logic — no backend call.
// Now reads the user's assessment profile (best/low energy windows) when available.
import { loadAssessmentProfile, focusWindowHours } from './prototypeAssessment';

export function autoScheduleActs(acts: PrototypeAct[]): PrototypeAct[] {
  const profile = loadAssessmentProfile();
  const bestHours = profile ? focusWindowHours(profile.bestFocusWindow) : [9, 9.5, 10, 10.5];
  const lowHours  = profile ? focusWindowHours(profile.lowEnergyWindow) : [14, 14.5, 15];
  const lightHours = [16, 16.5, 17, 17.5, 18];

  const sorted = [...acts].sort((a, b) => {
    const rank = { high: 0, medium: 1, low: 2 } as const;
    return rank[a.priority] - rank[b.priority];
  });

  const usedByDay = new Map<string, number[]>();
  const today = new Date();
  const nowHour = today.getHours();

  const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
  const hourToTime = (h: number) => {
    const hh = Math.floor(h).toString().padStart(2, '0');
    const mm = Math.round((h - Math.floor(h)) * 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const pickWindow = (act: PrototypeAct): number[] => {
    if (act.cognitiveLoad === 'high') return bestHours;
    if (act.cognitiveLoad === 'low')  return lightHours;
    const heavy = act.priority === 'high' || (act.attendees?.length || 0) > 0;
    if (heavy) return bestHours;
    if (act.priority === 'medium') return [...bestHours.slice(-2), ...lightHours.slice(0, 3)];
    return lightHours;
  };

  const placed: PrototypeAct[] = [];
  const dayCursor = new Date(today);

  for (const act of sorted) {
    const start = new Date(dayCursor);
    if (act.priority === 'high' && nowHour >= 16) {
      start.setDate(start.getDate() + 1);
    }

    let attempts = 0;
    let chosenDate = '';
    let chosenHour = 0;

    while (attempts < 14) {
      if (isWeekend(start)) { start.setDate(start.getDate() + 1); attempts++; continue; }
      const key = fmtDate(start);
      const used = usedByDay.get(key) || [];
      if (used.length >= 2) { start.setDate(start.getDate() + 1); attempts++; continue; }

      const candidates = pickWindow(act).filter(h => {
        if (h >= ENERGY_PROFILE.lunchStart && h < ENERGY_PROFILE.lunchEnd) return false;
        // Avoid the user's declared low-energy window
        if (lowHours.includes(h)) return false;
        return used.every(u => Math.abs(u - h) >= 0.5);
      });

      if (candidates.length > 0) {
        chosenHour = candidates[0];
        chosenDate = key;
        used.push(chosenHour);
        usedByDay.set(key, used);
        break;
      }
      start.setDate(start.getDate() + 1);
      attempts++;
    }

    const next: PrototypeAct = {
      ...act,
      proposedDate: chosenDate || act.proposedDate,
      proposedTime: chosenDate ? hourToTime(chosenHour) : act.proposedTime,
    };
    next.reminders = smartReminderDefaults(next);
    placed.push(next);
  }

  const byId = new Map(placed.map(a => [a.id, a]));
  return acts.map(a => byId.get(a.id) || a);
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

// Apply context-derived defaults to an extracted ACT.
// Pure: no mutation, no side effects. Run once after extraction.
import { CONTEXTS, inferCognitiveLoad } from './prototypeContexts';

export function applyContextDefaults(act: PrototypeAct, contextId: ContextId): PrototypeAct {
  const cfg = CONTEXTS[contextId];
  const attendees = act.attendees || [];
  // Pre-tick share-with people for medication-style ACTs in doctor context.
  const shareWith = contextId === 'doctor' && act.actType === 'medication'
    ? Array.from(new Set([...attendees, ...cfg.defaultShareWith]))
    : (act.shareWith || attendees);
  const cognitiveLoad = act.cognitiveLoad ?? inferCognitiveLoad({
    contextId,
    actType: act.actType,
    priority: act.priority,
    attendeesCount: attendees.length,
  });
  return { ...act, contextId, shareWith, cognitiveLoad };
}
