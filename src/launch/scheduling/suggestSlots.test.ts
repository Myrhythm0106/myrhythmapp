import { describe, it, expect } from 'vitest';
import { suggestSlots } from './suggestSlots';

const now = new Date(2026, 5, 3, 7, 0); // 3 June 2026, 07:00

describe('suggestSlots', () => {
  it('offers my best time of day first', () => {
    const s = suggestSlots({ busy: [], peakHours: ['14:00', '15:00'], now });
    expect(s[0]).toEqual({ date: '2026-06-03', time: '14:00', atPeak: true });
  });

  it('never overlaps a commitment, keeping a 15-minute gap', () => {
    const s = suggestSlots({ busy: [{ date: '2026-06-03', time: '09:15', end_time: '10:00' }], peakHours: ['09:00', '10:00', '11:00'], now, maxDaily: 5 });
    expect(s.map(x => x.time)).not.toContain('09:00');
    expect(s.map(x => x.time)).not.toContain('10:00');
    expect(s[0].time).toBe('11:00');
  });

  it('respects my daily limit', () => {
    const busy = [{ date: '2026-06-03', time: '08:00' }, { date: '2026-06-03', time: '16:00' }];
    const s = suggestSlots({ busy, maxDaily: 3, now });
    expect(s.filter(x => x.date === '2026-06-03')).toHaveLength(1);
  });

  it('suggests nothing after the due date', () => {
    const busy = ['08:00', '12:00', '16:00'].map(time => ({ date: '2026-06-03', time }));
    const s = suggestSlots({ busy, maxDaily: 3, now, dueDate: '2026-06-03' });
    expect(s).toHaveLength(0);
  });

  it('skips times already past today', () => {
    const late = new Date(2026, 5, 3, 11, 0);
    const s = suggestSlots({ busy: [], peakHours: ['09:00', '10:00'], now: late });
    expect(s[0].date).toBe('2026-06-03');
    expect(s[0].time >= '11:30').toBe(true);
  });
});
