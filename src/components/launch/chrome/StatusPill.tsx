import React from 'react';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'success' | 'attention' | 'info';

interface StatusPillProps {
  tone?: Tone;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-brain-health-50 text-brain-health-700 border-brain-health-100',
  success: 'bg-memory-emerald-50 text-memory-emerald-700 border-memory-emerald-100',
  attention: 'bg-brand-orange-50 text-brand-orange-700 border-brand-orange-100',
  info: 'bg-clarity-teal-50 text-clarity-teal-700 border-clarity-teal-100',
};

export function StatusPill({ tone = 'neutral', children, icon: Icon, className }: StatusPillProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide',
      toneClasses[tone],
      className
    )}>
      {Icon && <Icon className="h-3 w-3" strokeWidth={1.75} />}
      {children}
    </span>
  );
}
