import { describe, it, expect } from 'vitest';
import { INDUCTION_STEPS, FRESH, next, back, skip, resume, replay, shouldShow, parse } from './induction';

describe('induction', () => {
  it('is four short steps: welcome, who, rhythm, style', () => {
    expect(INDUCTION_STEPS).toEqual(['welcome', 'who', 'rhythm', 'style']);
  });
  it('finishes only after the last step', () => {
    let s = { ...FRESH };
    for (let i = 0; i < INDUCTION_STEPS.length - 1; i++) s = next(s);
    expect(s.finished).toBe(false);
    expect(next(s).finished).toBe(true);
  });
  it('back never goes below the first step', () => { expect(back(FRESH).step).toBe(0); });
  it('Next advances one step without completing the welcome or requiring an activity', () => {
    expect(next({ step: 1, finished: false, dismissed: false })).toEqual({ step: 2, finished: false, dismissed: false });
  });
  it('skip hides it but keeps my place, resume brings it back', () => {
    const s = skip({ step: 2, finished: false, dismissed: false });
    expect(shouldShow(s)).toBe(false);
    expect(resume(s)).toEqual({ step: 2, finished: false, dismissed: false });
  });
  it('replay starts again from welcome', () => { expect(replay()).toEqual(FRESH); });
  it('restores a saved place and survives bad data', () => {
    expect(parse('{"step":2}').step).toBe(2);
    expect(parse('{"step":99}').step).toBe(INDUCTION_STEPS.length - 1);
    expect(parse('nonsense')).toEqual(FRESH);
  });
});
