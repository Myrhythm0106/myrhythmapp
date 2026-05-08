import React from 'react';
import { cn } from '@/lib/utils';

export type EnergyValue = 1 | 2 | 3 | 4 | 5;

const LABELS: Record<EnergyValue, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Steady',
  4: 'Strong',
  5: 'Peak',
};

const TONES: Record<EnergyValue, { ring: string; bar: string; text: string }> = {
  1: { ring: 'ring-neural-magenta-400', bar: 'bg-neural-magenta-500', text: 'text-neural-magenta-700' },
  2: { ring: 'ring-brand-orange-400',   bar: 'bg-brand-orange-500',   text: 'text-brand-orange-700' },
  3: { ring: 'ring-slate-400',          bar: 'bg-slate-500',          text: 'text-slate-700' },
  4: { ring: 'ring-brand-teal-400',     bar: 'bg-brand-teal-500',     text: 'text-brand-teal-700' },
  5: { ring: 'ring-memory-emerald-400', bar: 'bg-memory-emerald-500', text: 'text-memory-emerald-700' },
};

interface EnergyLevelSelectorProps {
  value?: EnergyValue;
  onChange: (value: EnergyValue) => void;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Five vertical-bar energy indicators (battery-style) — refined, no emoji.
 */
export function EnergyLevelSelector({ value, onChange, disabled, compact, className }: EnergyLevelSelectorProps) {
  const levels: EnergyValue[] = [1, 2, 3, 4, 5];

  return (
    <div className={cn('flex items-end justify-center', compact ? 'gap-1.5' : 'gap-2', className)}>
      {levels.map((level) => {
        const active = value === level;
        const tone = TONES[level];
        return (
          <button
            key={level}
            type="button"
            disabled={disabled}
            onClick={() => onChange(level)}
            aria-pressed={active}
            aria-label={`${LABELS[level]} energy`}
            className={cn(
              'group flex flex-col items-center gap-2 rounded-xl border border-border bg-card transition-all duration-200',
              compact ? 'p-2 min-w-[44px]' : 'p-3 min-w-[60px]',
              'hover:border-foreground/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              active && cn('ring-2 ring-offset-2 shadow-sm', tone.ring),
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            <div className={cn('flex items-end gap-[2px]', compact ? 'h-6' : 'h-8')}>
              {levels.map((bar) => (
                <span
                  key={bar}
                  className={cn(
                    'w-1 rounded-sm transition-colors',
                    bar <= level
                      ? active
                        ? tone.bar
                        : 'bg-muted-foreground/40 group-hover:bg-foreground/50'
                      : 'bg-muted',
                  )}
                  style={{ height: `${20 + bar * 12}%` }}
                />
              ))}
            </div>
            <span className={cn('text-[10px] font-semibold uppercase tracking-wider', active ? tone.text : 'text-muted-foreground')}>
              {compact ? level : LABELS[level]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
