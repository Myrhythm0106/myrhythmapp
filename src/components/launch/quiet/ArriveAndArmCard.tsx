import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isToday } from 'date-fns';
import { Mic, X } from 'lucide-react';
import { useLaunchCalendarEvents, type LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';
import { useCapturePreferences } from '@/hooks/useCapturePreferences';
import { useCaptureStatus } from '@/launch/capture/captureStatus';

/**
 * Arrive-and-arm.
 *
 * If something in my diary is happening right now, MyRhythm asks once —
 * gently — whether I want it captured. It never starts the microphone on its
 * own, and once I've answered for that meeting it stays quiet.
 */

/** Conversations are worth capturing; a reminder or a rest block is not. */
const CAPTURE_TYPES = new Set(['meeting', 'appointment', 'call']);

/** How long after a start time the offer still makes sense. */
const WINDOW_MINUTES = 45;

function dismissKey(eventId: string, date: Date): string {
  const stamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return `myrhythm:arrive-and-arm:${stamp}:${eventId}`;
}

function minutesFromTime(time: string | null | undefined): number | null {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export function ArriveAndArmCard() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const { events } = useLaunchCalendarEvents(today, today);
  const { prefs } = useCapturePreferences();
  const capture = useCaptureStatus();
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  // Re-check every minute so the offer appears as the meeting begins.
  const [nowMinutes, setNowMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = new Date();
      setNowMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const live: LaunchCalendarEvent | undefined = useMemo(() => {
    if (!prefs.capturePromptEnabled) return undefined;
    return events.find((event) => {
      if (event.status !== 'pending' || !isToday(event.date)) return false;
      if (!CAPTURE_TYPES.has((event.type || '').toLowerCase())) return false;
      const start = minutesFromTime(event.time);
      if (start === null) return false;
      const end = minutesFromTime(event.end_time) ?? start + WINDOW_MINUTES;
      return nowMinutes >= start && nowMinutes <= Math.min(end, start + WINDOW_MINUTES);
    });
  }, [events, nowMinutes, prefs.capturePromptEnabled]);

  // Already answered for this meeting today? Stay quiet.
  const alreadyAnswered = useMemo(() => {
    if (!live) return false;
    if (dismissedId === live.id) return true;
    try {
      return localStorage.getItem(dismissKey(live.id, today)) !== null;
    } catch {
      return false;
    }
  }, [live, dismissedId, today]);

  if (!live || alreadyAnswered || capture.active) return null;

  const answer = (startCapture: boolean) => {
    try {
      localStorage.setItem(dismissKey(live.id, today), new Date().toISOString());
    } catch {
      /* storage blocked — the in-memory dismissal still holds for this visit */
    }
    setDismissedId(live.id);
    if (startCapture) navigate('/launch/memory?record=1');
  };

  return (
    <div className="relative rounded-3xl border border-brand-orange-200 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={() => answer(false)}
        aria-label="Not this one"
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-launch-ink/50 hover:bg-launch-ivory"
      >
        <X className="h-5 w-5" />
      </button>

      <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-700">
        Happening now · {live.time}
      </p>
      <p className="mt-1.5 pr-10 text-lg font-semibold leading-snug text-launch-ink">{live.title}</p>
      <p className="mt-1 text-sm text-launch-ink/60">
        Shall I capture this one, so I don't have to hold it all in my head?
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => answer(true)}
          className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-brand-orange-500 px-5 font-semibold text-white"
        >
          <Mic className="h-5 w-5" />
          Capture this
        </button>
        <button
          type="button"
          onClick={() => answer(false)}
          className="inline-flex min-h-[56px] items-center rounded-2xl border border-brain-health-200 px-5 font-medium text-launch-ink"
        >
          Not this one
        </button>
      </div>
    </div>
  );
}

export default ArriveAndArmCard;
