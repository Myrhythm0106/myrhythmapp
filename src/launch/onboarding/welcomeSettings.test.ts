import { describe, it, expect } from 'vitest';
import { FOCUS_HOURS, focusFromHours, reminderChannel } from './welcomeSettings';

describe('welcome settings', () => {
  it('maps each focus window to its hours and back', () => {
    expect(focusFromHours(FOCUS_HOURS.afternoon)).toBe('afternoon');
    expect(focusFromHours([])).toBeNull();
  });
  it('email only stays email; both uses push, which also emails', () => {
    expect(reminderChannel('email')).toBe('email');
    expect(reminderChannel('both')).toBe('push');
  });
});
