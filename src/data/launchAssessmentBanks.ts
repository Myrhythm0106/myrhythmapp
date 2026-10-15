// Shared, plain-language assessment for /launch/assessment.
// Part 1 reflects everyday brain-health habits. Part 2 captures user-owned planning preferences.
// Source codes map only to the internal reference log; no practitioner or programme names appear here.

import type { PillarId } from '@/launch/framework/cognitiveCapital';
import type { YesId } from '@/launch/framework/yes';

export const ASSESSMENT_SCHEMA_VERSION = 5;
export type PersonaKey = 'brain-injury' | 'caregiver' | 'executive' | 'student' | 'general';
export type LetterId =
  | 'mindset' | 'yesReality' | 'rhythm' | 'harnessSupport'
  | 'yourVictories' | 'transform' | 'heal' | 'multiply';
export type HabitId =
  | 'habitSleep' | 'habitMove' | 'habitFuel' | 'habitProtect'
  | 'habitExposure' | 'habitCalm' | 'habitLearnConnect' | 'habitPurpose';
export type PlanningId = 'rhythmDetail' | 'planningRhythm' | 'planningSupport' | 'planningGoal'
  | 'memorySlips' | 'memoryMethod' | 'memoryRecall' | 'dayStart' | 'energyDip'
  | 'mindsetTalk' | 'hardSituations' | 'weekFixed' | 'circleHelp' | 'winsStyle'
  | 'reminderStyle' | 'reminderLead' | 'hardDays' | 'visionAreas';
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
  /** YES part (Quick Start only). */
  yes?: YesId;
  /** quick = YES assessment; full = MYRHYTHM Full Picture. */
  tier: 'quick' | 'full';
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
  /** Every question (used for lookups and history). */
  questions: AssessmentQuestion[];
  quickQuestions: AssessmentQuestion[];
  fullQuestions: AssessmentQuestion[];
}

const NO_SUPPORT_VALUES = new Set(['solo', 'none-yet', 'on-my-own', 'not-yet', 'just-me']);
export function resolveHasSupport(answerValue: string | undefined): boolean {
  return Boolean(answerValue && !NO_SUPPORT_VALUES.has(answerValue));
}


