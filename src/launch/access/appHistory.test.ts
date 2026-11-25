import { beforeEach, describe, expect, it } from 'vitest';
import { canGoBackInApp, popBack, recordPath, resetHistoryForTest } from './appHistory';

describe('app Back', () => {
  beforeEach(resetHistoryForTest);
  it('never goes back to the landing page', () => expect(canGoBackInApp('/launch/landingpage')).toBe(false));
  it('goes back to an in-app page', () => expect(canGoBackInApp('/launch/calendar')).toBe(true));
  it('has nowhere to go on first open', () => expect(popBack()).toBeNull());
  it('returns to the page I came from, twice in a row', () => {
    ['/launch/home', '/launch/calendar', '/launch/circle'].forEach(recordPath);
    expect(popBack()).toBe('/launch/calendar');
    recordPath('/launch/calendar');
    expect(popBack()).toBe('/launch/home');
  });
  it('skips the landing page', () => {
    ['/launch/landingpage', '/launch/calendar'].forEach(recordPath);
    expect(popBack()).toBeNull();
  });
});
