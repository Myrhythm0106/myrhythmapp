import { describe, expect, it } from 'vitest';
import { reviewGroup, startsSelected } from './reviewGroups';

describe('review groups', () => {
  it('keeps saved information out of selected next steps', () => {
    for (const category of ['note', 'watch_out', 'depends_on']) {
      expect(reviewGroup({ category, confidence_score: 0.9 })).toBe('guidance');
    }
  });
  it('separates low-confidence possibilities for explicit acceptance', () => {
    expect(reviewGroup({ category: 'action', confidence_score: 0.6 })).toBe('suggestions');
    expect(reviewGroup({ category: 'action', confidence_score: 0.65 })).toBe('steps');
  });
  it('keeps a person’s own step as a next step', () => {
    expect(reviewGroup({ extraction_method: 'user_added', confidence_score: 0.4 })).toBe('steps');
  });
  it('ticks only clearly agreed steps; inferred ones wait for a choice', () => {
    expect(startsSelected({ category: 'action', confidence_score: 0.9 })).toBe(true);
    expect(startsSelected({ category: 'action', confidence_score: 0.7 })).toBe(false);
    expect(startsSelected({ category: 'action', confidence_score: 0.95, requires_review: true })).toBe(false);
    expect(startsSelected({ extraction_method: 'user_added', confidence_score: 0.3 })).toBe(true);
    expect(startsSelected({ category: 'note', confidence_score: 0.99 })).toBe(false);
  });
});
