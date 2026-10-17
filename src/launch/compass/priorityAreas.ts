import { getAssessmentBank, normalizeAnswer } from '@/data/launchAssessmentBanks';
import { buildThreeR, type ThreeRItem } from './myCompass';

type Answers = Record<string, unknown>;
export type AreaId = 'conversations' | 'dates' | 'starting' | 'followThrough' | 'energy' | 'rest' | 'stress' | 'organised';
export type Level = 'High' | 'Medium' | 'Low';

export interface PriorityArea {
  id: AreaId;
  title: string;
  impact: number; // 1–3
  effort: number; // 1 easy – 3 harder
  impactLabel: Level;
  quickWin: 'Quick win' | 'Steady build' | 'Longer journey';
  reason: string;
  quotes: string[];
  meaning: string;
  actions: string[];
  memberPlan: string[];
}

const all = (a: Answers, id: string): string[] => {
  const n = normalizeAnswer(a[id]);
  return n ? [n.primary, ...n.alsoFits].filter(Boolean) : [];
};
const one = (a: Answers, id: string) => all(a, id)[0] ?? '';

const bank = getAssessmentBank(null);
function quote(a: Answers, id: string): string | null {
  const q = bank?.questions.find((x) => x.id === id);
  const v = one(a, id);
  const label = q?.options.find((o) => o.value === v)?.label;
  return label ? `${q?.title} “${label}”` : null;
}

const clamp = (n: number) => Math.max(1, Math.min(3, n));

interface Def {
  title: string; effort: number; ids: string[];
  impact: (a: Answers) => number;
  reason: string; meaning: string; actions: string[]; memberPlan: string[];
}

const DEFS: Record<AreaId, Def> = {
  conversations: {
    title: 'Keeping what was said', effort: 1, ids: ['memoryRecall', 'memorySlips'],
    impact: (a) => ({ little: 3, unsure: 3, 'main-points': 2, most: 1 }[one(a, 'memoryRecall')] ?? 1)
      + (all(a, 'memorySlips').includes('what-was-said') ? 1 : 0) + (all(a, 'planningGoal').includes('remember') ? 1 : 0),
    reason: 'Details from conversations and appointments fade before I can act on them.',
    meaning: 'When details fade, next steps get missed, and it can feel like I let people down even when I tried.',
    actions: ['Record or note important conversations in Memory Bridge', 'Every next step is pulled out in plain words', 'I can check what was agreed at any time'],
    memberPlan: ['Week 1: capture two real conversations', 'Week 2: turn each into one dated step', 'Week 3: review what was kept, with my Support Circle if I choose'],
  },
  dates: {
    title: 'Never missing what matters', effort: 1, ids: ['memorySlips'],
    impact: (a) => (all(a, 'memorySlips').includes('appointments') ? 3 : 1) + (all(a, 'planningGoal').includes('remember') ? 1 : 0),
    reason: 'An important date or appointment has slipped past recently.',
    meaning: 'One missed date can knock confidence for days. Getting dates safe is one of the fastest ways to feel in control again.',
    actions: ['Appointments go into my calendar with a reminder the evening before', 'A second, gentle nudge on the day', 'Missed items wait for me, not disappear'],
    memberPlan: ['Week 1: every known date in one place', 'Week 2: reminders tuned to what I tend to miss', 'Week 3: a weekly look-ahead each Sunday'],
  },
  starting: {
    title: 'Getting started and finishing', effort: 2, ids: ['startHard', 'planningGoal'],
    impact: (a) => ({ 'too-big': 3, 'where-start': 3, energy: 2, forget: 2 }[one(a, 'startHard')] ?? 1) + (all(a, 'planningGoal').includes('complete') ? 1 : 0),
    reason: 'Knowing what to do isn’t the problem. Starting is.',
    meaning: 'Big or unclear tasks stall. Breaking them into one small first step makes them much easier to begin and finish.',
    actions: ['Each task gets one small, visible first step', 'Placed in my clearest hours', 'Ticked off so I can see progress'],
    memberPlan: ['Week 1: one finished task a day, however small', 'Week 2: bigger tasks split into steps automatically', 'Week 3: a finish-line review of what got done'],
  },
  followThrough: {
    title: 'Acting on reminders', effort: 1, ids: ['reminderStop'],
    impact: (a) => ({ dismiss: 3, unclear: 3, 'wrong-time': 2, acts: 1 }[one(a, 'reminderStop')] ?? 1),
    reason: 'Reminders arrive, but something gets between the reminder and the doing.',
    meaning: 'This is the gap where good intentions get lost. Closing it is what turns plans into things that actually happen.',
    actions: ['Reminders say what they are for and where they came from', 'Timed around my day, not the clock', 'One gentle follow-up if I swipe it away'],
    memberPlan: ['Week 1: reminders rebuilt around my answers', 'Week 2: follow-ups for anything dismissed', 'Week 3: see my follow-through rate rise'],
  },
  energy: {
    title: 'Working with my energy', effort: 2, ids: ['energyDip', 'startHard'],
    impact: (a) => clamp(all(a, 'energyDip').length + 1) + (one(a, 'startHard') === 'energy' ? 1 : 0) + (all(a, 'planningGoal').includes('pace') ? 1 : 0) - 1,
    reason: 'My energy drops at predictable times in the day.',
    meaning: 'Putting demanding things in low-energy times sets me up to struggle. Planning around my energy makes the same day feel lighter.',
    actions: ['Important things placed in my best hours', 'Low-energy times kept light', 'Breaks built in on busy days'],
    memberPlan: ['Week 1: map my real energy pattern', 'Week 2: move demanding tasks into best hours', 'Week 3: adjust from what I notice'],
  },
  rest: {
    title: 'Rest and recharge', effort: 3, ids: ['habitSleep'],
    impact: (a) => ({ 'under-6': 3, patchy: 2, rested: 1 }[one(a, 'habitSleep')] ?? 1),
    reason: 'Mornings often start without feeling rested.',
    meaning: 'Rest shapes memory, focus and mood. This takes longer to shift, so MyRhythm goes gently on heavy mornings meanwhile.',
    actions: ['A gentler first hour on heavy mornings', 'A wind-down reminder in the evening', 'No important tasks first thing when I’m tired'],
    memberPlan: ['Week 1: a simple evening wind-down', 'Week 2: lighter mornings after poor nights', 'Week 3: notice what helps me feel rested'],
  },
  stress: {
    title: 'Calm and kinder self-talk', effort: 2, ids: ['habitCalm', 'mindsetSlip'],
    impact: (a) => ({ spiral: 3, 'push-through': 2, 'some-tools': 1 }[one(a, 'habitCalm')] ?? 1)
      + (['harsh', 'give-up'].includes(one(a, 'mindsetSlip')) ? 1 : 0) + (all(a, 'planningGoal').includes('pace') ? 1 : 0),
    reason: 'Stress or a harsh inner voice is making the slips feel heavier.',
    meaning: 'How I talk to myself after a slip affects whether I try again. A calmer system means fewer slips and less to blame myself for.',
    actions: ['Missed things wait for me, with no red marks', 'Short pauses built into busy days', 'Small wins noticed and kept'],
    memberPlan: ['Week 1: a daily 30-second check-in', 'Week 2: pauses added on heavy days', 'Week 3: a look back at what went well'],
  },
  organised: {
    title: 'Finding things again', effort: 1, ids: ['findAgain', 'memorySlips'],
    impact: (a) => ({ often: 3, sometimes: 2, rarely: 1 }[one(a, 'findAgain')] ?? 1) + (all(a, 'memorySlips').includes('where-things-are') ? 1 : 0),
    reason: 'I save things, then can’t find them when I need them.',
    meaning: 'Searching wastes energy and adds stress. One trusted place means I only have to remember where to look.',
    actions: ['Everything kept in one place, by date', 'Each item has a reference I can search', 'Notes linked to the conversation they came from'],
    memberPlan: ['Week 1: one home for notes and captures', 'Week 2: search my full history', 'Week 3: tidy and archive with one tap'],
  },
};

