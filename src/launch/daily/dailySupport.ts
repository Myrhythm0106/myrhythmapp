import { addDays, differenceInCalendarDays, format } from 'date-fns';

export const CHECK_IN_DAYS = [30, 60, 90] as const;
export type CheckInDay = typeof CHECK_IN_DAYS[number];
export type ReflectionAnswer = 'easier' | 'same' | 'harder';
export interface Reflection {
  day: CheckInDay;
  savedAt: string;
  remembering: ReflectionAnswer;
  followingThrough: ReflectionAnswer;
}
export interface DailySupportState {
  gentleDate: string | null;
  startedOn: string | null;
  snoozedUntil: string | null;
  skipped: CheckInDay[];
  reflections: Reflection[];
}
export const emptyDailySupport = (): DailySupportState => ({ gentleDate: null, startedOn: null, snoozedUntil: null, skipped: [], reflections: [] });
export const supportKey = (userId: string) => `myrhythm_daily_support_v1:${userId}`;
export const localDay = (date: Date) => format(date, 'yyyy-MM-dd');
export const isGentleDay = (state: DailySupportState, now: Date) => state.gentleDate === localDay(now);

export function dueCheckIn(state: DailySupportState, now: Date): CheckInDay | null {
  if (!state.startedOn || (state.snoozedUntil && localDay(now) < state.snoozedUntil)) return null;
  const elapsed = differenceInCalendarDays(now, new Date(`${state.startedOn}T12:00:00`));
  return CHECK_IN_DAYS.find(day => elapsed >= day && !state.skipped.includes(day) && !state.reflections.some(r => r.day === day)) ?? null;
}
export function snoozeCheckIn(state: DailySupportState, now: Date): DailySupportState {
  return { ...state, snoozedUntil: localDay(addDays(now, 7)) };
}
const validAnswer = (value: unknown): value is ReflectionAnswer => ['easier', 'same', 'harder'].includes(String(value));
const validDate = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

export function readDailySupport(userId: string, storage: Pick<Storage, 'getItem'> = localStorage): DailySupportState {
  try {
    const raw = JSON.parse(storage.getItem(supportKey(userId)) || 'null');
    if (!raw || typeof raw !== 'object') return emptyDailySupport();
    return {
      gentleDate: validDate(raw.gentleDate) ? raw.gentleDate : null,
      startedOn: validDate(raw.startedOn) ? raw.startedOn : null,
      snoozedUntil: validDate(raw.snoozedUntil) ? raw.snoozedUntil : null,
      skipped: Array.isArray(raw.skipped) ? raw.skipped.filter((d: CheckInDay) => CHECK_IN_DAYS.includes(d)) : [],
      reflections: Array.isArray(raw.reflections) ? raw.reflections.filter((r: Reflection) => r && CHECK_IN_DAYS.includes(r.day) && typeof r.savedAt === 'string' && validAnswer(r.remembering) && validAnswer(r.followingThrough)) : [],
    };
  } catch { return emptyDailySupport(); }
}
export function writeDailySupport(userId: string, state: DailySupportState, storage: Pick<Storage, 'setItem'> = localStorage): boolean {
  try { storage.setItem(supportKey(userId), JSON.stringify(state)); return true; }
  catch { return false; }
}