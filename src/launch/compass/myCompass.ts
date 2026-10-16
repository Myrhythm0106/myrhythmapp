import { getAssessmentBank, normalizeAnswer, type AssessmentBank } from '@/data/launchAssessmentBanks';

export type CompassOrigin = 'From my assessment' | 'I added this' | 'Suggested from my recent activity';
export type FocusStatus = 'On track' | 'Needs adjusting' | 'Paused by me';

export interface CompassVersion {
  id: string;
  createdAt: string;
  focus: string;
  whatMatters: string;
  harder: string;
  helps: string;
  bestTime: string;
  people: string;
  nextAction: string;
  successStatement: string;
  reviewAt: string | null;
  reviewStatus: 'scheduled' | 'not_scheduled';
  status: FocusStatus;
  origins: Record<string, CompassOrigin>;
}

export interface FocusCheck {
  id: string;
  createdAt: string;
  actionHappened: 'Yes' | 'Partly' | 'Not yet';
  effect: 'Better' | 'About the same' | 'Harder';
  nextChoice: 'Keep it' | 'Make it easier' | 'Choose something else';
  status: FocusStatus;
  reflection: string;
}

export interface ReportInsight {
  toldMe: string[];
  insight: string;
  meaning: string;
  strength: string;
  why: string[];
  actions: string[];
}

const COMPASS_KEY = 'myrhythm_compass_versions_v1';
const CHECKS_KEY = 'myrhythm_focus_checks_v1';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function listCompassVersions(): CompassVersion[] {
  return readJson<CompassVersion[]>(COMPASS_KEY, []);
}

