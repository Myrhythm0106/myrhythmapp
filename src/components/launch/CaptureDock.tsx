import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Mic, X, Plus, Activity, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppReady } from '@/hooks/useAppReady';
import { useLaunchCalendarEvents } from '@/hooks/useLaunchCalendarEvents';

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

  if (!appReady) return null;

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

function CaptureSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const today = new Date();
  const { addEvent } = useLaunchCalendarEvents(today, today);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setText('');
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
            onClick={() => { onClose(); navigate('/launch/memory?quick=1'); }}
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

        <p className="mt-3 text-center text-[11px] text-brain-health-500">
          Nothing to get right. You can change it later.
        </p>
      </div>
    </div>,
    document.body
  );
}

export default CaptureDock;
