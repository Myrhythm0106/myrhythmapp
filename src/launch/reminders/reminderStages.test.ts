import { describe, it, expect } from 'vitest';
import { answerPatch, FRESH_REMINDERS, stageFor } from './reminderStages';

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

describe('reminder fixes found in testing', () => {
  it('a missed morning item opened after 18:00 goes to Still open, not an "It\'s time" card', () => {
    expect(stageFor(ev({ prep_sent_at: 'x' }), at('2026-06-03', '18:30'))).toBe('still_open');
  });
  it('a snooze into the evening still gets its card at the snoozed time', () => {
    const s = ev({ prep_sent_at: 'x', reminder_status: 'snoozed', snoozed_until: at('2026-06-03', '18:30').toISOString() });
    expect(stageFor(s, at('2026-06-03', '18:10'))).toBe('none');
    expect(stageFor(s, at('2026-06-03', '18:30'))).toBe('due');
  });
  it('the follow-up after a snooze comes 30 minutes after the snoozed time', () => {
    const s = ev({ prep_sent_at: 'x', due_sent_at: 'x', reminder_status: 'snoozed', snoozed_until: at('2026-06-03', '11:00').toISOString() });
    expect(stageFor(s, at('2026-06-03', '11:29'))).toBe('none');
    expect(stageFor(s, at('2026-06-03', '11:30'))).toBe('followup');
  });
  it('items ticked done or carried on Home/calendar stop reminding', () => {
    expect(stageFor(ev({ status: 'done' }), at('2026-06-03', '10:00'))).toBe('none');
    expect(stageFor(ev({ status: 'carried' }), at('2026-06-03', '18:30'))).toBe('none');
  });
  it('Done saves the diary\'s own "done" status', () => {
    expect(answerPatch(ev(), 'done', at('2026-06-03', '10:05')).status).toBe('done');
  });
  it('Snooze 10 minutes / 1 hour sets the exact time and re-arms the card', () => {
    const now = at('2026-06-03', '10:05');
    const p10 = answerPatch(ev({ due_sent_at: 'x' }), 'snooze10', now);
    expect(p10.snoozed_until).toBe(at('2026-06-03', '10:15').toISOString());
    expect(p10.due_sent_at).toBeNull();
    expect(answerPatch(ev(), 'snooze60', now).snoozed_until).toBe(at('2026-06-03', '11:05').toISOString());
  });
  it('Move to tomorrow shifts the date by one day without an instant get-ready pop-up', () => {
    const p = answerPatch(ev(), 'tomorrow', at('2026-06-03', '18:30'));
    expect(p.date).toBe('2026-06-04');
    expect(p.prep_sent_at).not.toBeNull();
    expect(stageFor({ ...ev(), ...p } as never, at('2026-06-03', '18:31'))).toBe('none');
    expect(answerPatch(ev(), 'tomorrow', at('2026-06-03', '10:05')).prep_sent_at).toBeNull();
  });
});

describe('moving an item to a new day or time', () => {
  it('re-arms its reminders for the new time, even if the old one was answered', () => {
    const answered = ev({ prep_sent_at: 'x', due_sent_at: 'x', followup_sent_at: 'x', reminder_status: 'let_go' });
    const moved = { ...answered, ...FRESH_REMINDERS, date: '2026-06-05' };
    expect(stageFor(moved, at('2026-06-04', '18:05'))).toBe('prep');
    expect(stageFor({ ...moved, prep_sent_at: 'x' }, at('2026-06-05', '10:00'))).toBe('due');
  });
});
