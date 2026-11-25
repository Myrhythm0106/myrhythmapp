import { describe, expect, it } from 'vitest';
import { journeyCopyFor, LANDING_AUDIENCES } from './journeyCopy';

describe('audience journey copy', () => {
  it.each([
    ['brain-injury', 'Record my first appointment'],
    ['caregiver', 'Record an appointment or family conversation'],
    ['everyday', 'Clear one thing from my head'],
    ['executive', 'Record my first meeting'],
    ['student', 'Record a lecture or study conversation'],
  ])('%s gets its own first suggestion', (rawType, title) => {
    expect(journeyCopyFor(rawType).firstTitle).toBe(title);
  });

  it('keeps an unselected starting point neutral', () => {
    expect(journeyCopyFor(null).firstTitle).toBe('Record my first conversation');
    expect(journeyCopyFor('general').firstTitle).toBe('Record my first conversation');
  });

  it('shows all five audiences on the landing page', () => {
    expect(LANDING_AUDIENCES).toHaveLength(5);
  });
});
