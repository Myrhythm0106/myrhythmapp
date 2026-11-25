import { describe, it, expect } from 'vitest';
import { canGoBackInApp } from './appHistory';
describe('Back stays inside the app', () => {
  it('never goes back to the landing page', () => expect(canGoBackInApp('/launch/landingpage')).toBe(false));
  it('goes back to an in-app page', () => expect(canGoBackInApp('/launch/calendar')).toBe(true));
  it('has nowhere to go on first open', () => expect(canGoBackInApp(null)).toBe(false));
});
