/** My first loop: the five steps every person walks, derived only from saved records. */
export const LOOP_STEPS = ['capture', 'confirm', 'diary', 'done', 'circle'] as const;
export type LoopStep = typeof LOOP_STEPS[number];

export interface LoopCounts { recordings: number; confirmed: number; scheduled: number; finished: number; circle: number }

export function loopProgress(c: LoopCounts) {
  const done: Record<LoopStep, boolean> = {
    capture: c.recordings > 0,
    confirm: c.confirmed > 0,
    diary: c.scheduled > 0,
    done: c.finished > 0,
    circle: c.circle > 0,
  };
  const nextIndex = LOOP_STEPS.findIndex(s => !done[s]);
  // The core loop is complete once something has been followed through; inviting someone stays optional.
  const coreComplete = done.capture && done.confirm && done.diary && done.done;
  return { done, next: nextIndex === -1 ? null : LOOP_STEPS[nextIndex], nextIndex, coreComplete, allComplete: nextIndex === -1 };
}

type Role = 'brain-injury' | 'caregiver' | 'everyday' | 'executive' | 'student';
interface StepCopy { label: string; next: string; to: string }
const BASE: Record<LoopStep, StepCopy> = {
  capture: { label: 'Capture', next: 'Record my first conversation', to: '/launch/memory?record=1' },
  confirm: { label: 'Confirm', next: 'Choose the next steps I want to keep', to: '/launch/memory' },
  diary: { label: 'Diary', next: 'Give one next step a time in my diary', to: '/launch/memory' },
  done: { label: 'Follow through', next: 'Tick my first step as done', to: '/launch/calendar' },
  circle: { label: 'Loop someone in', next: 'Invite someone I trust, if I choose', to: '/launch/support' },
};
const CAPTURE_BY_ROLE: Record<Role, string> = {
  'brain-injury': 'Record my first appointment',
  caregiver: 'Record an appointment or family conversation',
  everyday: 'Clear one thing from my head',
  executive: 'Record my first meeting',
  student: 'Record a lecture or study conversation',
};

export function loopCopy(step: LoopStep, role?: string | null): StepCopy {
  const base = BASE[step];
  if (step === 'capture' && role && role in CAPTURE_BY_ROLE) return { ...base, next: CAPTURE_BY_ROLE[role as Role] };
  return base;
}

/** Screens that belong to the first loop, where the "Step x of 5" line may appear. */
export const LOOP_PATHS = ['/launch/memory', '/launch/calendar', '/launch/support'];
