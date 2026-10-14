import type { YesId } from '@/launch/framework/yes';

type Answers = Record<string, { primary?: string; alsoFits?: string[] } | undefined>;

export interface YesAction {
  week: 1 | 2 | 3;
  yes: YesId;
  id: string;
  title: string;
  /** HH:mm, placed around the person's own rhythm. */
  suggestedTime: string;
}

export function readSnapshotAnswers(): Answers {
  try {
    return JSON.parse(localStorage.getItem('myrhythm_launch_mode') || '{}')?.assessmentResults?.answers ?? {};
  } catch {
    return {};
  }
}

const BEST_TIME: Record<string, string> = { morning: '10:00', afternoon: '14:30', evening: '18:30', varies: '11:00' };
const WAKE: Record<string, string> = { early: '07:30', middle: '09:00', late: '10:30' };
const WIND: Record<string, string> = { early: '20:30', middle: '21:30', late: '22:30' };
const DIP: Record<string, string> = { 'mid-morning': '10:30', 'after-lunch': '14:00', 'late-afternoon': '16:30', evening: '19:00' };

/** Moves a time out of the energy dip (± 90 min) when it lands inside it. */
function avoidDip(time: string, dip?: string): string {
  if (!dip || !DIP[dip]) return time;
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  const d = toMin(DIP[dip]);
  const t = toMin(time);
  if (Math.abs(t - d) >= 60) return time;
  const moved = t <= d ? d - 90 : d + 90;
  return `${String(Math.floor(moved / 60)).padStart(2, '0')}:${String(moved % 60).padStart(2, '0')}`;
}

/** Each YES week's small actions, built only from the person's own answers. */
export function buildYesActions(a: Answers = readSnapshotAnswers()): YesAction[] {
  const p = (id: string) => a[id]?.primary ?? '';
  const day = p('dayStart') || 'middle';
  const dip = p('energyDip');
  const best = BEST_TIME[p('planningRhythm')] ?? '10:00';
  const morning = avoidDip(WAKE[day], dip);
  const evening = WIND[day];

  const slip = p('memorySlips');
  const y: YesAction[] = [
    slip === 'appointments'
      ? { week: 1, yes: 'Y', id: 'y-appointments', title: "Check tomorrow's appointments and set reminders", suggestedTime: evening }
      : slip === 'what-was-said'
        ? { week: 1, yes: 'Y', id: 'y-capture', title: 'Record or type a quick note after any conversation', suggestedTime: morning }
        : slip === 'half-done'
          ? { week: 1, yes: 'Y', id: 'y-half-done', title: 'Look back at one thing I started and finish a small part', suggestedTime: avoidDip(best, dip) }
          : slip === 'where-things-are'
            ? { week: 1, yes: 'Y', id: 'y-places', title: 'Note where I put one important thing today', suggestedTime: morning }
            : { week: 1, yes: 'Y', id: 'y-review', title: 'Two-minute look at what is coming up today', suggestedTime: morning },
    { week: 1, yes: 'Y', id: 'y-morning-check', title: 'Morning check: what matters today?', suggestedTime: morning },
  ];

  const e: YesAction[] = [
    p('habitSleep') === 'under-6' || p('habitSleep') === 'patchy'
      ? { week: 2, yes: 'E', id: 'e-wind-down', title: 'Start winding down — screens off, lights low', suggestedTime: evening }
      : { week: 2, yes: 'E', id: 'e-rest', title: 'Keep my usual wind-down time', suggestedTime: evening },
    p('habitMove') !== 'most-days'
      ? { week: 2, yes: 'E', id: 'e-walk', title: 'A short walk at a time that suits me', suggestedTime: avoidDip(best, dip) }
      : { week: 2, yes: 'E', id: 'e-water', title: 'A glass of water and a steady meal', suggestedTime: '12:30' },
    ...(p('habitCalm') === 'spiral' || p('habitCalm') === 'push-through'
      ? [{ week: 2 as const, yes: 'E' as const, id: 'e-pause', title: 'A two-minute pause before the busiest part of my day', suggestedTime: avoidDip(best, dip) }]
      : []),
  ];

  const s: YesAction[] = [
    { week: 3, yes: 'S', id: 's-focus', title: 'My most important task, in my best time', suggestedTime: avoidDip(best, dip) },
    { week: 3, yes: 'S', id: 's-goal', title: "One step towards this week's goal", suggestedTime: avoidDip(best === '10:00' ? '11:30' : best, dip) },
  ];

  return [...y, ...e, ...s];
}

/** Snapshot one-liners per week (first action of each week). */
export function yesWeekLines(a: Answers = readSnapshotAnswers()): Record<YesId, string> {
  const all = buildYesActions(a);
  const first = (w: 1 | 2 | 3) => all.find((x) => x.week === w)?.title ?? '';
  return { Y: first(1), E: first(2), S: first(3) };
}
