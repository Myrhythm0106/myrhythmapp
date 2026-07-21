import type { NewTimeBlock } from '@/hooks/useTimeBlocks';

export type TemplateKey = 'blank' | 'classic_focus' | 'meeting_heavy' | 'recovery_friendly';

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
  // recovery_friendly
  return weekdays.flatMap(d => [
    mk(d, '09:30', '10:30', 'Gentle start', 'focus', 'moss'),
    mk(d, '10:30', '10:45', 'Reset', 'rest', 'ember'),
    mk(d, '11:00', '12:30', 'Meetings (light)', 'meetings', 'gold', true),
    mk(d, '14:00', '15:00', 'Focus', 'focus', 'moss'),
    mk(d, '15:00', '15:15', 'Reset', 'rest', 'ember'),
  ]);
}
