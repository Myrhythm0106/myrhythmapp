import { describe, it, expect } from 'vitest';
import { INDUCTION_STEPS, FRESH, next, back, skip, resume, replay, shouldShow, parse } from './induction';

describe('induction', () => {
  it('runs welcome first, snapshot second to last, then set up', () => {
    expect(INDUCTION_STEPS[0]).toBe('welcome');
    expect(INDUCTION_STEPS.at(-2)).toBe('snapshot');
    expect(INDUCTION_STEPS.at(-1)).toBe('done');
    expect(INDUCTION_STEPS.indexOf('record')).toBeLessThan(INDUCTION_STEPS.indexOf('nextSteps'));
  });
  it('finishes only after the last step', () => {
    let s = { ...FRESH };
    for (let i = 0; i < INDUCTION_STEPS.length - 1; i++) s = next(s);
    expect(s.finished).toBe(false);
    expect(next(s).finished).toBe(true);
  });
  it('back never goes below the first step', () => { expect(back(FRESH).step).toBe(0); });
  it('skip hides it but keeps my place, resume brings it back', () => {
    const s = skip({ step: 4, finished: false, dismissed: false });
    expect(shouldShow(s)).toBe(false);
    expect(resume(s)).toEqual({ step: 4, finished: false, dismissed: false });
  });
  it('replay starts again from welcome', () => { expect(replay()).toEqual(FRESH); });
  it('restores a saved place and survives bad data', () => {
    expect(parse('{"step":3}').step).toBe(3);
    expect(parse('{"step":99}').step).toBe(INDUCTION_STEPS.length - 1);
    expect(parse('nonsense')).toEqual(FRESH);
  });
});