const QUESTIONS: AssessmentQuestion[] = [
  /* ---------------- Quick Start · Y — Your Starting Point ---------------- */
  {
    id: 'memorySlips', yes: 'Y', tier: 'quick', letter: 'Y', word: 'What slips', slot: 'yesReality', pillar: 'psychological',
    brainHealthLens: 'An honest memory starting point', // ref BH-09
    title: 'What slips your mind most often?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'appointments', label: 'Appointments and dates', score: 0 },
      { value: 'half-done', label: 'Tasks I started but did not finish', score: 0 },
      { value: 'what-was-said', label: 'What people told me', score: 0 },
      { value: 'where-things-are', label: 'Where I put things', score: 0 },
    ],
  },
  {
    id: 'memoryMethod', yes: 'Y', tier: 'quick', letter: 'H', word: 'What helps now', slot: 'harnessSupport', pillar: 'social',
    brainHealthLens: 'Memory supports already in place', // ref BH-09
    title: 'How do you remember things now?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'phone', label: 'Reminders on my phone', score: 0 },
      { value: 'paper', label: 'Notes, lists or a paper diary', score: 0 },
      { value: 'someone', label: 'Someone reminds me', score: 0 },
      { value: 'nothing', label: 'Nothing yet — I try to keep it in my head', score: 0 },
    ],
  },
  {
    id: 'memoryRecall', yes: 'Y', tier: 'quick', letter: 'M', word: 'Next-day memory', slot: 'mindset', pillar: 'psychological',
    brainHealthLens: 'Recall after a conversation', // ref BH-09
    title: 'The day after a conversation or appointment, how much do you usually remember?',
    section: 'planning', scored: false,
    options: [
      { value: 'little', label: 'Very little — it fades quickly', score: 0 },
      { value: 'main-points', label: 'The main points, not the details', score: 0 },
      { value: 'most', label: 'Most of it', score: 0 },
    ],
  },

  /* ---------------- Quick Start · E — Everyday Energy ---------------- */
  {
    id: 'habitSleep', yes: 'E', tier: 'quick', letter: 'H', word: 'Rest', slot: 'heal', pillar: 'biological',
    brainHealthLens: 'Rest and recharge', // ref BH-01
    title: 'How well do you sleep at night?',
    subtitle: 'Choose the answer that is closest to a usual week.', section: 'brain-health', scored: true,
    options: [
      { value: 'under-6', label: 'Short or broken most nights', score: 0 },
      { value: 'patchy', label: 'Some restful nights, some not', score: 1 },
      { value: 'rested', label: 'I usually wake feeling rested', score: 3 },
    ],
  },
  {
    id: 'habitMove', yes: 'E', tier: 'quick', letter: 'R', word: 'Movement', slot: 'rhythm', pillar: 'biological',
    brainHealthLens: 'Movement and circulation', // ref BH-02
    title: 'How often do you move your body each week?',
    subtitle: 'Walking, gardening and gentle movement all count.', section: 'brain-health', scored: true,
    options: [
      { value: 'rarely', label: 'Not often at the moment', score: 0 },
      { value: 'once-twice', label: 'Once or twice most weeks', score: 1 },
      { value: 'most-days', label: 'On most days', score: 3 },
    ],
  },
  {
    id: 'habitFuel', yes: 'E', tier: 'quick', letter: 'T', word: 'Fuel', slot: 'transform', pillar: 'biological',
    brainHealthLens: 'Everyday food and hydration', // ref BH-03
    title: 'How well do you eat and drink on a usual day?',
    subtitle: 'No counting and no judgement.', section: 'brain-health', scored: true,
    options: [
      { value: 'on-the-go', label: 'Often rushed, sugary or low on water', score: 0 },
      { value: 'mixed', label: 'It varies from day to day', score: 1 },
      { value: 'mostly-fresh', label: 'Mostly balanced meals and enough water', score: 3 },
    ],
  },
  {
    id: 'habitCalm', yes: 'E', tier: 'quick', letter: 'Y', word: 'Calm', slot: 'yourVictories', pillar: 'psychological',
    brainHealthLens: 'Responding to pressure', // ref BH-06
    title: 'What usually happens when you feel stressed?',
    section: 'brain-health', scored: true,
    options: [
      { value: 'spiral', label: 'My thoughts race and are hard to settle', score: 0 },
      { value: 'push-through', label: 'I push through and feel it later', score: 1 },
      { value: 'some-tools', label: 'I have a way to pause and settle', score: 3 },
    ],
  },

  /* ---------------- Quick Start · S — Steady Rhythm ---------------- */
  {
    id: 'dayStart', yes: 'S', tier: 'quick', letter: 'R', word: 'My day', slot: 'rhythm', pillar: 'biological',
    brainHealthLens: 'When my day starts and winds down',
    title: 'When does your day usually start and wind down?',
    section: 'planning', scored: false,
    options: [
      { value: 'early', label: 'Early — up before 7am, winding down by 9pm', score: 0 },
      { value: 'middle', label: 'Middle — up 7–9am, winding down by 10–11pm', score: 0 },
      { value: 'late', label: 'Late — up after 9am, winding down after 11pm', score: 0 },
    ],
  },
  {
    id: 'planningRhythm', yes: 'S', tier: 'quick', letter: 'R', word: 'My best time', slot: 'rhythm', pillar: 'biological',
    brainHealthLens: 'My preferred time',
    title: 'What time of day do you think and get things done most easily?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'morning', label: 'Morning', score: 0 },
      { value: 'afternoon', label: 'Afternoon', score: 0 },
      { value: 'evening', label: 'Evening', score: 0 },
      { value: 'varies', label: 'It varies', score: 0 },
    ],
  },
  {
    id: 'energyDip', yes: 'S', tier: 'quick', letter: 'R', word: 'Energy dip', slot: 'rhythm', pillar: 'biological',
    brainHealthLens: 'When energy usually drops',
    title: 'When does your energy usually dip?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'mid-morning', label: 'Mid-morning', score: 0 },
      { value: 'after-lunch', label: 'After lunch', score: 0 },
      { value: 'late-afternoon', label: 'Late afternoon', score: 0 },
      { value: 'evening', label: 'Evening', score: 0 },
    ],
  },
  {
    id: 'rhythmDetail', yes: 'S', tier: 'quick', letter: 'R', word: 'My pace', slot: 'rhythm', pillar: 'biological',
    brainHealthLens: 'My focus length and energy drains',
    title: 'How do you work best?',
    subtitle: 'These choices shape suggested breaks, never rules.', kind: 'rhythm-detail', rows: RHYTHM_DETAIL_ROWS,
    options: [], section: 'planning', scored: false,
  },
  {
    id: 'planningSupport', yes: 'S', tier: 'quick', letter: 'H', word: 'My support', slot: 'harnessSupport', pillar: 'social',
    brainHealthLens: 'Support I choose',
    title: 'Who helps you, or would you like to help you?',
    subtitle: 'Nobody sees anything unless you give permission.', multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'family', label: 'Family or partner', score: 0 },
      { value: 'friend', label: 'A friend', score: 0 },
      { value: 'professional', label: 'A carer or professional', score: 0 },
      { value: 'solo', label: 'Just me for now', score: 0 },
    ],
  },
  {
    id: 'planningGoal', yes: 'S', tier: 'quick', letter: 'M', word: 'Meaning', slot: 'multiply', pillar: 'spiritual',
    brainHealthLens: 'What matters this week',
    title: 'What would make this week feel easier — and matter most to you?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'remember', label: 'Remember the important things', score: 0 },
      { value: 'pace', label: 'Have a steadier pace', score: 0 },
      { value: 'complete', label: 'Finish one thing that matters', score: 0 },
    ],
  },

  /* ---------------- Full Picture · MYRHYTHM, one short part per letter ---------------- */
  {
    id: 'habitExposure', tier: 'full', letter: 'M', word: 'Mindset', slot: 'mindset', pillar: 'biological',
    brainHealthLens: 'Reducing avoidable exposures', // ref BH-05
    title: 'How often do you smoke or drink alcohol?',
    subtitle: 'Not about being perfect — just what is typical.', section: 'brain-health', scored: true,
    options: [
      { value: 'often', label: 'Smoking or drinking happens often', score: 0 },
      { value: 'sometimes', label: 'It happens sometimes', score: 1 },
      { value: 'rarely-never', label: 'Rarely or never', score: 3 },
    ],
  },
  {
    id: 'mindsetTalk', tier: 'full', letter: 'M', word: 'Mindset', slot: 'mindset', pillar: 'psychological',
    brainHealthLens: 'How I talk to myself after a slip',
    title: 'When you forget something, what do you usually tell yourself?',
    section: 'planning', scored: false,
    options: [
      { value: 'hard-on-me', label: 'I am hard on myself', score: 0 },
      { value: 'shrug', label: 'I shrug it off and move on', score: 0 },
      { value: 'plan', label: 'I look for a way to make it easier next time', score: 0 },
    ],
  },
  {
    id: 'habitProtect', tier: 'full', letter: 'Y', word: 'Yes to Reality', slot: 'yesReality', pillar: 'biological',
    brainHealthLens: 'Protecting the head from another injury', // ref BH-04
    title: 'How often do you protect your head?',
    subtitle: 'For example: seatbelts, helmets and avoiding unsafe knocks.', section: 'brain-health', scored: true,
    options: [
      { value: 'not-always', label: 'Not always', score: 0 },
      { value: 'usually', label: 'Usually, but I sometimes forget', score: 2 },
      { value: 'careful', label: 'Consistently', score: 3 },
    ],
  },
  {
    id: 'hardSituations', tier: 'full', letter: 'Y', word: 'Yes to Reality', slot: 'yesReality', pillar: 'psychological',
    brainHealthLens: 'Where memory is hardest',
    title: 'Which situations are hardest to remember afterwards?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'appointments', label: 'Medical or official appointments', score: 0 },
      { value: 'phone-calls', label: 'Phone calls', score: 0 },
      { value: 'family-plans', label: 'Family plans and arrangements', score: 0 },
      { value: 'work', label: 'Work or study meetings', score: 0 },
    ],
  },
  {
    id: 'weekFixed', tier: 'full', letter: 'R', word: 'Rhythm', slot: 'rhythm', pillar: 'biological',
    brainHealthLens: 'Fixed parts of my week',
    title: 'Which parts of your week are fixed?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'work', label: 'Work, study or volunteering', score: 0 },
      { value: 'appointments', label: 'Regular appointments', score: 0 },
      { value: 'caring', label: 'Caring for someone', score: 0 },
      { value: 'regular-reminders', label: 'Regular reminders I rely on', score: 0 },
    ],
  },
  {
    id: 'habitLearnConnect', tier: 'full', letter: 'H', word: 'Harness Support', slot: 'harnessSupport', pillar: 'social',
    brainHealthLens: 'Learning and trusted connection', // ref BH-07
    title: 'How often do you learn something new or spend time with someone you trust?',
    section: 'brain-health', scored: true,
    options: [
      { value: 'rarely', label: 'Rarely at the moment', score: 0 },
      { value: 'some-weeks', label: 'Some weeks', score: 1 },
      { value: 'most-weeks', label: 'Most weeks', score: 3 },
    ],
  },
  {
    id: 'circleHelp', tier: 'full', letter: 'H', word: 'Harness Support', slot: 'harnessSupport', pillar: 'social',
    brainHealthLens: 'Help I would welcome',
    title: 'What help from your Support Circle would you welcome?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'reminders', label: 'A nudge before important things', score: 0 },
      { value: 'check-ins', label: 'A quick check-in now and then', score: 0 },
      { value: 'come-along', label: 'Coming with me to appointments', score: 0 },
      { value: 'none-yet', label: 'None for now', score: 0 },
    ],
  },
  {
    id: 'winsStyle', tier: 'full', letter: 'Y', word: 'Your Victories', slot: 'yourVictories', pillar: 'psychological',
    brainHealthLens: 'Noticing progress',
    title: 'How would you like to notice your wins?',
    section: 'planning', scored: false,
    options: [
      { value: 'quiet', label: 'A quiet tick — nothing fussy', score: 0 },
      { value: 'weekly', label: 'A short look back each week', score: 0 },
      { value: 'share', label: 'Share them with someone I choose', score: 0 },
    ],
  },
  {
    id: 'reminderStyle', tier: 'full', letter: 'T', word: 'Transform', slot: 'transform', pillar: 'psychological',
    brainHealthLens: 'Reminders that actually land',
    title: 'Which kind of reminder works best for you?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'sound', label: 'A sound', score: 0 },
      { value: 'vibration', label: 'A vibration', score: 0 },
      { value: 'spoken', label: 'Spoken out loud', score: 0 },
      { value: 'written', label: 'A short written note', score: 0 },
    ],
  },
  {
    id: 'reminderLead', tier: 'full', letter: 'T', word: 'Transform', slot: 'transform', pillar: 'psychological',
    brainHealthLens: 'How far ahead to remind',
    title: 'How far ahead would you like to be reminded?',
    section: 'planning', scored: false,
    options: [
      { value: 'evening-before', label: 'The evening before', score: 0 },
      { value: 'hour-before', label: 'An hour before', score: 0 },
      { value: 'both', label: 'Both', score: 0 },
    ],
  },
  {
    id: 'hardDays', tier: 'full', letter: 'H', word: 'Heal', slot: 'heal', pillar: 'biological',
    brainHealthLens: 'What helps on a harder day',
    title: 'On a harder day, what helps most?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'fewer-things', label: 'Fewer things on the list', score: 0 },
      { value: 'rest-breaks', label: 'More rest breaks', score: 0 },
      { value: 'fresh-air', label: 'Fresh air or a short walk', score: 0 },
      { value: 'someone', label: 'Talking to someone', score: 0 },
    ],
  },
  {
    id: 'habitPurpose', tier: 'full', letter: 'M', word: 'Meaning', slot: 'multiply', pillar: 'spiritual',
    brainHealthLens: 'Purpose and helpful routines', // ref BH-08
    title: 'How often do you do something that really matters to you?',
    section: 'brain-health', scored: true,
    options: [
      { value: 'hard-to-find', label: 'It is hard to find that right now', score: 0 },
      { value: 'sometimes', label: 'Sometimes', score: 1 },
      { value: 'often', label: 'Often', score: 3 },
    ],
  },
  {
    id: 'visionAreas', tier: 'full', letter: 'M', word: 'Meaning', slot: 'multiply', pillar: 'spiritual',
    brainHealthLens: 'Where I want my life to grow',
    title: 'Which areas of life matter most to you right now?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'health', label: 'Health and wellbeing', score: 0 },
      { value: 'family', label: 'Family and friends', score: 0 },
      { value: 'work', label: 'Work, study or purpose', score: 0 },
      { value: 'finances', label: 'Finances and independence', score: 0 },
    ],
  },
];

