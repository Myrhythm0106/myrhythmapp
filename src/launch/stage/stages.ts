import type { Persona } from '@/launch/persona/usePersona';

export type Stage =
  | 'pause'
  | 'ready'
  | 'steady'
  | 'strengthen'
  | 'stretch'
  | 'return'
  | 'sustain';

export interface StageData {
  id: Stage;
  label: string;
  order: number;
  /** Shown only when the active persona is 'recovery'. */
  recoveryAnchor: string;
  intent: string;
  lensByPersona: Record<Persona, string>;
}

export const stages: StageData[] = [
  {
    id: 'pause',
    label: 'Pause',
    order: 0,
    recoveryAnchor: 'Days 0–14 (incl. pre-discharge)',
    intent: 'Stillness. No tasks. Acknowledgement.',
    lensByPersona: {
      recovery: "You've been through something. No tasks today — just rest, and let people help.",
      caregiver: 'The first days are a lot. Breathe. The system can wait until next week.',
      productivity: 'A real pause. No optimisation, no planning — just stop.',
      student: 'A genuine break. The next term will still be there when you’re ready.',
    },
  },
  {
    id: 'ready',
    label: 'Ready',
    order: 1,
    recoveryAnchor: 'Days 14–28',
    intent: 'Willing to begin. Set things up gently.',
    lensByPersona: {
      recovery: 'Ready to start gently. Capture what matters, protect your energy.',
      caregiver: 'Ready to put a system in place. Small anchors first.',
      productivity: 'Ready to set the baseline. Clear the decks, then build.',
      student: 'Ready for the term. Set up the scaffolding.',
    },
  },
  {
    id: 'steady',
    label: 'Steady',
    order: 2,
    recoveryAnchor: 'Month 1–6',
    intent: 'Daily rhythm taking shape.',
    lensByPersona: {
      recovery: 'Early recovery. Build daily rhythm, low-cost wins.',
      caregiver: 'Settle into the caring rhythm without burning out.',
      productivity: 'First quarter. Lock in routines that compound.',
      student: 'First semester. Lectures + revision cadence.',
    },
  },
  {
    id: 'strengthen',
    label: 'Strengthen',
    order: 3,
    recoveryAnchor: 'Month 6–12',
    intent: 'Consolidation, stretching capacity.',
    lensByPersona: {
      recovery: 'Consolidation. Stretch capacity gently.',
      caregiver: 'Confidence in the routine. Reclaim your own time.',
      productivity: 'Year-1 momentum. Bigger commitments, deeper work.',
      student: 'Exams + projects. Recall under pressure.',
    },
  },
  {
    id: 'stretch',
    label: 'Stretch',
    order: 4,
    recoveryAnchor: 'Year 1–2',
    intent: 'Bigger commitments, deeper work.',
    lensByPersona: {
      recovery: 'Re-integration. Reintroduce harder roles.',
      caregiver: 'Plan for transitions (treatment phases, school changes).',
      productivity: 'Year-2 ambition. Lead, ship, raise the ceiling.',
      student: 'Specialisation. Internships, research, thesis.',
    },
  },
  {
    id: 'return',
    label: 'Return',
    order: 5,
    recoveryAnchor: 'Year 2–3',
    intent: 'Return to work, study, or public life.',
    lensByPersona: {
      recovery: 'Return to work, study, or public life.',
      caregiver: 'Transition out of intensive caring, or hand off.',
      productivity: 'Senior role, multi-project leadership.',
      student: 'Graduation, first role.',
    },
  },
  {
    id: 'sustain',
    label: 'Sustain',
    order: 6,
    recoveryAnchor: 'Year 3+',
    intent: 'Long-term maintenance.',
    lensByPersona: {
      recovery: 'Long-term maintenance. Catch dips early.',
      caregiver: 'Sustainable support over years.',
      productivity: 'Mastery. Defend the rhythm against drift.',
      student: 'Continuous learning, career rhythm.',
    },
  },
];

export function getStage(id: Stage): StageData {
  return stages.find((s) => s.id === id) ?? stages[2]; // fallback to steady
}
