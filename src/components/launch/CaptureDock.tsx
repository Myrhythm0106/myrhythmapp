import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Mic, X, Plus, Loader2, History, Square } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppReady } from '@/hooks/useAppReady';
import { useLaunchCalendarEvents } from '@/hooks/useLaunchCalendarEvents';
import { supabase } from '@/integrations/supabase/client';
import { useCaptureStatus, requestCaptureStop } from '@/launch/capture/captureStatus';

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
  const capture = useCaptureStatus();
  const navigate = useNavigate();

  if (!appReady) return null;

  // While a capture is running, keep both reassurance and Stop available from
  // every signed-in page.
  if (capture.active) {
    return (
      <div
        className={cn(
          'fixed right-4 bottom-24 md:bottom-8 z-[80]',
           'min-h-16 rounded-full shadow-xl bg-launch-ember px-2 py-2',
          'flex items-center gap-1 transition-all'
        )}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <button
          type="button"
          onClick={() => navigate('/launch/memory')}
          aria-label="Recording now — go back to my recording"
          className="min-h-12 flex items-center gap-2 rounded-full px-3 text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-launch-gold/50"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <span className="font-semibold text-sm">Listening · {Math.floor(capture.seconds / 60)}:{(capture.seconds % 60).toString().padStart(2, '0')}</span>
        </button>
        <button
          type="button"
          onClick={requestCaptureStop}
          aria-label="Stop recording"
          title="Stop recording"
          className="h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-launch-gold/50"
        >
          <Square className="h-5 w-5 fill-current" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Quick start recording"
        className={cn(
           'fixed right-4 bottom-24 md:bottom-8 z-[80]',
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
  const [noteOpen, setNoteOpen] = useState(false);
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
    setNoteOpen(false);
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
        aria-label="Quick start"
        className="relative w-full sm:max-w-md bg-launch-ivory rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 pb-safe border border-launch-gold/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-launch-ink font-display">Quick start</h2>
          <button type="button" onClick={onClose} aria-label="Close"
            className="h-12 w-12 rounded-full bg-white border border-launch-gold/20 flex items-center justify-center">
            <X className="h-5 w-5 text-launch-ink/70" />
          </button>
        </div>

        <button type="button"
          onClick={() => { onClose(); navigate('/launch/memory?record=1&quick=1'); }}
          className="w-full min-h-[72px] rounded-2xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-semibold text-lg flex items-center justify-center gap-3 shadow-md">
          <Mic className="h-6 w-6" /> Start recording now
        </button>
        <p className="mt-2 text-center text-sm text-launch-ink/65">Starts straight away. Add a name and details after, if you want.</p>

        {!noteOpen ? (
          <button type="button" onClick={() => setNoteOpen(true)}
            className="mt-4 w-full min-h-[56px] rounded-2xl border border-launch-gold/30 bg-white text-launch-ink font-medium flex items-center justify-center gap-2">
            <Plus className="h-5 w-5 text-launch-teal" /> Type a quick note
          </button>
        ) : (
          <div className="mt-4">
            <label htmlFor="capture-dock-note" className="sr-only">What do you want to remember?</label>
            <textarea id="capture-dock-note" autoFocus value={text} onChange={e => setText(e.target.value)} rows={3}
              placeholder="What do you want to remember or do?"
              className="w-full rounded-2xl border border-launch-gold/30 bg-white p-3 text-base text-launch-ink focus:outline-none focus:ring-2 focus:ring-launch-teal/40 resize-none" />
            <button type="button" onClick={handleSave} disabled={!text.trim() || saving}
              className="mt-2 w-full min-h-[56px] rounded-2xl bg-launch-teal text-white font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />} Save to today
            </button>
          </div>
        )}

        {last && (
          <button type="button"
            onClick={() => { onClose(); navigate(`/launch/memory?open=${last.recordingId}`); }}
            className="mt-3 w-full min-h-[56px] rounded-2xl border border-launch-gold/30 bg-white px-4 flex items-center gap-3 text-left">
            <History className="h-5 w-5 text-launch-teal shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-launch-ink truncate">My last conversation: {last.title}</span>
              <span className="block text-xs text-launch-ink/60 truncate">
                {[last.referenceCode, last.startedAt ? format(new Date(last.startedAt), 'd MMM, HH:mm') : null].filter(Boolean).join(' · ')}
              </span>
            </span>
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}

export default CaptureDock;
