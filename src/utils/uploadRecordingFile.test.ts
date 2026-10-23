import { describe, it, expect } from 'vitest';
import { isSupportedRecordingFile, friendlyUploadTitle } from './uploadRecordingFile';

const f = (name: string, type = '') => new File(['x'], name, { type, lastModified: new Date(2026, 9, 23, 14, 15).getTime() });

describe('watch and phone voice memos', () => {
  it('accepts watch formats even with no file type', () => {
    for (const n of ['New Recording.m4a', 'Recording_1.amr', 'memo.aac', 'clip.3gp', 'x.opus']) {
      expect(isSupportedRecordingFile(f(n))).toBe(true);
    }
  });
  it('names a voice memo without asking', () => {
    expect(friendlyUploadTitle(f('New Recording 12.m4a'))).toMatch(/^From my watch or phone · Fri 23 Oct, 2:15pm$/);
  });
  it('keeps a real file name', () => {
    expect(friendlyUploadTitle(f('GP appointment.mp3'))).toBe('GP appointment');
  });
});
