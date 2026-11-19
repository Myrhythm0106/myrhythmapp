import React, { useState } from 'react';
import { addDays, format, isSameDay, startOfWeek, isToday } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import type { LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';
import { CalendarViewChooser } from './CalendarViewChooser';
import { cn } from '@/lib/utils';

/** A slim Mon–Sun line. Tap a day to unfold its agenda in place. */
export function HomeWeekStrip({ events, onOpen }: { events: LaunchCalendarEvent[]; onOpen?: (e: LaunchCalendarEvent) => void }) {
  const [open, setOpen] = useState<Date | null>(null);
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const today = new Date();
  const dayItems = (d: Date) => events.filter(e => isSameDay(e.date, d) && e.status !== 'cancelled' && !e.requiresAcceptance)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <section aria-label="My week" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-launch-moss">My week</h2>
        <CalendarViewChooser />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(d => {
          const n = dayItems(d).length;
          const rel = isToday(d) ? 'today' : isSameDay(d, addDays(today, -1)) ? 'yesterday' : isSameDay(d, addDays(today, 1)) ? 'tomorrow' : '';
          const sel = open && isSameDay(open, d);
          return (
            <button key={d.toISOString()} type="button" aria-expanded={!!sel}
              aria-label={`${format(d, 'EEEE d MMMM')}${n ? `, ${n} items` : ', nothing booked'}`}
              onClick={() => setOpen(sel ? null : d)}
              className={cn('flex min-h-[64px] flex-col items-center justify-center rounded-xl border text-center transition',
                rel === 'today' ? 'border-launch-ink bg-launch-ink text-primary-foreground'
                  : rel ? 'border-launch-gold/50 bg-launch-cream/60 text-launch-ink' : 'border-transparent text-launch-ink/75 hover:bg-launch-cream',
                sel && rel !== 'today' && 'border-launch-teal')}>
              <span className="text-[11px] uppercase tracking-[0.14em] opacity-80">{format(d, 'EEE')}</span>
              <span className="font-instrument text-xl leading-none">{format(d, 'd')}</span>
              <span className="mt-1 flex h-1.5 gap-0.5">{Array.from({ length: Math.min(n, 3) }).map((_, i) => <span key={i} className={cn('h-1.5 w-1.5 rounded-full', rel === 'today' ? 'bg-launch-gold' : 'bg-launch-teal')} />)}</span>
            </button>
          );
        })}
      </div>
      {open && (
        <div className="rounded-2xl border border-launch-gold/25 bg-launch-cream-light p-4">
          <div className="flex items-center justify-between">
            <p className="font-instrument text-lg text-launch-ink">{format(open, 'EEEE d MMMM')}</p>
            <button type="button" onClick={() => setOpen(null)} aria-label="Fold this day" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-launch-cream">
              <ChevronDown className="h-4 w-4 rotate-180 text-launch-ink/60" />
            </button>
          </div>
          {dayItems(open).length === 0 ? (
            <p className="mt-1 text-sm text-launch-ink/65">Nothing booked. The day is open.</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {dayItems(open).map(e => (
                <li key={e.id}>
                  <button type="button" onClick={() => onOpen?.(e)} className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-2 text-left hover:bg-launch-ivory">
                    <span className="w-12 tabular-nums text-sm text-launch-moss">{e.time?.slice(0, 5)}</span>
                    <span className={cn('flex-1 text-base text-launch-ink-deep', e.status === 'done' && 'text-launch-ink/45 line-through')}>{e.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
