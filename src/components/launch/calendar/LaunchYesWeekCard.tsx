import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { YES_LETTERS, getYesWeek } from '@/launch/framework/yes';
import { buildYesActions, type YesAction } from '@/launch/yes/yesActions';
import { readLocalFocusValue, writeLocalFocusValue } from '@/hooks/useLaunchFocusDisplay';

interface Props {
  date: Date;
  onAdd?: (action: YesAction) => void;
}

/** This week's YES actions as suggestions. Nothing joins the calendar without a tap. */
export function LaunchYesWeekCard({ date, onAdd }: Props) {
  const { user } = useAuth();
  const key = `launch.yes-day:${user?.id ?? 'signed-out'}:${format(date, 'yyyy-MM-dd')}`;
  const [handled, setHandled] = useState<Record<string, 'added' | 'skipped'>>({});
  useEffect(() => { setHandled(readLocalFocusValue(key, {})); }, [key]);

  const week = getYesWeek(date);
  if (!week) return null;

  if (week === 'done') {
    return (
      <section className="rounded-2xl border border-launch-gold/40 bg-launch-ivory p-4 text-launch-ink">
        <p className="font-semibold">My first 3 weeks are done</p>
        <p className="text-sm text-launch-ink/70 mt-1">Well done for showing up. Keep what helped, and build from here.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Link to="/launch/assessment?mode=full" className="inline-flex items-center min-h-[48px] px-4 rounded-full bg-launch-teal text-white text-sm font-semibold">Continue my full picture</Link>
          <Link to="/launch/assessment/history" className="inline-flex items-center min-h-[48px] px-4 rounded-full border border-launch-gold/50 text-sm font-semibold">See how I'm tracking</Link>
        </div>
      </section>
    );
  }

  const letter = YES_LETTERS[week - 1];
  const actions = buildYesActions().filter((a) => a.week === week);
  const mark = (id: string, v: 'added' | 'skipped') => {
    const next = { ...handled, [id]: v };
    setHandled(next);
    writeLocalFocusValue(key, next);
  };

  return (
    <section aria-label="This week in my YES plan" className="rounded-2xl border border-launch-teal/30 bg-launch-teal/5 p-4 text-launch-ink">
      <p className="text-xs uppercase tracking-[0.2em] font-bold text-launch-teal">This week in my YES plan</p>
      <p className="font-semibold mt-1">Week {week} of 3 · {letter.id} — {letter.word}</p>
      <ul className="mt-3 space-y-2">
        {actions.map((a) => {
          const state = handled[a.id];
          if (state === 'skipped') return null;
          return (
            <li key={a.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-launch-ivory border border-launch-gold/30 p-3">
              <span className="text-sm font-semibold w-12 shrink-0">{a.suggestedTime}</span>
              <span className="flex-1 min-w-[10rem] text-base">{a.title}</span>
              {state === 'added' ? (
                <span className="inline-flex items-center gap-1 text-sm text-launch-teal font-semibold"><Check className="h-4 w-4" />In my day</span>
              ) : (
                <span className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { onAdd?.(a); mark(a.id, 'added'); }}
                    className="inline-flex items-center gap-1 min-h-[44px] px-3 rounded-full bg-launch-teal text-white text-sm font-semibold"
                  >
                    <Plus className="h-4 w-4" />Add to my day
                  </button>
                  <button
                    type="button"
                    onClick={() => mark(a.id, 'skipped')}
                    aria-label={`Not today: ${a.title}`}
                    className="inline-flex items-center gap-1 min-h-[44px] px-3 rounded-full border border-launch-gold/50 text-sm"
                  >
                    <X className="h-4 w-4" />Not today
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
