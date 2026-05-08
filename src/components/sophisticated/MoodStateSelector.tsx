import React from 'react';
import { Zap, TrendingUp, Minus, TrendingDown, CloudRain, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MoodValue = 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';

interface MoodOption {
  value: MoodValue;
  label: string;
  icon: LucideIcon;
  ring: string;
  fill: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { value: 'excellent',   label: 'Excellent',   icon: Zap,           ring: 'ring-memory-emerald-400',  fill: 'text-memory-emerald-600 bg-memory-emerald-50' },
  { value: 'good',        label: 'Good',        icon: TrendingUp,    ring: 'ring-brand-teal-400',      fill: 'text-brand-teal-600 bg-brand-teal-50' },
  { value: 'neutral',     label: 'Neutral',     icon: Minus,         ring: 'ring-slate-400',           fill: 'text-slate-600 bg-slate-50' },
  { value: 'challenging', label: 'Challenging', icon: TrendingDown,  ring: 'ring-brand-orange-400',    fill: 'text-brand-orange-600 bg-brand-orange-50' },
  { value: 'difficult',   label: 'Difficult',   icon: CloudRain,     ring: 'ring-neural-magenta-400',  fill: 'text-neural-magenta-600 bg-neural-magenta-50' },
];

interface MoodStateSelectorProps {
  value?: MoodValue | null;
  onChange: (value: MoodValue) => void;
  options?: MoodOption[];
  className?: string;
}

export function MoodStateSelector({ value, onChange, options = MOOD_OPTIONS, className }: MoodStateSelectorProps) {
  return (
    <div className={cn('grid gap-3', `grid-cols-${options.length}`, className)} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            aria-label={opt.label}
            className={cn(
              'group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all duration-200',
              'hover:border-foreground/20 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              active && cn('ring-2 ring-offset-2 shadow-sm', opt.ring),
            )}
          >
            <span
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                active ? opt.fill : 'bg-muted text-muted-foreground group-hover:bg-accent',
              )}
            >
              <Icon strokeWidth={1.75} className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-foreground">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export const MOOD_VALUES: MoodValue[] = MOOD_OPTIONS.map((m) => m.value);
