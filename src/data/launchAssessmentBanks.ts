// Shared, plain-language assessment for /launch/assessment.
// Part 1 reflects everyday brain-health habits. Part 2 captures user-owned planning preferences.
// Source codes map only to the internal reference log; no practitioner or programme names appear here.

import type { PillarId } from '@/launch/framework/cognitiveCapital';

export const ASSESSMENT_SCHEMA_VERSION = 4;
export type PersonaKey = 'brain-injury' | 'caregiver' | 'executive' | 'student';
export type LetterId =
  | 'mindset' | 'yesReality' | 'rhythm' | 'harnessSupport'
  | 'yourVictories' | 'transform' | 'heal' | 'multiply';
export type HabitId =
  | 'habitSleep' | 'habitMove' | 'habitFuel' | 'habitProtect'
  | 'habitExposure' | 'habitCalm' | 'habitLearnConnect' | 'habitPurpose';
export type PlanningId = 'rhythmDetail' | 'planningRhythm' | 'planningSupport' | 'planningGoal';
export type QuestionId = LetterId | 'followThrough' | HabitId | PlanningId;

export interface AssessmentOption {
  value: string;
  label: string;
  description?: string;
  score: 0 | 1 | 2 | 3;
}

export interface RhythmDetailRow {
  id: 'focusLength' | 'energyDrain';
  label: string;
  options: { value: string; label: string }[];
}

export interface AssessmentQuestion {
  id: QuestionId;
  letter: 'M' | 'Y' | 'R' | 'H' | 'T';
  word: string;
  slot?: LetterId;
  pillar: PillarId;
  brainHealthLens: string;
  title: string;
  subtitle?: string;
  multiSelect?: boolean;
  kind?: 'default' | 'rhythm-detail';
  rows?: RhythmDetailRow[];
  options: AssessmentOption[];
  section: 'brain-health' | 'planning';
  scored: boolean;
}

export const RHYTHM_DETAIL_ROWS: RhythmDetailRow[] = [
  {
    id: 'focusLength',
    label: 'How long can I comfortably focus at one time?',
    options: [
      { value: '20', label: 'About 20 minutes' },
      { value: '45', label: 'About 45 minutes' },
      { value: '90', label: 'An hour or longer' },
    ],
  },
  {
    id: 'energyDrain',
    label: 'What drains my energy fastest?',
    options: [
      { value: 'back-to-back', label: 'Too many things together' },
      { value: 'noise-crowds', label: 'Noise or busy places' },
      { value: 'decisions', label: 'Too many decisions' },
    ],
  },
];

export interface AssessmentBank {
  persona: PersonaKey;
  intro: string;
  preQuestion: { title: string; subtitle: string };
  questions: AssessmentQuestion[];
}

const NO_SUPPORT_VALUES = new Set(['solo', 'on-my-own', 'not-yet', 'just-me']);
export function resolveHasSupport(answerValue: string | undefined): boolean {
  return Boolean(answerValue && !NO_SUPPORT_VALUES.has(answerValue));
}

const QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'habitSleep', letter: 'H', word: 'Rest', slot: 'heal', pillar: 'biological',
    brainHealthLens: 'Rest and recharge', // ref BH-01
    title: 'How do most nights go for you?',
    subtitle: 'Choose the answer that is closest to a usual week.', section: 'brain-health', scored: true,
    options: [
      { value: 'under-6', label: 'Short or broken most nights', score: 0 },
      { value: 'patchy', label: 'Some restful nights, some not', score: 1 },
      { value: 'rested', label: 'I usually wake feeling rested', score: 3 },
    ],
  },
  {
    id: 'habitMove', letter: 'R', word: 'Movement', slot: 'rhythm', pillar: 'biological',
    brainHealthLens: 'Movement and circulation', // ref BH-02
    title: 'How often do you move your body in a usual week?',
    subtitle: 'Walking, gardening and gentle movement all count.', section: 'brain-health', scored: true,
    options: [
      { value: 'rarely', label: 'Not often at the moment', score: 0 },
      { value: 'once-twice', label: 'Once or twice most weeks', score: 1 },
      { value: 'most-days', label: 'On most days', score: 3 },
    ],
  },
  {
    id: 'habitFuel', letter: 'T', word: 'Fuel', slot: 'transform', pillar: 'biological',
    brainHealthLens: 'Everyday food and hydration', // ref BH-03
    title: 'What are food and drinks like on a usual day?',
    subtitle: 'No counting and no judgement.', section: 'brain-health', scored: true,
    options: [
      { value: 'on-the-go', label: 'Often rushed, sugary or low on water', score: 0 },
      { value: 'mixed', label: 'It varies from day to day', score: 1 },
      { value: 'mostly-fresh', label: 'Mostly balanced meals and enough water', score: 3 },
    ],
  },
  {
    id: 'habitProtect', letter: 'Y', word: 'Protection', slot: 'yesReality', pillar: 'biological',
    brainHealthLens: 'Protecting the head from another injury', // ref BH-04
    title: 'How consistently do you protect your head?',
    subtitle: 'For example: seatbelts, helmets and avoiding unsafe knocks.', section: 'brain-health', scored: true,
    options: [
      { value: 'not-always', label: 'Not always', score: 0 },
      { value: 'usually', label: 'Usually, but I sometimes forget', score: 2 },
      { value: 'careful', label: 'Consistently', score: 3 },
    ],
  },
  {
    id: 'habitExposure', letter: 'M', word: 'Everyday choices', slot: 'mindset', pillar: 'biological',
    brainHealthLens: 'Reducing avoidable exposures', // ref BH-05
    title: 'Which answer is closest to your usual week?',
    subtitle: 'This is about smoking and alcohol, not perfection.', section: 'brain-health', scored: true,
    options: [
      { value: 'often', label: 'Smoking or drinking happens often', score: 0 },
      { value: 'sometimes', label: 'It happens sometimes', score: 1 },
      { value: 'rarely-never', label: 'Rarely or never', score: 3 },
    ],
  },
  {
    id: 'habitCalm', letter: 'Y', word: 'Calm', slot: 'yourVictories', pillar: 'psychological',
    brainHealthLens: 'Responding to pressure', // ref BH-06
    title: 'When stress builds, what usually happens?',
    section: 'brain-health', scored: true,
    options: [
      { value: 'spiral', label: 'My thoughts race and are hard to settle', score: 0 },
      { value: 'push-through', label: 'I push through and feel it later', score: 1 },
      { value: 'some-tools', label: 'I have a way to pause and settle', score: 3 },
    ],
  },
  {
    id: 'habitLearnConnect', letter: 'H', word: 'Connection', slot: 'harnessSupport', pillar: 'social',
    brainHealthLens: 'Learning and trusted connection', // ref BH-07
    title: 'How often do you learn something or connect with someone you trust?',
    section: 'brain-health', scored: true,
    options: [
      { value: 'rarely', label: 'Rarely at the moment', score: 0 },
      { value: 'some-weeks', label: 'Some weeks', score: 1 },
      { value: 'most-weeks', label: 'Most weeks', score: 3 },
    ],
  },
  {
    id: 'habitPurpose', letter: 'M', word: 'Meaning', slot: 'multiply', pillar: 'spiritual',
    brainHealthLens: 'Purpose and helpful routines', // ref BH-08
    title: 'How often does your week include something that matters to you?',
    section: 'brain-health', scored: true,
    options: [
      { value: 'hard-to-find', label: 'It is hard to find that right now', score: 0 },
      { value: 'sometimes', label: 'Sometimes', score: 1 },
      { value: 'often', label: 'Often', score: 3 },
    ],
  },
  {
    id: 'planningRhythm', letter: 'R', word: 'My best time', slot: 'rhythm', pillar: 'biological',
    brainHealthLens: 'My preferred time',
    title: 'At what time of day do thinking and everyday tasks usually feel easiest?',
    subtitle: 'This is your preference. You can change it later.', section: 'planning', scored: false,
    options: [
      { value: 'morning', label: 'Morning', score: 0 },
      { value: 'afternoon', label: 'Afternoon', score: 0 },
      { value: 'evening', label: 'Evening or it varies', score: 0 },
    ],
  },
  {
    id: 'rhythmDetail', letter: 'R', word: 'My pace', slot: 'rhythm', pillar: 'biological',
    brainHealthLens: 'My focus length and energy drains',
    title: 'What pace works for you?',
    subtitle: 'These choices shape suggested breaks, never rules.', kind: 'rhythm-detail', rows: RHYTHM_DETAIL_ROWS,
    options: [], section: 'planning', scored: false,
  },
  {
    id: 'planningSupport', letter: 'H', word: 'My support', slot: 'harnessSupport', pillar: 'social',
    brainHealthLens: 'Support I choose',
    title: 'Who, if anyone, may support you?',
    subtitle: 'Nobody sees anything unless you give permission.', section: 'planning', scored: false,
    options: [
      { value: 'solo', label: 'Just me for now', score: 0 },
      { value: 'one-person', label: 'One trusted person', score: 0 },
      { value: 'few-people', label: 'A few people I choose', score: 0 },
    ],
  },
  {
    id: 'planningGoal', letter: 'Y', word: 'My next step', slot: 'yourVictories', pillar: 'spiritual',
    brainHealthLens: 'What matters this week',
    title: 'What would make this week feel better or more manageable?',
    section: 'planning', scored: false,
    options: [
      { value: 'remember', label: 'Remember the important things', score: 0 },
      { value: 'pace', label: 'Have a steadier pace', score: 0 },
      { value: 'complete', label: 'Finish one thing that matters', score: 0 },
    ],
  },
];

