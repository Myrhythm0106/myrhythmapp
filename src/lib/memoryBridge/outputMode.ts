import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/** What the person wants from a recording. */
export type OutputMode = 'both' | 'transcript' | 'actions' | 'none';

export const OUTPUT_MODE_LABELS: Record<OutputMode, { title: string; hint: string }> = {
  both: { title: 'Transcript and actions', hint: 'Every word, plus my next steps' },
  transcript: { title: 'Transcript only', hint: 'Every word — no actions' },
  actions: { title: 'Actions only', hint: 'My next steps — transcript not kept' },
  none: { title: 'Just save the recording', hint: 'Nothing written up — I can ask later' },
};

const KEY = 'myrhythm:output-mode:v1';
const EVT = 'myrhythm:output-mode-change';

export function readOutputMode(): OutputMode {
  try {
    const v = localStorage.getItem(KEY) as OutputMode | null;
    if (v && v in OUTPUT_MODE_LABELS) return v;
  } catch { /* noop */ }
  return 'both';
}

export function writeOutputMode(mode: OutputMode) {
  try {
    localStorage.setItem(KEY, mode);
    window.dispatchEvent(new CustomEvent(EVT));
  } catch { /* noop */ }
}

/** Remembered default — set once, changeable any time. */
export function useOutputMode(): [OutputMode, (m: OutputMode) => void] {
  const [mode, setMode] = useState<OutputMode>(() => readOutputMode());
  useEffect(() => {
    const sync = () => setMode(readOutputMode());
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  const set = useCallback((m: OutputMode) => { writeOutputMode(m); setMode(m); }, []);
  return [mode, set];
}

/**
 * Run a follow-up job on an already-saved meeting: "get my transcript / actions
 * now" or "update my actions from the corrected transcript". Polls until done.
 */
export async function runMeetingJob(
  meetingId: string,
  userId: string,
  opts: { outputMode?: OutputMode; reextract?: boolean; filePath?: string },
): Promise<{ success: boolean; error?: string }> {
  await supabase.from('meeting_recordings')
    .update({ processing_status: 'processing', processing_error: null })
    .eq('id', meetingId);
  const { data, error } = await supabase.functions.invoke('process-meeting-audio', {
    body: { meetingId, userId, ...opts },
  });
  if (error || (data && (data as any).success === false)) {
    return { success: false, error: (error as any)?.message || (data as any)?.error || 'Could not start' };
  }
  for (let i = 0; i < 450; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const { data: row } = await supabase
      .from('meeting_recordings')
      .select('processing_status, processing_error')
      .eq('id', meetingId)
      .maybeSingle();
    if (row?.processing_status === 'completed') return { success: true };
    if (row?.processing_status === 'failed' || row?.processing_status === 'error') {
      return { success: false, error: row.processing_error || 'Processing failed' };
    }
  }
  return { success: false, error: 'Still working — check back in a few minutes.' };
}
