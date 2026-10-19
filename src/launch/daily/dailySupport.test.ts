import { describe, it, expect } from 'vitest';
import { dueCheckIn, emptyDailySupport, isGentleDay, readDailySupport, snoozeCheckIn, supportKey, writeDailySupport } from './dailySupport';

const day = (n: number) => new Date(2026, 5, 3 + n, 12);
describe('ongoing daily support', () => {
  it.each([30, 60, 90] as const)('offers the %i-day check-in on its date, not the previous day', milestone => {
    const state = { ...emptyDailySupport(), startedOn: '2026-06-03', skipped: [30, 60, 90].filter(d => d < milestone) as (30 | 60 | 90)[] };
    expect(dueCheckIn(state, day(milestone - 1))).toBeNull();
    expect(dueCheckIn(state, day(milestone))).toBe(milestone);
  });
  it('does not enrol someone without their choice', () => {
    expect(dueCheckIn(emptyDailySupport(), day(100))).toBeNull();
  });
  it('gentler day expires the next local day and can be undone', () => {
    const state = { ...emptyDailySupport(), gentleDate: '2026-06-03' };
    expect(isGentleDay(state, day(0))).toBe(true);
    expect(isGentleDay(state, day(1))).toBe(false);
    expect(isGentleDay({ ...state, gentleDate: null }, day(0))).toBe(false);
  });
  it('postpones the current check-in for seven days without losing it', () => {
    const state = snoozeCheckIn({ ...emptyDailySupport(), startedOn: '2026-06-03' }, day(30));
    expect(dueCheckIn(state, day(36))).toBeNull();
    expect(dueCheckIn(state, day(37))).toBe(30);
  });
  it('advances after a saved response and stops after all three', () => {
    const state = { ...emptyDailySupport(), startedOn: '2026-06-03', reflections: [{ day: 30 as const, savedAt: day(30).toISOString(), remembering: 'easier' as const, followingThrough: 'same' as const }] };
    expect(dueCheckIn(state, day(60))).toBe(60);
    expect(dueCheckIn({ ...state, skipped: [60, 90] }, day(120))).toBeNull();
  });
  it('persists only under the selected user and preserves responses', () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
    const state = { ...emptyDailySupport(), gentleDate: '2026-06-03', startedOn: '2026-06-03' };
    expect(writeDailySupport('a', state, storage)).toBe(true);
    expect(readDailySupport('a', storage)).toEqual(state);
    expect(readDailySupport('b', storage)).toEqual(emptyDailySupport());
    expect(supportKey('a')).not.toBe(supportKey('b'));
  });
});