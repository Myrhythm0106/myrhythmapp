import { describe, it, expect } from 'vitest';
import { addTop, dayKey } from './topThree';

describe('top 3 priorities', () => {
  it('never holds more than 3', () => {
    let l = addTop([], 'a'); l = addTop(l, 'b'); l = addTop(l, 'c'); l = addTop(l, 'd');
    expect(l.map(i => i.text)).toEqual(['a', 'b', 'c']);
  });
  it('starts fresh each calendar day', () => {
    expect(dayKey('u', new Date(2026, 10, 19))).not.toBe(dayKey('u', new Date(2026, 10, 20)));
  });
});
