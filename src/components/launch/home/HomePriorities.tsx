import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import type { LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';
import { categoryFor, statusFor, type HomeMode } from '@/launch/today/homePrefs';
import { cn } from '@/lib/utils';

const STATUS = {
  overdue: { word: 'Overdue', dot: 'bg-launch-ember' },
  soon: { word: 'Due soon', dot: 'bg-launch-gold' },
  ontrack: { word: 'On track', dot: 'bg-launch-teal' },
} as const;

interface Props {
  items: LaunchCalendarEvent[];
  mode: HomeMode;
  readOnly?: boolean;
  onToggle?: (e: LaunchCalendarEvent) => void;
  onOpen?: (e: LaunchCalendarEvent) => void;
}

function Tick({ e, onToggle, readOnly }: { e: LaunchCalendarEvent; onToggle?: Props['onToggle']; readOnly?: boolean }) {
  const done = e.status === 'done';
  if (readOnly) return <span className={cn('h-3 w-3 shrink-0 rounded-full border', done ? 'border-launch-teal bg-launch-teal' : 'border-launch-gold/60')} aria-hidden="true" />;
  return (
    <button type="button" aria-pressed={done} aria-label={done ? `Mark "${e.title}" not done` : `Mark "${e.title}" done`}
      onClick={ev => { ev.stopPropagation(); onToggle?.(e); }}
      className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors',
        done ? 'border-launch-teal bg-launch-teal text-primary-foreground' : 'border-launch-gold/50 hover:border-launch-teal')}>
      {done && <Check className="h-5 w-5" />}
    </button>
  );
}

/** My top 3 today — as executive cards or calm rows. Tap opens the detail. */
export function HomePriorities({ items, mode, readOnly, onToggle, onOpen }: Props) {
  if (items.length === 0) return null;

  if (mode === 'list') {
    return (
      <ol className="divide-y divide-launch-gold/20">
        {items.map(e => (
          <li key={e.id} className="flex min-h-[64px] items-center gap-3">
            <Tick e={e} onToggle={onToggle} readOnly={readOnly} />
            <button type="button" onClick={() => onOpen?.(e)} disabled={!onOpen}
              className="flex flex-1 items-center gap-3 py-2 text-left">
              <span className="w-12 shrink-0 tabular-nums text-sm text-launch-moss">{e.time?.slice(0, 5)}</span>
              <span className={cn('flex-1 text-base text-launch-ink-deep', e.status === 'done' && 'text-launch-ink/45 line-through')}>{e.title}</span>
              <span className="hidden text-xs uppercase tracking-[0.16em] text-launch-moss sm:inline">{categoryFor(e)}</span>
              {onOpen && <ChevronRight className="h-4 w-4 text-launch-ink/35" />}
            </button>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map(e => {
        const st = STATUS[statusFor(e.time)];
        const done = e.status === 'done';
        return (
          <div key={e.id} role={onOpen ? 'button' : undefined} tabIndex={onOpen ? 0 : -1}
            onClick={() => onOpen?.(e)} onKeyDown={ev => { if (ev.key === 'Enter') onOpen?.(e); }}
            className={cn('group flex min-h-[148px] flex-col justify-between rounded-2xl border border-launch-gold/30 bg-launch-ivory p-4 text-left transition',
              onOpen && 'cursor-pointer hover:border-launch-gold/60 hover:shadow-[0_18px_40px_-28px_hsl(var(--launch-ink-deep)/0.45)]')}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-launch-moss">{categoryFor(e)}</span>
              <span className="tabular-nums text-sm text-launch-ink/60">{e.time?.slice(0, 5)}</span>
            </div>
            <p className={cn('mt-2 font-instrument text-xl leading-snug text-launch-ink-deep', done && 'text-launch-ink/45 line-through')}>{e.title}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-launch-ink/70">
                <span className={cn('h-2 w-2 rounded-full', done ? 'bg-launch-teal' : st.dot)} aria-hidden="true" />
                {done ? 'Done' : st.word}
              </span>
              <Tick e={e} onToggle={onToggle} readOnly={readOnly} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
