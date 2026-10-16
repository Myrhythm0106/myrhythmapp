import { describe, it, expect } from 'vitest';
import { buildSlipLine, buildThreeR } from './myCompass';

describe('buildSlipLine', () => {
  it('places the kept item in the person’s sharpest time', () => {
    expect(buildSlipLine({ planningRhythm: 'afternoon' }).keepTime).toBe('14:30');
    expect(buildSlipLine({ planningRhythm: 'morning' }).keepTime).toBe('09:30');
  });
  it('shows the harsh inner voice in the person’s own words, but not a kind one', () => {
    expect(buildSlipLine({ mindsetSlip: 'harsh' }).innerVoice).toContain('What is wrong with me');
    expect(buildSlipLine({ mindsetSlip: 'kind' }).innerVoice).toBeNull();
  });
  it('names the drained time as when things slip', () => {
    expect(buildSlipLine({ energyDip: 'after-lunch' }).without[2].when).toContain('after lunch');
  });
});

describe('buildThreeR', () => {
  it('marks fading memory as needing support', () => {
    expect(buildThreeR({ memoryRecall: 'little' })[0].level).toBe('Needs support');
  });
  it('marks acting on reminders as strong reliability', () => {
    expect(buildThreeR({ reminderStop: 'acts' })[1].level).toBe('Strong');
  });
  it('marks a harsh inner voice as resilience needing support, and kindness as strong', () => {
    expect(buildThreeR({ mindsetSlip: 'harsh' })[2].level).toBe('Needs support');
    expect(buildThreeR({ mindsetSlip: 'kind', habitCalm: 'some-tools' })[2].level).toBe('Strong');
  });
});
