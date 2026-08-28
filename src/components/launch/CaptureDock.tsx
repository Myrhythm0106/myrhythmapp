import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Mic, X, Plus, Activity, Loader2, History, Square } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppReady } from '@/hooks/useAppReady';
import { useLaunchCalendarEvents } from '@/hooks/useLaunchCalendarEvents';
import { supabase } from '@/integrations/supabase/client';
import { useRecordingLive } from '@/launch/capture/recordingSignal';

/**
 * CaptureDock
 *
 * One persistent capture button available on every in-app page.
 * Tap once -> sheet opens over the current page (no navigation, no lost place).
 * From the sheet: type a note straight into today, record a conversation,
 * or do the daily check-in. Every action here is at most 2 taps.
 */
export function CaptureDock() {
  const appReady = useAppReady();
  const [open, setOpen] = useState(false);
  const recordingLive = useRecordingLive();
  const navigate = useNavigate();

  if (!appReady) return null;

  // While a capture is running, one tap takes me straight back to it.
  if (recordingLive) {
    return (
      <button
        type="button"
        onClick={() => navigate('/launch/memory')}
        aria-label="Recording now — go back to my recording"
        className={cn(
          'fixed right-4 bottom-24 md:bottom-8 z-40',
          'h-16 px-5 rounded-full shadow-xl',
          'bg-red-600 hover:bg-red-700 active:scale-95',
          'flex items-center gap-2 transition-all',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300'
        )}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <span className="text-white font-semibold text-sm">Recording</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Capture something"
        className={cn(
          'fixed right-4 bottom-24 md:bottom-8 z-40',
          'h-16 w-16 rounded-full shadow-xl',
          'bg-brand-orange-500 hover:bg-brand-orange-600 active:scale-95',
          'flex items-center justify-center transition-all',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange-300'
        )}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Mic className="h-7 w-7 text-white" aria-hidden="true" />
      </button>

      <CaptureSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

interface LastConversation {
  recordingId: string;
  title: string;
  referenceCode?: string;
  startedAt?: string;
}

function CaptureSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const today = new Date();
  const { addEvent } = useLaunchCalendarEvents(today, today);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [last, setLast] = useState<LastConversation | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setText('');
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('meeting_recordings')
        .select('id, recording_id, meeting_title, reference_code, started_at')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled || !data) return;
      setLast({
        recordingId: data.recording_id || data.id,
        title: data.meeting_title || 'My last conversation',
        referenceCode: data.reference_code || undefined,
        startedAt: data.started_at || undefined,
      });
    })();
    return () => { cancelled = true; };
  }, [open]);

  if (!open) return null;

  const handleSave = async () => {
    const title = text.trim();
    if (!title) return;
    setSaving(true);
    const next = new Date(Date.now() + 60 * 60 * 1000);
    await addEvent({
      title,
      time: format(next, 'HH:mm'),
      type: 'action',
      date: today,
      reminder_level: 'steady',
    });
    setSaving(false);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Capture"
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 pb-safe"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-brain-health-900">Capture</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close capture"
            className="h-11 w-11 rounded-full bg-brain-health-50 hover:bg-brain-health-100 flex items-center justify-center"
          >
            <X className="h-5 w-5 text-brain-health-700" />
          </button>
        </div>

        <label htmlFor="capture-dock-note" className="sr-only">
          What do you want to remember?
        </label>
        <textarea
          id="capture-dock-note"
          autoFocus
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          placeholder="What do you want to remember or do?"
          className="w-full rounded-2xl border border-brain-health-200 p-3 text-base text-brain-health-900 focus:outline-none focus:ring-2 focus:ring-brand-orange-400 resize-none"
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={!text.trim() || saving}
          className="mt-3 w-full min-h-[56px] rounded-2xl bg-brand-orange-500 text-white font-semibold text-base disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          Save to today
        </button>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { onClose(); navigate('/launch/memory?record=1'); }}
            className="min-h-[56px] rounded-2xl border border-brain-health-200 bg-white text-brain-health-900 font-medium flex items-center justify-center gap-2"
          >
            <Mic className="h-5 w-5 text-brand-orange-600" />
            Record
          </button>
          <button
            type="button"
            onClick={() => { onClose(); navigate('/launch/calibrate'); }}
            className="min-h-[56px] rounded-2xl border border-brain-health-200 bg-white text-brain-health-900 font-medium flex items-center justify-center gap-2"
          >
            <Activity className="h-5 w-5 text-clarity-teal-600" />
            Check in
          </button>
        </div>

        {last && (
          <button
            type="button"
            onClick={() => { onClose(); navigate(`/launch/memory?open=${last.recordingId}`); }}
            className="mt-3 w-full min-h-[56px] rounded-2xl border border-brain-health-200 bg-white px-4 flex items-center gap-3 text-left"
          >
            <History className="h-5 w-5 text-clarity-teal-600 shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-brain-health-900 truncate">
                {last.title}
              </span>
              <span className="block text-[11px] text-brain-health-500 truncate">
                {[last.referenceCode, last.startedAt ? format(new Date(last.startedAt), 'd MMM, HH:mm') : null]
                  .filter(Boolean)
                  .join(' · ') || 'My last conversation'}
              </span>
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => { onClose(); navigate('/launch/memory'); }}
          className="mt-2 w-full text-center text-xs text-brain-health-600 underline min-h-[44px]"
        >
          All my conversations
        </button>

        <p className="mt-3 text-center text-[11px] text-brain-health-500">
          Nothing to get right. You can change it later.
        </p>
      </div>
    </div>,
    document.body
  );
}

export default CaptureDock;
