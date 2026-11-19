export type DiaryLevel = 'none' | 'busy' | 'see' | 'help';

export const DIARY_LEVELS: { value: Exclude<DiaryLevel, 'none'>; label: string; hint: string }[] = [
  { value: 'busy', label: 'Busy or free', hint: 'They see when I am busy, not what for.' },
  { value: 'see', label: 'See my day', hint: 'Titles and times. No notes or conversation details.' },
  { value: 'help', label: 'Help with my day', hint: 'They can also suggest items. I confirm each one.' },
];

export function diaryLevel(perms: Record<string, unknown> | null | undefined): DiaryLevel {
  const v = perms?.diary;
  return v === 'busy' || v === 'see' || v === 'help' ? v : 'none';
}

/** Sets the diary level; keeps the older calendar flag in step so alerts follow the same choice. */
export function withDiaryLevel(perms: Record<string, unknown> | null | undefined, level: DiaryLevel) {
  return { ...(perms ?? {}), diary: level, calendar: level !== 'none' };
}
