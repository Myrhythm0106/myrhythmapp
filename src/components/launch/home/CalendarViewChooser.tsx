import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const VIEWS = [
  { key: 'day', label: 'Day', to: '/launch/calendar?view=day' },
  { key: 'week', label: 'Week', to: '/launch/calendar?view=week' },
  { key: 'month', label: 'Month', to: '/launch/calendar?view=month' },
  { key: 'year', label: 'Year', to: '/launch/calendar?view=year' },
  { key: 'vision', label: 'Vision', to: '/launch/vision-statement' },
] as const;

/** Day · Week · Month · Year · Vision — one tap into the full view. */
export function CalendarViewChooser({ active, onPick, className }: { active?: string; onPick?: (key: string) => boolean | void; className?: string }) {
  const navigate = useNavigate();
  return (
    <nav aria-label="Calendar views" className={cn('flex flex-wrap items-center gap-1', className)}>
      {VIEWS.map(v => (
        <button key={v.key} type="button" aria-current={active === v.key ? 'page' : undefined}
          onClick={() => { if (onPick?.(v.key) === true) return; navigate(v.to); }}
          className={cn('min-h-[44px] rounded-full px-3 text-sm transition',
            active === v.key ? 'bg-launch-ink text-primary-foreground' : 'text-launch-ink/70 hover:bg-launch-cream hover:text-launch-ink')}>
          {v.label}
        </button>
      ))}
    </nav>
  );
}
