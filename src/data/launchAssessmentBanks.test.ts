import { describe, it, expect } from 'vitest';
import { getAssessmentBank } from './launchAssessmentBanks';

describe('Quick Start matches the promise', () => {
  const quick = getAssessmentBank(null)!.quickQuestions;
  it('has 11 questions', () => expect(quick).toHaveLength(11));
  it('asks how much I stay in control', () => expect(quick.map((q) => q.id)).toContain('controlStyle'));
  it('asks sharp and empty times on one day-strip screen', () => {
    expect(quick.map((q) => q.id)).not.toContain('energyDip');
    expect(quick.find((q) => q.id === 'planningRhythm')?.kind).toBe('day-strip');
  });
});
