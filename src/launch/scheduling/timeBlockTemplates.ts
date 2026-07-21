import type { NewTimeBlock } from '@/hooks/useTimeBlocks';

export type TemplateKey = 'blank' | 'classic_focus' | 'meeting_heavy' | 'recovery_friendly' | 'desktime_52_17';

export const TEMPLATE_LABELS: Record<TemplateKey, { label: string; evidence?: string }> = {
  blank:             { label: 'Blank — I\'ll build my own' },
  classic_focus:     { label: 'Pomodoro Classic (25 / 5)',   evidence: 'Cirillo, 1987' },
  meeting_heavy:     { label: 'Meeting-heavy + micro-resets', evidence: 'MS Human Factors Lab, 2021' },
  recovery_friendly: { label: 'Gentle Recovery (15 / 10)',   evidence: 'Rehab pacing guidance' },
  desktime_52_17:    { label: 'Deep Work (52 / 17)',          evidence: 'DeskTime study, 2014' },
};

const weekdays = [1,2,3,4,5];

function mk(day: number, start: string, end: string, name: string, type: NewTimeBlock['block_type'], color: NewTimeBlock['color'], meetingsAllowed = false): NewTimeBlock {
  return {
    day_of_week: day,
    date: null,
    start_time: `${start}:00`,
    end_time: `${end}:00`,
    name,
    block_type: type,
    color,
    meetings_allowed: meetingsAllowed,
    repeat_rule: 'weekly',
    is_active: true,
  };
}

export function buildTemplate(key: TemplateKey): NewTimeBlock[] {
  if (key === 'blank') return [];
  if (key === 'classic_focus') {
    return weekdays.flatMap(d => [
      mk(d, '09:00', '11:00', 'Deep focus', 'focus', 'moss'),
      mk(d, '11:15', '12:30', 'Meetings', 'meetings', 'gold', true),
      mk(d, '14:00', '15:30', 'Admin', 'admin', 'slate'),
    ]);
  }
  if (key === 'meeting_heavy') {
    return weekdays.flatMap(d => [
      mk(d, '09:00', '10:00', 'Prep', 'focus', 'moss'),
      mk(d, '10:00', '12:30', 'Meetings', 'meetings', 'gold', true),
      mk(d, '13:30', '16:00', 'Meetings', 'meetings', 'gold', true),
      mk(d, '16:00', '16:30', 'Reset', 'rest', 'ember'),
    ]);
  }
  if (key === 'desktime_52_17') {
    return weekdays.flatMap(d => [
      mk(d, '09:00', '09:52', 'Deep work', 'focus', 'moss'),
      mk(d, '09:52', '10:09', 'Reset', 'rest', 'ember'),
      mk(d, '10:09', '11:01', 'Deep work', 'focus', 'moss'),
      mk(d, '11:15', '12:30', 'Meetings', 'meetings', 'gold', true),
      mk(d, '14:00', '14:52', 'Deep work', 'focus', 'moss'),
      mk(d, '14:52', '15:09', 'Reset', 'rest', 'ember'),
    ]);
  }
  // recovery_friendly
  return weekdays.flatMap(d => [
    mk(d, '09:30', '09:45', 'Gentle start', 'focus', 'moss'),
    mk(d, '09:45', '09:55', 'Reset', 'rest', 'ember'),
    mk(d, '10:00', '10:15', 'Focus', 'focus', 'moss'),
    mk(d, '11:00', '12:00', 'Meetings (light)', 'meetings', 'gold', true),
    mk(d, '14:00', '14:15', 'Focus', 'focus', 'moss'),
    mk(d, '14:15', '14:25', 'Reset', 'rest', 'ember'),
  ]);
}
