import { describe, it, expect } from 'vitest';
import { I_CHOOSE_365, dayOfYear, getDailyEntry } from './iChoose365';

describe('#IChoose 365', () => {
  it('has 365 unique statements, each starting #IChoose', () => {
    expect(I_CHOOSE_365).toHaveLength(365);
    expect(new Set(I_CHOOSE_365.map((e) => e.statement)).size).toBe(365);
    I_CHOOSE_365.forEach((e) => expect(e.statement.startsWith('#IChoose')).toBe(true));
  });
  it('1 January is day 1', () => {
    expect(getDailyEntry(new Date(2026, 0, 1)).day).toBe(1);
  });
  it('day 366 in a leap year repeats day 365', () => {
    expect(dayOfYear(new Date(2028, 11, 31))).toBe(365);
  });
  it('stays the same all day', () => {
    expect(getDailyEntry(new Date(2026, 5, 3, 0, 5))).toEqual(getDailyEntry(new Date(2026, 5, 3, 23, 55)));
  });
});
