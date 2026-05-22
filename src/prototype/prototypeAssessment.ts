// Lightweight session-scoped assessment profile for the prototype.
// Drives scheduling, calendar copy, and tone — no backend, no diagnosis.

export type PrototypePersona =
  | 'rebuilding'        // brain health event / injury recovery
  | 'managing'          // daily cognitive load, focus, fatigue (ADHD, Long COVID, exec stress)
  | 'supporting';       // caregiver / family / friend supporting someone else

export type FocusWindow = 'early_morning' | 'late_morning' | 'afternoon' | 'evening' | 'varies';
export type SupportStyle = 'independent' | 'gentle_reminders' | 'shared_circle';
export type LoadPattern = 'overwhelm' | 'forgetting' | 'follow_through' | 'fatigue';

export interface PrototypeAssessmentProfile {
  persona: PrototypePersona;
  hardestRightNow: LoadPattern;
  bestFocusWindow: FocusWindow;       // when they're sharpest
  lowEnergyWindow: FocusWindow;       // when to protect / avoid
  supportStyle: SupportStyle;
  recommendedNext: 'capture' | 'commit' | 'calibrate' | 'celebrate';
  completedAt: string;                // ISO
}

const KEY = 'prototype:assessmentProfile';

export function saveAssessmentProfile(p: PrototypeAssessmentProfile) {
  sessionStorage.setItem(KEY, JSON.stringify(p));
}
export function loadAssessmentProfile(): PrototypeAssessmentProfile | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
export function clearAssessmentProfile() {
  sessionStorage.removeItem(KEY);
}
export function hasAssessment(): boolean {
  return !!loadAssessmentProfile();
}

// Map focus window -> decimal hour range used by scheduler.
export function focusWindowHours(w: FocusWindow): number[] {
  switch (w) {
    case 'early_morning': return [7, 7.5, 8, 8.5];
    case 'late_morning':  return [9, 9.5, 10, 10.5];
    case 'afternoon':     return [13.5, 14, 15.5, 16];
    case 'evening':       return [17.5, 18, 18.5, 19];
    case 'varies':        return [10, 10.5, 15.5, 16];
  }
}

export function windowLabel(w: FocusWindow): string {
  return {
    early_morning: 'Early morning (7–9)',
    late_morning:  'Late morning (9–11)',
    afternoon:     'Afternoon (1–4)',
    evening:       'Evening (5–7)',
    varies:        'Varies day to day',
  }[w];
}

export function personaLabel(p: PrototypePersona): string {
  return {
    rebuilding: 'Rebuilding',
    managing:   'Managing cognitive load',
    supporting: 'Supporting someone',
  }[p];
}
