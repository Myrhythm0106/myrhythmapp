import { describe, it, expect } from 'vitest';
import { categoryFor, statusFor } from './homePrefs';

describe('Home labels', () => {
  it('labels a doctor appointment as Health', () => {
    expect(categoryFor({ title: 'Call Dr Patel' })).toBe('Health');
  });
  it('labels a school pickup as Family', () => {
    expect(categoryFor({ title: 'Pick up the kids from school' })).toBe('Family');
  });
  it('labels a report as Work', () => {
    expect(categoryFor({ title: 'Send report to Sam' })).toBe('Work');
  });
  it('marks a past time overdue, within the hour due soon, later on track', () => {
    const now = new Date(2026, 5, 3, 10, 0);
    expect(statusFor('09:30', now)).toBe('overdue');
    expect(statusFor('10:45', now)).toBe('soon');
    expect(statusFor('14:00', now)).toBe('ontrack');
  });
});
