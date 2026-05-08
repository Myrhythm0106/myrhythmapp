import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; direction: 'up' | 'down' | 'flat' };
  caption?: string;
  className?: string;
  children?: React.ReactNode;
}

export function KpiCard({ label, value, delta, caption, className, children }: KpiCardProps) {
  const DeltaIcon = delta?.direction === 'up' ? ArrowUpRight : delta?.direction === 'down' ? ArrowDownRight : Minus;
  const deltaTone =
    delta?.direction === 'up'
      ? 'text-memory-emerald-700'
      : delta?.direction === 'down'
      ? 'text-brand-orange-700'
      : 'text-brain-health-500';

  return (
    <div className={cn('rounded-2xl bg-white border border-brain-health-100 p-5', className)}>
      <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brain-health-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-brain-health-900 tabular-nums">{value}</span>
        {delta && (
          <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', deltaTone)}>
            <DeltaIcon className="h-3.5 w-3.5" strokeWidth={2} />
            {delta.value}
          </span>
        )}
      </div>
      {caption && <p className="mt-1 text-xs text-brain-health-500">{caption}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
