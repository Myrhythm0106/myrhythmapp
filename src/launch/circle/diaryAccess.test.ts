import { describe, it, expect } from 'vitest';
import { diaryLevel, withDiaryLevel } from './diaryAccess';

describe('Support Circle diary access', () => {
  it('is off unless I choose a level', () => {
    expect(diaryLevel({})).toBe('none');
    expect(diaryLevel({ calendar: true })).toBe('none');
  });
  it('turning sharing off also turns off diary alerts', () => {
    expect(withDiaryLevel({ diary: 'see', calendar: true, mood: true }, 'none')).toEqual({ diary: 'none', calendar: false, mood: true });
  });
  it('keeps other permissions untouched', () => {
    expect(withDiaryLevel({ mood: true }, 'help')).toEqual({ mood: true, diary: 'help', calendar: true });
  });
});
