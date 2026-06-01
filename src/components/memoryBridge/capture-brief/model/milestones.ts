import type { ActionMilestone, BriefAction } from './types';

/**
 * Generate a milestone ladder backwards from the due date.
 *  ≥14d → 4 milestones at 25/50/75/90%
 *   7-13d → 3 milestones at 33/66/90%
 *   3-6d  → 2 milestones at 50/90%
 *   ≤2d   → 1 "Start now" today + due
 */
export function generateMilestones(
  action: BriefAction,
  todayISO: string = isoToday(),
): ActionMilestone[] {
  const due = action.dueDate?.date;
  if (!due) return [];

  const today = new Date(todayISO + 'T00:00:00');
  const dueD = new Date(due + 'T00:00:00');
  const leadDays = Math.max(0, Math.round((dueD.getTime() - today.getTime()) / 86400000));

  if (leadDays <= 0) return [];

  const type = inferActionType(action.text);
  const labels = LABELS[type];

  let percents: number[] = [];
  if (leadDays >= 14) percents = [0.25, 0.5, 0.75, 0.9];
  else if (leadDays >= 7) percents = [0.33, 0.66, 0.9];
  else if (leadDays >= 3) percents = [0.5, 0.9];
  else if (leadDays >= 1) percents = [0]; // "Start now"
  else return [];

  const milestones: ActionMilestone[] = percents.map((p, idx) => {
    const offsetDays = Math.round(leadDays * p);
    const date = addDays(today, offsetDays);
    const label =
      percents.length === 1 ? 'Start now' : labels[idx] ?? labels[labels.length - 1];
    return {
      id: `${action.id}-m${idx}`,
      label,
      date: toISO(date),
      time: '10:30',
      percentOfLeadTime: Math.round(p * 100),
      status: 'pending',
      reminderMinutesBefore: 1440,
      loadTier: idx === percents.length - 1 ? 'high' : 'med',
    };
  });

  return milestones;
}

export function recalculateMilestones(
  action: BriefAction,
  todayISO: string = isoToday(),
): ActionMilestone[] {
  // Preserve user-edited rows
  const fresh = generateMilestones(action, todayISO);
  const edits = new Map(
    (action.milestones || []).filter(m => m.userEdited).map(m => [m.id, m]),
  );
  return fresh.map(m => edits.get(m.id) || m);
}

type ActionType = 'deliverable' | 'decision' | 'externalMeeting' | 'followUp' | 'generic';

const LABELS: Record<ActionType, string[]> = {
  deliverable: ['Outline', 'First draft', 'Review', 'Final'],
  decision: ['Gather inputs', 'Shortlist', 'Decide', 'Confirm'],
  externalMeeting: ['Send invite', 'Agenda', 'Pre-read', 'Meeting held'],
  followUp: ['Draft response', 'Send', 'Confirm', 'Close out'],
  generic: ['Kick off', 'Mid-point', 'Pre-deadline', 'Final'],
};

function inferActionType(text: string): ActionType {
  const t = text.toLowerCase();
  if (/(draft|write|prepare|deck|paper|document|report|brief)/.test(t)) return 'deliverable';
  if (/(decide|choose|approve|sign off|select)/.test(t)) return 'decision';
  if (/(meet|book|schedule|invite|call with)/.test(t)) return 'externalMeeting';
  if (/(reply|respond|follow up|chase|confirm)/.test(t)) return 'followUp';
  return 'generic';
}

function isoToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
