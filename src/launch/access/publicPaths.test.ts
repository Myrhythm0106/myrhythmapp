import { describe, it, expect } from 'vitest';
import { isPublicPath } from './publicPaths';

describe('isPublicPath, sign-in needed beyond the landing page', () => {
  it('the landing page is open to everyone', () => {
    expect(isPublicPath('/launch/landingpage')).toBe(true);
  });

  it('sign-in and registration are open so people can get in', () => {
    expect(isPublicPath('/launch/signin')).toBe(true);
    expect(isPublicPath('/launch/register')).toBe(true);
  });

  it('Home, calendar and Memory Bridge need an account', () => {
    expect(isPublicPath('/launch/home')).toBe(false);
    expect(isPublicPath('/launch/calendar')).toBe(false);
    expect(isPublicPath('/launch/memory')).toBe(false);
  });

  it('onboarding steps after the landing page need an account', () => {
    expect(isPublicPath('/launch/user-type')).toBe(false);
    expect(isPublicPath('/launch/assessment')).toBe(false);
    expect(isPublicPath('/launch/payment')).toBe(false);
    expect(isPublicPath('/launch/welcome')).toBe(false);
  });

  it('older pages need an account too', () => {
    expect(isPublicPath('/help')).toBe(false);
    expect(isPublicPath('/memory-bank')).toBe(false);
  });

  it('a trailing slash does not open a private page', () => {
    expect(isPublicPath('/launch/home/')).toBe(false);
    expect(isPublicPath('/launch/landingpage/')).toBe(true);
  });

  it('the MVP presentation can be shared without an account', () => {
    expect(isPublicPath('/mvp-deck')).toBe(true);
  });
});
