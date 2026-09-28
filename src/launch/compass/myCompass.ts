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
  return question?.options.find((option) => option.value === value)?.label ?? value;
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