import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { formatMinutes, NEXT_TIER, RECORDING_LIMITS } from '@/config/recordingLimits';
import { useRecordingAllowance, type AllowancePeriod } from '@/hooks/useRecordingAllowance';

interface RecordingEggTimerProps {
  className?: string;
  compact?: boolean;
}

export const RecordingEggTimer: React.FC<RecordingEggTimerProps> = ({ className, compact }) => {
  const {
    tier,
    limits,
    period,
    setPeriod,
    usedMinutes,
    allowanceMinutes,
    remainingMinutes,
    fractionUsed,
    recordingCount,
    resetLabel,
  } = useRecordingAllowance();

  const [expanded, setExpanded] = useState(false);

  const tone =
    fractionUsed >= 0.9 ? 'danger' : fractionUsed >= 0.75 ? 'warn' : 'calm';

  const sandColour =
    tone === 'danger' ? 'text-launch-ember' : tone === 'warn' ? 'text-launch-gold' : 'text-launch-moss';

  const nextTier = NEXT_TIER[tier];

  // Sand: top bulb empties as allowance is used, bottom bulb fills.
  const topFill = 1 - fractionUsed;
  const bottomFill = fractionUsed;

  return (
    <div
      className={cn(
        'rounded-2xl border border-launch-gold/30 bg-white/70 p-4 text-center',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-center gap-1 rounded-full bg-launch-ink/5 p-1 text-xs font-medium">
        {(['week', 'month'] as AllowancePeriod[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            aria-pressed={period === p}
            className={cn(
              'min-h-[36px] rounded-full px-4 transition-colors',
              period === p ? 'bg-white text-launch-ink shadow-sm' : 'text-launch-ink/60'
            )}
          >
            {p === 'week' ? 'Week' : 'Month'}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        {/* Hourglass */}
        <svg
          viewBox="0 0 60 90"
          className={cn('h-20 w-14 shrink-0', sandColour)}
          aria-hidden="true"
        >
          <defs>
            <clipPath id="egg-top">
              <path d="M10,8 L50,8 L34,44 L26,44 Z" />
            </clipPath>
            <clipPath id="egg-bottom">
              <path d="M26,46 L34,46 L50,82 L10,82 Z" />
            </clipPath>
          </defs>
          {/* Glass */}
          <path
            d="M10,8 L50,8 L34,45 L50,82 L10,82 L26,45 Z"
            fill="currentColor"
            fillOpacity="0.06"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          {/* Top sand */}
          <g clipPath="url(#egg-top)">
            <rect
              x="0"
              y={8 + 36 * (1 - topFill)}
              width="60"
              height={36 * topFill}
              fill="currentColor"
              fillOpacity="0.75"
            />
          </g>
          {/* Bottom sand */}
          <g clipPath="url(#egg-bottom)">
            <rect
              x="0"
              y={82 - 36 * bottomFill}
              width="60"
              height={36 * bottomFill}
              fill="currentColor"
              fillOpacity="0.55"
            />
          </g>
          {/* Caps */}
          <rect x="8" y="5" width="44" height="4" rx="2" fill="currentColor" fillOpacity="0.4" />
          <rect x="8" y="81" width="44" height="4" rx="2" fill="currentColor" fillOpacity="0.4" />
        </svg>

        <div className="text-left">
          <p
            className={cn('font-display text-2xl font-bold leading-tight', sandColour)}
            aria-live="polite"
          >
            {formatMinutes(remainingMinutes)} left
          </p>
          <p className="mt-1 text-xs text-launch-ink/60">
            of {formatMinutes(allowanceMinutes)} this {period} · {resetLabel}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-launch-ink/40">
            {limits.label} · up to {formatMinutes(limits.perRecordingMinutes)} in one go
          </p>
        </div>
      </div>

      {!compact && (
        <>
          <button
            onClick={() => setExpanded(v => !v)}
            className="mx-auto mt-3 flex min-h-[44px] items-center gap-1 px-3 text-xs font-medium text-launch-ink/60"
            aria-expanded={expanded}
          >
            {expanded ? 'Hide details' : 'See details'}
            <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
          </button>

          {expanded && (
            <div className="mt-1 space-y-1 border-t border-launch-gold/20 pt-3 text-xs text-launch-ink/70">
              <p>
                {recordingCount} recording{recordingCount === 1 ? '' : 's'} this {period} ·{' '}
                {formatMinutes(usedMinutes)} recorded
              </p>
              {nextTier && (
                <p className="text-launch-ink/60">
                  {RECORDING_LIMITS[nextTier].label} gives you{' '}
                  {formatMinutes(RECORDING_LIMITS[nextTier].perRecordingMinutes)} per recording and{' '}
                  {formatMinutes(RECORDING_LIMITS[nextTier].monthlyMinutes)} a month.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecordingEggTimer;
