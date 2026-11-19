import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';

const toMin = (t?: string) => { const [h, m] = (t || '00:00').split(':').map(Number); return h * 60 + (m || 0); };

function until(mins: number) {
  if (mins <= 0) return 'now';
  if (mins < 60) return `in ${mins} min`;
  const h = Math.floor(mins / 60); const m = mins % 60;
  return `in ${h} h${m ? ` ${m} min` : ''}`;
}

/** Up next: the next commitment with a live countdown, then the rest of the day in small type. */
export function HomeUpNext({ events, excludeIds = [], onDone, readOnly }: {
  events: LaunchCalendarEvent[]; excludeIds?: string[]; onDone?: (id: string, status: 'done' | 'pending') => Promise<unknown> | void; readOnly?: boolean;
}) {
  const navigate = useNavigate();
  const [nowMin, setNowMin] = useState(() => new Date().getHours() * 60 + new Date().getMinutes());
  useEffect(() => { const t = setInterval(() => setNowMin(new Date().getHours() * 60 + new Date().getMinutes()), 60_000); return () => clearInterval(t); }, []);

  const upcoming = useMemo(() => events
    .filter(e => e.status === 'pending' && !e.requiresAcceptance && toMin(e.time) >= nowMin - 15)
    .sort((a, b) => toMin(a.time) - toMin(b.time)), [events, nowMin]);
  const next = upcoming.find(e => !excludeIds.includes(e.id)) ?? upcoming[0];
  const later = upcoming.filter(e => e.id !== next?.id).slice(0, 3);

  return (
    <section aria-labelledby="upnext-title" className="exec-card flex h-full flex-col rounded-3xl p-6">
      <h2 id="upnext-title" className="font-worksans text-xs font-semibold uppercase tracking-[0.24em] text-launch-moss">Up next</h2>
      {next ? (
        <>
          <p className="mt-4 font-instrument text-5xl leading-none text-launch-ink tabular-nums">{next.time?.slice(0, 5)}</p>
          <p className="mt-3 text-lg font-semibold leading-snug text-launch-ink-deep">{next.title}</p>
          <p className="mt-1 text-sm text-launch-teal font-semibold">{until(toMin(next.time) - nowMin)}</p>
          {!readOnly && (
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={async () => {
                await onDone?.(next.id, 'done');
                toast('Marked done in my diary', { action: { label: 'Undo', onClick: () => void onDone?.(next.id, 'pending') } });
              }} className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-2xl bg-launch-teal px-4 font-semibold text-primary-foreground">
                <Check className="h-5 w-5" /> Done
              </button>
              <button type="button" aria-label="Open in my day" onClick={() => navigate('/launch/calendar?view=day')}
                className="flex min-h-[56px] min-w-[56px] items-center justify-center rounded-2xl border border-launch-gold/40 text-launch-ink">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
          {later.length > 0 && (
            <ul className="mt-5 space-y-2 border-t border-launch-gold/25 pt-4">
              {later.map(e => (
                <li key={e.id} className="flex items-baseline gap-3 text-sm text-launch-ink/75">
                  <span className="w-12 shrink-0 tabular-nums text-launch-moss">{e.time?.slice(0, 5)}</span>
                  <span className="truncate">{e.title}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="mt-4 text-base text-launch-ink/75">Nothing else booked today. The rest of the day is mine.</p>
      )}
    </section>
  );
}
