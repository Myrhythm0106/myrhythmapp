// Single source of truth for Brain-Healthy Scheduling defaults + editable ranges.
// Every field is user-adjustable inside these ranges.

export type BreakStyle =
  | 'quiet_reset'
  | 'walk_move'
  | 'hydrate_breathe'
  | 'choose_each_time'
  | 'custom';

export type BlockType = 'focus' | 'meetings' | 'admin' | 'rest' | 'personal' | 'custom';
export type BlockColor = 'moss' | 'gold' | 'ember' | 'ink' | 'slate';
export type RepeatRule = 'none' | 'daily' | 'weekdays' | 'weekly' | 'custom';

export type PomodoroPreset =
  | 'classic_pomodoro'
  | 'long_focus'
  | 'gentle_recovery'
  | 'desktime_52_17'
  | 'custom';

export interface PomodoroPresetConfig {
  value: PomodoroPreset;
  label: string;
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakEvery: number; // cycles
  evidence: string; // one-line citation chip
  blurb: string;
}

export const POMODORO_PRESETS: PomodoroPresetConfig[] = [
  {
    value: 'classic_pomodoro',
    label: 'Pomodoro Classic (25 / 5)',
    workMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, longBreakEvery: 4,
    evidence: 'Pomodoro Technique · Cirillo, 1987',
    blurb: '25 min focus, 5 min break, 15 min long break every 4 cycles.',
  },
  {
    value: 'long_focus',
    label: 'Deep Focus (50 / 10)',
    workMinutes: 50, shortBreakMinutes: 10, longBreakMinutes: 20, longBreakEvery: 4,
    evidence: 'Ultradian BRAC · Kleitman',
    blurb: 'Longer cycles for sustained cognitive work. Break every ~90 min.',
  },
  {
    value: 'desktime_52_17',
    label: 'Deep Work (52 / 17)',
    workMinutes: 52, shortBreakMinutes: 17, longBreakMinutes: 25, longBreakEvery: 3,
    evidence: 'DeskTime productivity study, 2014',
    blurb: 'Ratio observed in the highest-performing 10% of knowledge workers.',
  },
  {
    value: 'gentle_recovery',
    label: 'Gentle Recovery (15 / 10)',
    workMinutes: 15, shortBreakMinutes: 10, longBreakMinutes: 20, longBreakEvery: 2,
    evidence: 'Brain-injury rehab pacing guidance',
    blurb: 'Short focus bursts with generous resets. Kind on a tired brain.',
  },
];

export function getPomodoroPreset(v: PomodoroPreset): PomodoroPresetConfig | undefined {
  return POMODORO_PRESETS.find(p => p.value === v);
}

export interface ProtectedWindow {
  id: string;
  name: string;
  start: string; // HH:mm
  end: string;   // HH:mm
  days: number[]; // 0=Sun..6=Sat
  active: boolean;
}

export interface BrainHealthyPrefs {
  brain_healthy_enabled: boolean;
  min_meeting_gap_minutes: number;
  longer_break_trigger_minutes: number;
  longer_break_length_minutes: number;
  daily_meeting_cap: number;
  no_daily_cap: boolean;
  auto_insert_breaks: boolean;
  break_length_minutes: number;
  break_style: BreakStyle;
  break_style_custom_label: string | null;
  reminder_buffer_minutes: number;
  protected_windows: ProtectedWindow[];
  time_blocking_enabled: boolean;
  time_block_template: 'blank' | 'classic_focus' | 'meeting_heavy' | 'recovery_friendly' | 'desktime_52_17';
  pomodoro_preset: PomodoroPreset;
}

export const BRAIN_HEALTHY_DEFAULTS: BrainHealthyPrefs = {
  brain_healthy_enabled: true,
  min_meeting_gap_minutes: 15,
  longer_break_trigger_minutes: 120,
  longer_break_length_minutes: 20,
  daily_meeting_cap: 5,
  no_daily_cap: false,
  auto_insert_breaks: true,
  break_length_minutes: 10,
  break_style: 'quiet_reset',
  break_style_custom_label: null,
  reminder_buffer_minutes: 10,
  protected_windows: [
    { id: 'seed-morning', name: 'Morning start-up', start: '07:30', end: '08:30', days: [1,2,3,4,5], active: true },
    { id: 'seed-lunch', name: 'Lunch', start: '12:30', end: '13:15', days: [1,2,3,4,5], active: true },
    { id: 'seed-winddown', name: 'Wind-down', start: '21:00', end: '22:00', days: [0,1,2,3,4,5,6], active: true },
  ],
  time_blocking_enabled: false,
  time_block_template: 'blank',
};

export interface NumRange { min: number; max: number; step: number; unit: string }

export const RANGES = {
  min_meeting_gap_minutes:      { min: 0,  max: 60,  step: 5,  unit: 'min' } as NumRange,
  longer_break_trigger_minutes: { min: 30, max: 240, step: 15, unit: 'min' } as NumRange,
  longer_break_length_minutes:  { min: 10, max: 60,  step: 5,  unit: 'min' } as NumRange,
  daily_meeting_cap:            { min: 1,  max: 20,  step: 1,  unit: 'meetings' } as NumRange,
  break_length_minutes:         { min: 5,  max: 30,  step: 5,  unit: 'min' } as NumRange,
  reminder_buffer_minutes:      { min: 0,  max: 60,  step: 5,  unit: 'min' } as NumRange,
} as const;

export const BREAK_STYLE_OPTIONS: { value: BreakStyle; label: string }[] = [
  { value: 'quiet_reset', label: 'Quiet reset' },
  { value: 'walk_move', label: 'Walk / move' },
  { value: 'hydrate_breathe', label: 'Hydrate & breathe' },
  { value: 'choose_each_time', label: 'Choose each time' },
  { value: 'custom', label: 'Custom…' },
];

export const DAY_LABELS = ['S','M','T','W','T','F','S'];
export const DAY_LABELS_FULL = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export function clampToRange(value: number, r: NumRange): number {
  if (Number.isNaN(value)) return r.min;
  const stepped = Math.round(value / r.step) * r.step;
  return Math.min(r.max, Math.max(r.min, stepped));
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
