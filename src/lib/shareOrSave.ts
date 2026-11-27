import { saveAs } from 'file-saver';

/** On phones, open the share sheet (email, messages, files); otherwise download. */
export async function shareOrSave(blob: Blob, filename: string): Promise<'shared' | 'saved'> {
  try {
    const file = new File([blob], filename, { type: blob.type });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    const touch = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
    if (touch && nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title: filename });
      return 'shared';
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return 'shared';
  }
  saveAs(blob, filename);
  return 'saved';
}
