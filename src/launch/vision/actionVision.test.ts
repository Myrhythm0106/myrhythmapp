import { describe, expect, it } from 'vitest';
import { shouldOfferVision, suggestVisionArea, visionCompletionMessage } from './actionVision';

describe('action vision links', () => {
  it('suggests work from work words', () => {
    expect(suggestVisionArea('Email the client report before Friday')).toBe('work');
  });

  it('suggests wellbeing from a health appointment', () => {
    expect(suggestVisionArea('Book the physio appointment')).toBe('wellbeing');
  });

  it('does not invent a link when two areas fit', () => {
    expect(suggestVisionArea('Discuss the report with my family')).toBeNull();
  });

  it('does not invent a link without a clear clue', () => {
    expect(suggestVisionArea('Call back when convenient')).toBeNull();
  });

  it('names the vision area when a step is done', () => {
    expect(visionCompletionMessage('work')).toBe('One step closer to my vision for work.');
    expect(visionCompletionMessage(null)).toBeNull();
  });

  it('offers the optional vision invitation only after a first capture', () => {
    expect(shouldOfferVision(true, '', false)).toBe(true);
    expect(shouldOfferVision(false, '', false)).toBe(false);
    expect(shouldOfferVision(true, 'A calm family life', false)).toBe(false);
    expect(shouldOfferVision(true, '', true)).toBe(false);
  });
});
