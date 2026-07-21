import React from 'react';
import { GrowthStatePicker } from './GrowthStatePicker';
import { GrowthPathStrip } from './GrowthPathStrip';
import { useGrowthStates } from '@/hooks/useGrowthStates';
import { MYRHYTHM_G_BRAND } from './states';
import { cn } from '@/lib/utils';

interface MyRhythmGCardProps {
  className?: string;
  ownerId?: string; // read-only when set
  compact?: boolean;
}

/** First-class MyRHYTHM-G card for /launch/calibrate and Support Circle read-only view. */
export function MyRhythmGCard({ className, ownerId, compact }: MyRhythmGCardProps) {
  const { today, history, logState, saving } = useGrowthStates(ownerId);
  const readOnly = !!ownerId;

  return (
    <section
      aria-label={`${MYRHYTHM_G_BRAND} — where you are in your rhythm today`}
      className={cn(
        'rounded-2xl border border-brain-health-100 bg-white/70 backdrop-blur-sm p-4 sm:p-5 shadow-sm',
        className
      )}
    >
      <header className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide uppercase text-brain-health-500">
            {MYRHYTHM_G_BRAND}
          </p>
          <h3 className="text-base sm:text-lg font-semibold text-brain-health-900 leading-tight">
            {readOnly
              ? "Where they are in their rhythm"
              : 'Where are you in your rhythm today?'}
          </h3>
        </div>
        {today && (
          <span className="text-[11px] text-brain-health-500 whitespace-nowrap">
            Today · logged
          </span>
        )}
      </header>

      {!readOnly && (
        <GrowthStatePicker
          value={today?.letter}
          onSelect={(letter) => logState(letter)}
          disabled={saving}
        />
      )}

      {readOnly && today && (
        <p className="text-sm text-brain-health-700">
          Today: <span className="font-semibold">{today.letter}</span>
        </p>
      )}

      {!compact && (
        <div className="mt-4 pt-3 border-t border-brain-health-100/70">
          <p className="text-[11px] font-medium text-brain-health-500 mb-1.5">
            Last 30 days
          </p>
          <GrowthPathStrip history={history} />
        </div>
      )}

      <p className="mt-3 text-[11px] text-brain-health-500 leading-snug">
        {MYRHYTHM_G_BRAND} uses the same 8 letters as your MYRHYTHM assessment —
        one is who you are, the other is where you are today.
      </p>
    </section>
  );
}
