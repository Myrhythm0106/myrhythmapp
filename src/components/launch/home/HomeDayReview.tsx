import React from 'react';
import { format } from 'date-fns';
import { Check, CornerDownRight, Plus } from 'lucide-react';
import type { LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';
import { cn } from '@/lib/utils';

/** Yesterday (remember) or tomorrow (prepare) — only when I ask for it. */
export function HomeDayReview({ which, date, events, onOpen, onCarry, onPrep }: {
  which: 'yesterday' | 'tomorrow'; date: Date; events: LaunchCalendarEvent[];
  onOpen: (e: LaunchCalendarEvent) => void; onCarry: (e: LaunchCalendarEvent) => void; onPrep: (e: LaunchCalendarEvent) => void;
}) {
  const items = events.filter(e => e.status !== 'cancelled' && !e.requiresAcceptance).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const done = items.filter(e => e.status === 'done');
  const left = items.filter(e => e.status === 'pending');

  return (
    <section className="space-y-3" aria-label={which === 'yesterday' ? 'Yesterday' : 'Tomorrow'}>
      <p className="text-base text-launch-ink/75">
        {which === 'yesterday'
          ? items.length === 0 ? 'Nothing was in my diary yesterday.' : `I completed ${done.length} of ${items.length}.${left.length ? ' I can carry the rest into today.' : ' Everything got done.'}`
          : items.length === 0 ? 'Tomorrow is open. Nothing to prepare.' : `${items.length} booked${items[0]?.time ? `, first at ${items[0].time.slice(0, 5)}` : ''}.`}
      </p>
      {items.length > 0 && (
        <ul className="divide-y divide-launch-gold/20">
          {items.map(e => (
            <li key={e.id} className="flex min-h-[60px] items-center gap-3">
              <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                e.status === 'done' ? 'border-launch-teal bg-launch-teal text-primary-foreground' : 'border-launch-gold/50')}>
                {e.status === 'done' && <Check className="h-4 w-4" />}
              </span>
              <button type="button" onClick={() => onOpen(e)} className="flex flex-1 items-center gap-3 py-2 text-left">
                <span className="w-12 tabular-nums text-sm text-launch-moss">{e.time?.slice(0, 5)}</span>
                <span className={cn('flex-1 text-base text-launch-ink-deep', e.status === 'done' && 'text-launch-ink/50')}>{e.title}</span>
              </button>
              {which === 'yesterday' && e.status === 'pending' && (
                <button type="button" onClick={() => onCarry(e)} className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-launch-gold/40 px-3 text-sm text-launch-ink hover:bg-launch-cream">
                  <CornerDownRight className="h-4 w-4" /> Carry over
                </button>
              )}
              {which === 'tomorrow' && e.status === 'pending' && (
                <button type="button" onClick={() => onPrep(e)} className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-launch-gold/40 px-3 text-sm text-launch-ink hover:bg-launch-cream">
                  <Plus className="h-4 w-4" /> Get ready today
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-launch-ink/50">{format(date, 'EEEE d MMMM')}</p>
    </section>
  );
}