const PERSONAS: PersonaKey[] = ['brain-injury', 'caregiver', 'executive', 'student'];
const banks = Object.fromEntries(PERSONAS.map((persona) => [persona, {
  persona,
  intro: 'First, everyday brain health. Then, how my days work best.',
  preQuestion: { title: 'A few questions about everyday life', subtitle: 'There are no right or wrong answers.' },
  questions: QUESTIONS,
}])) as Record<PersonaKey, AssessmentBank>;

export function getAssessmentBank(persona: string | null | undefined): AssessmentBank | null {
  if (!persona) return null;
  const legacyMap: Record<string, PersonaKey> = {
    recovery: 'brain-injury', 'goal-achiever': 'executive', productivity: 'executive', wellness: 'brain-injury',
  };
  const key = (persona in banks ? persona : legacyMap[persona]) as PersonaKey | undefined;
  return key && key in banks ? banks[key] : null;
}

export const PERSONA_LABEL: Record<PersonaKey, string> = {
  'brain-injury': 'Rebuilding after a brain change', caregiver: 'Caring for someone I love',
  executive: 'Protecting my focus at work', student: 'Studying and learning',
};

export type LetterScores = Record<LetterId, number> & Partial<Record<QuestionId, number>>;
export interface AssessmentAnswer { primary: string; alsoFits: string[]; }
export interface BrainHealthScore {
  total: number;
  letters: LetterScores;
  pillars: Record<PillarId, number>;
  version: number;
}

export function normalizeAnswer(raw: unknown): AssessmentAnswer | null {
  if (!raw) return null;
  if (typeof raw === 'string') return { primary: raw, alsoFits: [] };
  if (Array.isArray(raw)) return raw.length ? { primary: raw[0], alsoFits: raw.slice(1) } : null;
  if (typeof raw === 'object' && 'primary' in (raw as Record<string, unknown>)) {
    const r = raw as AssessmentAnswer;
    return { primary: r.primary, alsoFits: Array.isArray(r.alsoFits) ? r.alsoFits : [] };
  }
  return null;
}

export function computeBrainHealthScore(bank: AssessmentBank, answers: Record<string, unknown>): BrainHealthScore {
  const questionScores: Partial<Record<QuestionId, number>> = {};
  let raw = 0;
  let scoredCount = 0;
  for (const q of bank.questions) {
    if (!q.scored || q.kind === 'rhythm-detail') continue;
    const ans = normalizeAnswer(answers[q.id]);
    const score = ans ? (q.options.find((o) => o.value === ans.primary)?.score ?? 0) : 0;
    questionScores[q.id] = score;
    raw += score;
    scoredCount++;
  }

  const letterIds: LetterId[] = ['mindset', 'yesReality', 'rhythm', 'harnessSupport', 'yourVictories', 'transform', 'heal', 'multiply'];
  const letters = { ...questionScores } as LetterScores;
  for (const id of letterIds) {
    const matching = bank.questions.filter((q) => q.scored && (q.slot ?? q.id) === id);
    letters[id] = matching.length
      ? Math.round((matching.reduce((sum, q) => sum + (questionScores[q.id] ?? 0), 0) / matching.length) * 10) / 10
      : 0;
  }

  const pillars = { biological: 0, psychological: 0, social: 0, spiritual: 0 } as Record<PillarId, number>;
  const counts = { biological: 0, psychological: 0, social: 0, spiritual: 0 } as Record<PillarId, number>;
  for (const q of bank.questions.filter((item) => item.scored)) {
    pillars[q.pillar] += questionScores[q.id] ?? 0;
    counts[q.pillar]++;
  }
  for (const p of Object.keys(pillars) as PillarId[]) {
    pillars[p] = counts[p] ? Math.round((pillars[p] / counts[p]) * 10) / 10 : 0;
  }
  return {
    total: scoredCount ? Math.round((raw / (scoredCount * 3)) * 100) : 0,
    letters,
    pillars,
    version: ASSESSMENT_SCHEMA_VERSION,
  };
}
