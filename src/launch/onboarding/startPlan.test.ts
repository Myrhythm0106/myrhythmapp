import { describe, it, expect } from 'vitest';
import { nextAfterAccount, nextAfterCard, freeDaysLeft, daysBeforeFirstCharge, checkoutRequest, planFromSearch } from './startPlan';

describe('start plan', () => {
  it('the free 7 days ask for a card straight after the account', () => {
    expect(nextAfterAccount('trial')).toBe('/launch/payment?from=setup&start=trial');
  });
  it('registering fully goes straight to membership after the account', () => {
    expect(nextAfterAccount('member')).toBe('/launch/payment?from=setup&start=member');
  });
  it('the free 7 days collect a card but charge nothing for 7 days', () => {
    expect(checkoutRequest('trial', 'month')).toEqual({ plan: 'premium', interval: 'month', startTrial: true });
    expect(daysBeforeFirstCharge('trial')).toBe(7);
  });
  it('registering fully starts the membership today', () => {
    expect(checkoutRequest('member', 'year')).toEqual({ plan: 'premium', interval: 'year', startTrial: false });
    expect(daysBeforeFirstCharge('member')).toBe(0);
  });
  it('after the card, set-up starts with choosing who MyRhythm is for', () => {
    expect(nextAfterCard(false)).toBe('/launch/user-type');
    expect(nextAfterCard(true)).toBe('/launch/assessment?first=1');
  });
  it('the card step reads the choice from its address', () => {
    expect(planFromSearch('?from=setup&start=member')).toBe('member');
    expect(planFromSearch('?from=setup&start=trial')).toBe('trial');
  });
  it('the free start lasts 7 days', () => {
    const start = '2026-06-03T09:00:00Z';
    expect(freeDaysLeft(start, new Date('2026-06-03T10:00:00Z'))).toBe(7);
    expect(freeDaysLeft(start, new Date('2026-06-09T10:00:00Z'))).toBe(1);
    expect(freeDaysLeft(start, new Date('2026-06-10T10:00:00Z'))).toBe(0);
  });
});
