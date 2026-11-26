import { describe, it, expect } from 'vitest';
import { loopProgress, loopCopy, LOOP_STEPS } from './firstLoop';

const zero = { recordings: 0, confirmed: 0, scheduled: 0, finished: 0, circle: 0 };
describe('first loop', () => {
  it('has five steps in order', () => { expect(LOOP_STEPS).toEqual(['capture', 'confirm', 'diary', 'done', 'circle']); });
  it('starts at capture for a new member', () => { expect(loopProgress(zero).next).toBe('capture'); });
  it('moves to confirm after the first recording', () => { expect(loopProgress({ ...zero, recordings: 1 }).next).toBe('confirm'); });
  it('core loop completes at first Done, circle stays optional', () => {
    const p = loopProgress({ recordings: 1, confirmed: 1, scheduled: 1, finished: 1, circle: 0 });
    expect(p.coreComplete).toBe(true);
    expect(p.allComplete).toBe(false);
    expect(p.next).toBe('circle');
  });
  it('uses role wording for the first recording', () => {
    expect(loopCopy('capture', 'executive').next).toBe('Record my first meeting');
    expect(loopCopy('capture', null).next).toBe('Record my first conversation');
  });
});

import { afterDiaryLine } from './firstLoop';
describe('after diary line', () => {
  it('tells a carer they hear when it is done', () => { expect(afterDiaryLine('caregiver')).toContain('I hear when it is done'); });
  it('falls back to neutral wording', () => { expect(afterDiaryLine(null)).toContain('Nothing else to do now'); });
});