export function saveCompassVersion(compass: Omit<CompassVersion, 'id' | 'createdAt'>): CompassVersion {
  const next: CompassVersion = { ...compass, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  localStorage.setItem(COMPASS_KEY, JSON.stringify([next, ...listCompassVersions()]));
  return next;
}

export function currentCompass(): CompassVersion | null {
  return listCompassVersions()[0] ?? null;
}

export function listFocusChecks(): FocusCheck[] {
  return readJson<FocusCheck[]>(CHECKS_KEY, []);
}

export function saveFocusCheck(check: Omit<FocusCheck, 'id' | 'createdAt' | 'status'>): FocusCheck {
  const status: FocusStatus = check.nextChoice === 'Choose something else'
    ? 'Paused by me'
    : check.actionHappened === 'Yes' && check.effect !== 'Harder'
      ? 'On track'
      : 'Needs adjusting';
  const next = { ...check, status, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  localStorage.setItem(CHECKS_KEY, JSON.stringify([next, ...listFocusChecks()]));
  return next;
}

function labelFor(bank: AssessmentBank | null, questionId: string, value: string): string {
  const question = bank?.questions.find((item) => item.id === questionId);
  return question?.options.find((option) => option.value === value)?.label
    ?? value.replace(/-/g, ' ').replace(/^./, (letter) => letter.toUpperCase());
}

export function deriveReport(results: Record<string, unknown>): ReportInsight {
  const bank = getAssessmentBank(String(results.userType ?? ''));
  const answers = (results.answers ?? {}) as Record<string, unknown>;
  const selected = bank?.questions
    .filter((question) => question.kind !== 'rhythm-detail')
    .map((question) => {
      const answer = normalizeAnswer(answers[question.id]);
      return answer?.primary ? { question, answer, label: labelFor(bank, question.id, answer.primary) } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? [];
  const scored = selected.map((item) => ({
    ...item,
    score: item.question.options.find((option) => option.value === item.answer.primary)?.score ?? 1,
  }));
  const focus = [...scored].sort((a, b) => a.score - b.score)[0];
  const strength = [...scored].sort((a, b) => b.score - a.score)[0];
  const focusWord = focus?.question.word ?? 'Focus';
  const focusLabel = focus?.label ?? 'A smaller, clearer next step may help right now.';
  const strengthLabel = strength?.label ?? 'You have already noticed what supports you.';
  const duration = String((normalizeAnswer(answers.rhythmDetail)?.primary ?? '20')).replace(/[^0-9]/g, '') || '15';

  return {
    toldMe: selected.slice(0, 4).map((item) => `${item.question.word}: ${item.label}`),
    insight: `${focusWord} may be the most useful place to make life feel easier right now.`,
    meaning: `You told MyRhythm: “${focusLabel}”. This may mean a smaller, visible next step will be easier to begin and complete. Does this feel right?`,
    strength: `Already working: ${strengthLabel}`,
    why: focus ? [`Your ${focus.question.word} answer: “${focus.label}”`] : ['Your latest assessment answers'],
    actions: [
      `On my next suitable day, I'll spend ${duration} minutes on one important task. I'll know I'm done when I mark it complete in MyRhythm.`,
      `Before my next important conversation, I'll write down three questions. I'll know I'm done when they are saved in MyRhythm.`,
      `This week, I'll protect one quiet block for what matters most. I'll know I'm done when it is in my calendar.`,
    ],
  };
}

export function readLatestAssessment(): { results: Record<string, unknown>; insight: ReportInsight; bestTime: string } | null {
  try {
    const saved = localStorage.getItem('myrhythm_launch_mode');
    if (!saved) return null;
    const data = JSON.parse(saved) as { assessmentResults?: Record<string, unknown> };
    const results = data.assessmentResults;
    if (!results) return null;
    const window = results.productivityWindow as { productiveStart?: string; productiveEnd?: string } | undefined;
    return {
      results,
      insight: deriveReport(results),
      bestTime: window?.productiveStart && window.productiveEnd ? `${window.productiveStart}–${window.productiveEnd}` : 'I can decide this as I learn what works',
    };
  } catch {
    return null;
  }
}

export function buildInitialCompass(action: string): Omit<CompassVersion, 'id' | 'createdAt'> {
  const assessment = readLatestAssessment();
  const insight = assessment?.insight;
  return {
    focus: insight?.insight ?? 'Choose what I want to improve',
    whatMatters: insight?.toldMe[0] ?? '',
    harder: insight?.meaning ?? '',
    helps: insight?.strength ?? '',
    bestTime: assessment?.bestTime ?? '',
    people: 'Only the people I choose',
    nextAction: action,
    successStatement: action.includes("I'll know I'm done when") ? action.split("I'll know I'm done when")[1]?.trim() ?? '' : '',
    reviewAt: null,
    reviewStatus: 'not_scheduled',
    status: 'On track',
    origins: {
      focus: 'From my assessment', whatMatters: 'From my assessment', harder: 'From my assessment',
      helps: 'From my assessment', bestTime: 'From my assessment', people: 'I added this',
      nextAction: 'I added this', successStatement: 'I added this',
    },
  };
}
/* ---------- Slip line and Remembered · Reliable · Resilient (built only from answers) ---------- */

type AnswerLike = Record<string, unknown>;
const prim = (a: AnswerLike, id: string) => normalizeAnswer(a[id])?.primary ?? '';

const SHARP_TIME: Record<string, string> = { morning: '09:30', afternoon: '14:30', evening: '18:30', varies: '10:00' };
const SHARP_LABEL: Record<string, string> = { morning: 'my clearest hour', afternoon: 'my clearest hour', evening: 'my clearest hour', varies: 'a good time' };
const DRAINED_LABEL: Record<string, string> = {
  'mid-morning': 'mid-morning', 'after-lunch': 'after lunch', 'late-afternoon': 'late afternoon', evening: 'the evening',
};
const VOICE: Record<string, string> = {
  harsh: '“Not again. What is wrong with me?”',
  'give-up': '“Forget it. What’s the point?”',
  others: '“Someone else will catch it.”',
  kind: '“No harm done. I’ll sort it.”',
};

export interface SlipPoint { when: string; text: string }
export interface SlipLine {
  without: SlipPoint[];
  innerVoice: string | null;
  withMyRhythm: { word: 'Remembered' | 'Reliable' | 'Resilient'; text: string }[];
  keepTime: string;
}

/** The personal "what usually happens" line, then the same with MyRhythm. */
export function buildSlipLine(answers: AnswerLike): SlipLine {
  const recall = prim(answers, 'memoryRecall');
  const dip = prim(answers, 'energyDip');
  const sharp = prim(answers, 'planningRhythm');
  const voice = prim(answers, 'mindsetSlip');
  const keepTime = SHARP_TIME[sharp] ?? '10:00';
  const fade = recall === 'little' || recall === 'unsure'
    ? 'It’s already fading.'
    : recall === 'main-points'
      ? 'The gist is there. The details have gone.'
      : 'I still have most of it.';
  const slipWhen = DRAINED_LABEL[dip] ? `Later this week, ${DRAINED_LABEL[dip]}` : 'Later this week';
  return {
    without: [
      { when: 'Right now', text: '“I’ll remember.”' },
      { when: 'Tonight', text: fade },
      { when: slipWhen, text: 'It slips.' },
    ],
    innerVoice: voice && voice !== 'kind' ? VOICE[voice] : null,
    withMyRhythm: [
      { word: 'Remembered', text: 'Saved now, in my own words.' },
      { word: 'Reliable', text: `Placed at ${keepTime} tomorrow, ${SHARP_LABEL[sharp] ?? 'a good time'}, with a reminder the evening before.` },
      { word: 'Resilient', text: 'If I miss it, it waits for me. Nothing is lost, and nothing to beat myself up about.' },
    ],
    keepTime,
  };
}

export type ThreeRLevel = 'Strong' | 'Building' | 'Needs support';
export interface ThreeRItem { word: 'Remembered' | 'Reliable' | 'Resilient'; level: ThreeRLevel; reason: string }

/** Three plain markers. Habits and patterns, never a score or diagnosis. */
export function buildThreeR(answers: AnswerLike): ThreeRItem[] {
  const recall = prim(answers, 'memoryRecall');
  const find = prim(answers, 'findAgain');
  const remembered: ThreeRLevel = recall === 'most' && find !== 'often'
    ? 'Strong' : recall === 'little' || recall === 'unsure' || find === 'often' ? 'Needs support' : 'Building';

  const stop = prim(answers, 'reminderStop');
  const start = prim(answers, 'startHard');
  const reliable: ThreeRLevel = stop === 'acts'
    ? 'Strong' : stop === 'dismiss' || start === 'forget' || start === 'where-start' ? 'Needs support' : 'Building';

  const sleep = prim(answers, 'habitSleep');
  const calm = prim(answers, 'habitCalm');
  const voice = prim(answers, 'mindsetSlip');
  const resilient: ThreeRLevel = voice === 'kind' && calm !== 'spiral'
    ? 'Strong' : voice === 'harsh' || voice === 'give-up' || calm === 'spiral' || sleep === 'under-6' ? 'Needs support' : 'Building';

  const reason = {
    Remembered: remembered === 'Strong' ? 'I keep most of what’s said. MyRhythm keeps a copy anyway.'
      : remembered === 'Needs support' ? 'What’s said fades fast. MyRhythm will hold it for me.'
      : 'I keep the gist. MyRhythm will keep the details.',
    Reliable: reliable === 'Strong' ? 'I act on reminders. MyRhythm will keep them well timed.'
      : reliable === 'Needs support' ? 'Good intentions get lost between the reminder and the doing. MyRhythm will close that gap.'
      : 'Starting is the sticking point. MyRhythm will show one small first step.',
    Resilient: resilient === 'Strong' ? 'I’m kind to myself when things slip. That’s a real strength.'
      : resilient === 'Needs support' ? 'Slips hit hard right now. MyRhythm keeps my place, so a bad day isn’t a lost week.'
      : 'I push through, then pay for it later. MyRhythm will build in breathing space.',
  } as const;

  return [
    { word: 'Remembered', level: remembered, reason: reason.Remembered },
    { word: 'Reliable', level: reliable, reason: reason.Reliable },
    { word: 'Resilient', level: resilient, reason: reason.Resilient },
  ];
}
