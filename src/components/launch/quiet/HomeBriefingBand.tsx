import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Mic, CalendarDays, Users } from 'lucide-react';
import { getDailyEntry } from '@/data/iChoose365';
import type { LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';

interface Props {
  greeting: string;
  name?: string;
  events: LaunchCalendarEvent[];
  supporting?: string;
  sharedWith?: number;
  readOnly?: boolean;
}

/** The deep-emerald briefing at the top of Home: date, greeting, one-line brief, two actions. */
export function HomeBriefingBand({ greeting, name, events, supporting, sharedWith = 0, readOnly }: Props) {
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(t); }, []);
  const entry = useMemo(() => getDailyEntry(), []);

  const pending = events.filter(e => e.status === 'pending' && !e.requiresAcceptance).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const first = pending[0]?.time?.slice(0, 5);
  const brief = pending.length === 0
    ? 'The day is open. One small step is enough.'
    : `${pending.length} ${pending.length === 1 ? 'commitment' : 'commitments'} today${first ? `, first at ${first}` : ''}.`;

  return (
    <section className="exec-band relative overflow-hidden rounded-[28px] px-6 py-7 sm:px-10 sm:py-9" aria-label="Today's briefing">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border gold-hair opacity-40" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border gold-hair opacity-30" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b gold-hair pb-3">
          <p className="font-worksans text-xs font-semibold uppercase tracking-[0.28em] text-launch-gold">
            {format(now, 'EEEE d MMMM')} · {format(now, 'HH:mm')}
          </p>
          {supporting ? (
            <span className="font-worksans text-xs uppercase tracking-[0.2em] text-on-band-muted">Supporting {supporting} · view only</span>
          ) : sharedWith > 0 ? (
            <button type="button" onClick={() => navigate('/launch/support')} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border gold-hair px-3 text-xs text-on-band-muted hover:text-on-band">
              <Users className="h-3.5 w-3.5" /> Shared with {sharedWith} {sharedWith === 1 ? 'person' : 'people'}
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <h1 className="font-instrument text-4xl leading-[1.05] text-on-band sm:text-6xl">
              {greeting}{name ? `, ${name}` : ''}.
            </h1>
            <p className="mt-3 max-w-xl font-worksans text-base text-on-band-muted sm:text-lg">{brief}</p>
          </div>
          <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0">
            <span className="font-instrument text-6xl leading-none text-launch-gold sm:text-7xl tabular-nums">{pending.length}</span>
            <span className="font-worksans text-xs uppercase tracking-[0.24em] text-on-band-muted">still to do today</span>
          </div>
        </div>

        {!supporting && (
          <div className="mt-6 flex gap-4 border-l-2 gold-hair pl-4">
            <div>
              <p className="font-worksans text-[11px] font-semibold uppercase tracking-[0.24em] text-launch-gold">Today I choose</p>
              <p className="mt-1 font-instrument text-xl leading-snug text-on-band">{entry.statement}</p>
            </div>
          </div>
        )}

        {!readOnly && (
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate('/launch/memory?record=1')}
              className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-brand-orange-500 px-6 font-semibold text-primary-foreground shadow-lg transition hover:brightness-105">
              <Mic className="h-5 w-5" /> Record a conversation
            </button>
            <button type="button" onClick={() => navigate('/launch/calendar')}
              className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl border gold-hair px-6 font-semibold text-on-band transition hover:bg-launch-ivory/10">
              <CalendarDays className="h-5 w-5" /> See my day
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
