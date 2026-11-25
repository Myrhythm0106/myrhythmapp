import { describe, expect, it } from 'vitest';
import { resumeStepFor } from './resumePoint';

describe('set-up resume destinations', () => {
  it('returns to saved questions, including a full-picture address', () => {
    expect(resumeStepFor('/launch/assessment?mode=full')?.button).toBe('Continue my questions');
  });

  it('returns to the audience choice without implying one', () => {
    expect(resumeStepFor('/launch/user-type')?.title).toBe('About me');
  });

  it('returns to the card step when that is where set-up stopped', () => {
    expect(resumeStepFor('/launch/payment')?.button).toBe('Return to my card step');
  });

  it('ignores unrelated or empty destinations', () => {
    expect(resumeStepFor('/launch/home')).toBeNull();
    expect(resumeStepFor(null)).toBeNull();
  });
});
