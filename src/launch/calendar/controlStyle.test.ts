import { describe, it, expect } from 'vitest';
import { placementRule } from './controlStyle';

describe('placementRule', () => {
  it('ask me always confirms before placing', () => {
    expect(placementRule('ask')).toEqual({ confirmFirst: true, offerTimes: false, undo: false });
  });
  it('suggest offers a time and still confirms', () => {
    expect(placementRule('suggest')).toEqual({ confirmFirst: true, offerTimes: true, undo: false });
  });
  it('place it schedules straight away with Undo', () => {
    expect(placementRule('place')).toEqual({ confirmFirst: false, offerTimes: false, undo: true });
  });
  it('no answer yet behaves like ask me', () => {
    expect(placementRule(null).confirmFirst).toBe(true);
  });
});
