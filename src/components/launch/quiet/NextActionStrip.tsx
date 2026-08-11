import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isToday } from 'date-fns';
import { Clock, Check, ArrowRight, CalendarPlus, Loader2 } from 'lucide-react';
import { useLaunchCalendarEvents, type LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';
import { cn } from '@/lib/utils';

/**
 * NextActionStrip
 *
 * The single most important thing on Home: what's next today, with
 * "Done" and "Move to tomorrow" inline. No action here costs more than one tap.
 */
export function NextActionStrip() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const { events, loading, updateStatus, carryOver } = useLaunchCalendarEvents(today, today);
  const [busy, setBusy] = useState<string | null>(null);

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const next: LaunchCalendarEvent | undefined = useMemo(() => {
    const pending = events.filter(e => e.status === 'pending' && isToday(e.date));
    const upcoming = pending.find(e => {
      const [h, m] = (e.time || '00:00').split(':').map(Number);
      return h * 60 + m >= nowMinutes;
    });
    return upcoming ?? pending[0];
  }, [events, nowMinutes]);

  if (loading && events.length === 0) {
    return (
      <div className="rounded-3xl border border-launch-gold/30 bg-launch-ivory p-5 h-[104px] animate-pulse" />
    );
  }

  if (!next) {
    return (
      <div className="rounded-3xl border border-launch-gold/30 bg-launch-ivory p-5">
        <p className="text-sm font-semibold text-launch-ink">Nothing scheduled yet today.</p>
        <p className="text-xs text-launch-ink/60 mt-1">One small thing is enough.</p>
        <button
          type="button"
          onClick={() => navigate('/launch/calendar')}
          className="mt-3 w-full sm:w-auto min-h-[56px] sm:min-h-[48px] px-5 rounded-2xl bg-brand-orange-500 text-white font-semibold inline-flex items-center justify-center gap-2"
        >
          <CalendarPlus className="h-5 w-5" />
          Plan one thing
        </button>
      </div>
    );
  }

  const run = async (fn: () => Promise<unknown>, key: string) => {
    setBusy(key);
    await fn();
    setBusy(null);
  };

  return (
    <div className="rounded-3xl border border-brand-orange-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand-orange-700 font-semibold">
        <Clock className="h-3.5 w-3.5" />
        Next today · {next.time}
      </div>
      <p className="mt-1.5 text-lg font-semibold text-launch-ink leading-snug">{next.title}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => run(() => updateStatus(next.id, 'done'), 'done')}
          className={cn(
            'min-h-[56px] px-5 rounded-2xl bg-brand-orange-500 text-white font-semibold inline-flex items-center gap-2',
            busy && 'opacity-60'
          )}
        >
          {busy === 'done' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
          Done it
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => run(() => carryOver(next), 'move')}
          className="min-h-[56px] px-5 rounded-2xl border border-brain-health-200 text-launch-ink font-medium inline-flex items-center gap-2"
        >
          {busy === 'move' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          Move to tomorrow
        </button>
        <button
          type="button"
          onClick={() => navigate('/launch/calendar')}
          className="min-h-[56px] px-4 rounded-2xl text-launch-ink/70 font-medium inline-flex items-center gap-1"
        >
          See {format(today, 'EEEE')}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default NextActionStrip;
