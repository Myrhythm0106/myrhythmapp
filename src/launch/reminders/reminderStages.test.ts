import { describe, it, expect } from 'vitest';
import { stageFor } from './reminderStages';

const ev = (o = {}) => ({ date: '2026-06-03', time: '10:00', reminder_level: 'strong' as const, ...o });
const at = (d: string, t: string) => new Date(`${d}T${t}:00`);

describe('memory-friendly reminder stages', () => {
  it('gets ready the evening before for morning items (steady/strong)', () => {
    expect(stageFor(ev(), at('2026-06-02', '18:05'))).toBe('prep');
    expect(stageFor(ev({ reminder_level: 'steady' }), at('2026-06-02', '18:05'))).toBe('prep');
  });
  it('gentle skips the get-ready step', () => {
    expect(stageFor(ev({ reminder_level: 'gentle' }), at('2026-06-02', '18:05'))).toBe('none');
  });
  it('says it is time at the start', () => {
    expect(stageFor(ev({ prep_sent_at: 'x' }), at('2026-06-03', '10:00'))).toBe('due');
  });
  it('follows up once, 30 minutes later, only on strong', () => {
    const shown = { prep_sent_at: 'x', due_sent_at: 'x' };
    expect(stageFor(ev(shown), at('2026-06-03', '10:29'))).toBe('none');
    expect(stageFor(ev(shown), at('2026-06-03', '10:30'))).toBe('followup');
    expect(stageFor(ev({ ...shown, followup_sent_at: 'x' }), at('2026-06-03', '10:45'))).toBe('none');
    expect(stageFor(ev({ ...shown, reminder_level: 'steady' }), at('2026-06-03', '10:30'))).toBe('none');
  });
  it('snooze moves the it-is-time reminder', () => {
    const s = ev({ prep_sent_at: 'x', reminder_status: 'snoozed', snoozed_until: at('2026-06-03', '11:00').toISOString() });
    expect(stageFor(s, at('2026-06-03', '10:30'))).toBe('none');
    expect(stageFor(s, at('2026-06-03', '11:00'))).toBe('due');
  });
  it('lands in Still open from 18:00', () => {
    const s = ev({ prep_sent_at: 'x', due_sent_at: 'x', followup_sent_at: 'x' });
    expect(stageFor(s, at('2026-06-03', '17:59'))).toBe('none');
    expect(stageFor(s, at('2026-06-03', '18:00'))).toBe('still_open');
  });
  it('stays quiet when off or done', () => {
    expect(stageFor(ev({ reminder_level: 'off' }), at('2026-06-03', '10:00'))).toBe('none');
    expect(stageFor(ev({ reminder_status: 'done' }), at('2026-06-03', '18:30'))).toBe('none');
  });
});
