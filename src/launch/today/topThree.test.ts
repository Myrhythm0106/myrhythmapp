import { describe, it, expect } from 'vitest';
import { pickTopThree, pinKey } from './topThree';

const ev = (id: string, time: string, extra: Record<string, unknown> = {}) =>
  ({ id, time, status: 'pending', source: 'manual', ...extra }) as any;

describe('top 3 from the diary', () => {
  it('never more than 3', () => {
    expect(pickTopThree([ev('a', '09:00'), ev('b', '10:00'), ev('c', '11:00'), ev('d', '12:00')])).toHaveLength(3);
  });
  it('starred first, then from conversations, then by time', () => {
    const out = pickTopThree([ev('early', '08:00'), ev('conv', '15:00', { source: 'memory_bridge' }), ev('star', '17:00'), ev('mid', '12:00')], ['star']);
    expect(out.map(e => e.id)).toEqual(['star', 'conv', 'early']);
  });
  it('leaves out done, cancelled and moved items', () => {
    const out = pickTopThree([ev('d', '09:00', { status: 'done' }), ev('x', '09:00', { status: 'cancelled' }), ev('m', '09:00', { status: 'carried' }), ev('ok', '10:00')]);
    expect(out.map(e => e.id)).toEqual(['ok']);
  });
  it('swapped-in choices start fresh each day', () => {
    expect(pinKey('u', new Date(2026, 10, 19))).not.toBe(pinKey('u', new Date(2026, 10, 20)));
  });
});
