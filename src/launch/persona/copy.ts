import type { Persona } from './usePersona';

export interface PersonaCopy {
  greeting: { morning: string; afternoon: string; evening: string };
  subgreeting: string;
  scaffoldsTitle: string;
  winsTitle: string;
  ichooseLede?: string;
  capabilityLens: {
    capture: string;
    commit: string;
    calibrate: string;
  };
}

export const personaCopy: Record<Persona, PersonaCopy> = {
  recovery: {
    greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
    subgreeting: 'No catching up. Just this moment.',
    scaffoldsTitle: "Today's scaffolds",
    winsTitle: "Today's gentle wins",
    capabilityLens: {
      capture: 'For you: keep a calm record of clinical and family conversations so nothing is left to recall under pressure.',
      commit: 'For you: a plan that respects fatigue and protects the energy you have.',
      calibrate: 'For you: a quiet read on patterns — no scoreboards, no streak pressure.',
    },
  },
  caregiver: {
    greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
    subgreeting: 'Supporting someone takes a rhythm of its own. Start here.',
    scaffoldsTitle: "Today's anchors",
    winsTitle: "Today's quiet wins — for both of you",
    ichooseLede: 'A line for the day. Yours first.',
    capabilityLens: {
      capture: 'For you: record appointments accurately so the person you support never has to remember alone.',
      commit: 'For you: coordinate care without losing your own day.',
      calibrate: 'For you: notice your own load early — before it becomes burnout.',
    },
  },
  productivity: {
    greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
    subgreeting: 'One clear day at a time. Signal over noise.',
    scaffoldsTitle: "Today's focus blocks",
    winsTitle: "Today's wins",
    ichooseLede: 'A daily intention. Choose with conviction.',
    capabilityLens: {
      capture: 'For you: turn meetings and ideas into a searchable record — leverage without a notebook.',
      commit: 'For you: protect deep work where it matters; defend the calendar from low-value churn.',
      calibrate: 'For you: a private weekly read on where your attention actually went.',
    },
  },
  student: {
    greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
    subgreeting: 'One block at a time. The work compounds.',
    scaffoldsTitle: "Today's study blocks",
    winsTitle: "Today's wins",
    ichooseLede: 'A line to study by today.',
    capabilityLens: {
      capture: 'For you: record lectures and revision notes, searchable when exam pressure hits.',
      commit: 'For you: pace study and rest so the week ends in recall, not burnout.',
      calibrate: 'For you: see which subjects are gaining ground — quietly, week over week.',
    },
  },
};

export function getPersonaCopy(persona: Persona): PersonaCopy {
  return personaCopy[persona] ?? personaCopy.recovery;
}
