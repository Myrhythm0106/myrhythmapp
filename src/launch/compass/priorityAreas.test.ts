import { describe, it, expect } from 'vitest';
import { rankAreas, buildExecutiveSummary } from './priorityAreas';

describe('rankAreas', () => {
  it('puts conversations first when recall is poor and remembering is the goal', () => {
    const r = rankAreas({ memoryRecall: 'little', memorySlips: ['what-was-said'], planningGoal: ['remember'], findAgain: 'rarely', reminderStop: 'acts', habitSleep: 'rested', habitCalm: 'some-tools' });
    expect(r[0].id).toBe('conversations');
    expect(r[0].impactLabel).toBe('High');
  });
  it('breaks impact ties by quickest win (rest ranks below quick wins)', () => {
    const r = rankAreas({ habitSleep: 'under-6', reminderStop: 'dismiss' });
    expect(r.findIndex((a) => a.id === 'followThrough')).toBeLessThan(r.findIndex((a) => a.id === 'rest'));
  });
  it('ranks stress high with a harsh inner voice', () => {
    const r = rankAreas({ habitCalm: 'push-through', mindsetSlip: 'harsh', memoryRecall: 'most', findAgain: 'rarely', reminderStop: 'acts' });
    expect(r[0].id).toBe('stress');
  });
});

describe('buildExecutiveSummary', () => {
  it('names the top area and clearest time', () => {
    const s = buildExecutiveSummary({ memoryRecall: 'unsure', planningRhythm: 'morning' });
    expect(s.headline).toContain('keeping what was said');
    expect(s.headline).toContain('mornings');
  });
});
