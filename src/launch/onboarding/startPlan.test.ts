import { describe, it, expect } from 'vitest';
import { nextAfterAccount, freeDaysLeft } from './startPlan';

describe('start plan', () => {
  it('registering fully goes straight to membership after the account', () => {
    expect(nextAfterAccount('member', false)).toBe('/launch/payment?from=setup');
  });
  it('the free 7 days start with choosing who MyRhythm is for', () => {
    expect(nextAfterAccount('trial', false)).toBe('/launch/user-type');
  });
  it('the free 7 days skip the choice when it is already known', () => {
    expect(nextAfterAccount('trial', true)).toBe('/launch/assessment?first=1');
  });
  it('the free start lasts 7 days', () => {
    const start = '2026-06-03T09:00:00Z';
    expect(freeDaysLeft(start, new Date('2026-06-03T10:00:00Z'))).toBe(7);
    expect(freeDaysLeft(start, new Date('2026-06-09T10:00:00Z'))).toBe(1);
    expect(freeDaysLeft(start, new Date('2026-06-10T10:00:00Z'))).toBe(0);
  });
});