const label = (n: number): Level => (n >= 3 ? 'High' : n === 2 ? 'Medium' : 'Low');
const win = (e: number) => (e === 1 ? 'Quick win' : e === 2 ? 'Steady build' : 'Longer journey') as PriorityArea['quickWin'];

/** Ranked by impact on my day (highest first), then by how quickly a win is possible. */
export function rankAreas(answers: Answers): PriorityArea[] {
  return (Object.keys(DEFS) as AreaId[])
    .map((id) => {
      const d = DEFS[id];
      const impact = clamp(d.impact(answers));
      return {
        id, title: d.title, impact, effort: d.effort, impactLabel: label(impact), quickWin: win(d.effort),
        reason: d.reason, meaning: d.meaning, actions: d.actions, memberPlan: d.memberPlan,
        quotes: d.ids.map((q) => quote(answers, q)).filter((x): x is string => Boolean(x)),
      };
    })
    .sort((a, b) => b.impact - a.impact || a.effort - b.effort);
}

const SHARP: Record<string, string> = { morning: 'mornings', afternoon: 'afternoons', evening: 'evenings' };

export interface ExecutiveSummary {
  headline: string;
  findings: ThreeRItem[];
  opportunity: string;
  outcomes: string[];
  answered: number;
}

export function buildExecutiveSummary(answers: Answers): ExecutiveSummary {
  const ranked = rankAreas(answers);
  const top = ranked[0];
  const sharp = SHARP[one(answers, 'planningRhythm')];
  const voice = ['harsh', 'give-up'].includes(one(answers, 'mindsetSlip'));
  const parts = [`My biggest pressure point is ${top.title.toLowerCase()}`];
  if (voice) parts.push('and slips are costing me confidence');
  const headline = `${parts.join(', ')}.${sharp ? ` My thinking is clearest in the ${sharp}.` : ''}`;
  return {
    headline,
    findings: buildThreeR(answers),
    opportunity: `Start with ${top.title.toLowerCase()}. It has the most impact on my day${top.effort === 1 ? ', and a quick win is possible this week' : ''}.`,
    outcomes: [
      ranked.slice(0, 2).some((a) => a.id === 'conversations' || a.id === 'dates')
        ? 'Important conversations and dates kept safe in one place'
        : 'The important things kept safe in one place',
      sharp ? `Demanding tasks moved into my ${sharp}` : 'Demanding tasks moved into my best hours',
      voice ? 'Fewer slips, and less to blame myself for' : 'More things finished, with progress I can see',
    ],
    answered: Object.values(answers).filter(Boolean).length,
  };
}

const CHOSEN_KEY = 'myrhythm_chosen_priorities_v1';
export function saveChosenPriorities(ids: AreaId[]) {
  try { localStorage.setItem(CHOSEN_KEY, JSON.stringify(ids.slice(0, 3))); } catch { /* noop */ }
}
export function readChosenPriorities(): AreaId[] {
  try { return JSON.parse(localStorage.getItem(CHOSEN_KEY) ?? '[]'); } catch { return []; }
}
export const areaTitle = (id: AreaId) => DEFS[id].title;