/** Full Picture letter order (M-Y-R-H-Y-T-H-M). */
export const FULL_PICTURE_LETTERS: { slot: LetterId; word: string }[] = [
  { slot: 'mindset', word: 'Mindset' },
  { slot: 'yesReality', word: 'Yes to Reality' },
  { slot: 'rhythm', word: 'Rhythm' },
  { slot: 'harnessSupport', word: 'Harness Support' },
  { slot: 'yourVictories', word: 'Your Victories' },
  { slot: 'transform', word: 'Transform' },
  { slot: 'heal', word: 'Heal' },
  { slot: 'multiply', word: 'Meaning' },
];

const QUICK = QUESTIONS.filter((q) => q.tier === 'quick');
const FULL = FULL_PICTURE_LETTERS.flatMap((l) => QUESTIONS.filter((q) => q.tier === 'full' && q.slot === l.slot));

const PERSONAS: PersonaKey[] = ['brain-injury', 'caregiver', 'executive', 'student', 'general'];
const banks = Object.fromEntries(PERSONAS.map((persona) => [persona, {
  persona,
  intro: 'YES: your starting point, everyday energy and steady rhythm.',
  preQuestion: { title: 'A few questions about everyday life', subtitle: 'There are no right or wrong answers.' },
  questions: QUESTIONS,
  quickQuestions: QUICK,
  fullQuestions: FULL,
}])) as Record<PersonaKey, AssessmentBank>;



export function getAssessmentBank(persona: string | null | undefined): AssessmentBank | null {
  if (!persona) return banks.general;
  const legacyMap: Record<string, PersonaKey> = {
    recovery: 'brain-injury', 'goal-achiever': 'executive', productivity: 'executive', wellness: 'brain-injury',
  };
  const key = (persona in banks ? persona : legacyMap[persona]) as PersonaKey | undefined;
  return key && key in banks ? banks[key] : null;
}

export const PERSONA_LABEL: Record<PersonaKey, string> = {
  general: 'My own starting point',
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
  /** How many of the eight brain-health areas were answered. */
  answeredAreas?: number;
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
    // Only answered questions count — Quick Start scores 5 of 8 areas.
    const opt = ans ? q.options.find((o) => o.value === ans.primary) : undefined;
    if (!opt) continue;
    const score = opt.score;
    questionScores[q.id] = score;
    raw += score;
    scoredCount++;
  }

  const letterIds: LetterId[] = ['mindset', 'yesReality', 'rhythm', 'harnessSupport', 'yourVictories', 'transform', 'heal', 'multiply'];
  const letters = { ...questionScores } as LetterScores;
  for (const id of letterIds) {
    const matching = bank.questions.filter((q) => q.scored && (q.slot ?? q.id) === id && questionScores[q.id] !== undefined);
    letters[id] = matching.length
      ? Math.round((matching.reduce((sum, q) => sum + (questionScores[q.id] ?? 0), 0) / matching.length) * 10) / 10
      : 0;
  }

  const pillars = { biological: 0, psychological: 0, social: 0, spiritual: 0 } as Record<PillarId, number>;
  const counts = { biological: 0, psychological: 0, social: 0, spiritual: 0 } as Record<PillarId, number>;
  for (const q of bank.questions.filter((item) => item.scored && questionScores[item.id] !== undefined)) {
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
    answeredAreas: scoredCount,
  };
}
