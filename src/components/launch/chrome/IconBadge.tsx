import React from 'react';
import { cn } from '@/lib/utils';

type Tone = 'teal' | 'emerald' | 'orange' | 'purple' | 'neutral';

interface IconBadgeProps {
  icon: LucideIcon;
  tone?: Tone;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  teal: 'bg-clarity-teal-50 text-clarity-teal-700 ring-clarity-teal-100',
  emerald: 'bg-memory-emerald-50 text-memory-emerald-700 ring-memory-emerald-100',
  orange: 'bg-brand-orange-50 text-brand-orange-700 ring-brand-orange-100',
  purple: 'bg-neural-purple-50 text-neural-purple-700 ring-neural-purple-100',
  neutral: 'bg-brain-health-50 text-brain-health-700 ring-brain-health-100',
};

const sizes = {
  sm: 'h-8 w-8 rounded-lg [&>svg]:h-4 [&>svg]:w-4',
  md: 'h-10 w-10 rounded-xl [&>svg]:h-5 [&>svg]:w-5',
  lg: 'h-12 w-12 rounded-2xl [&>svg]:h-6 [&>svg]:w-6',
};

export function IconBadge({ icon: Icon, tone = 'teal', size = 'md', className }: IconBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center ring-1',
      toneClasses[tone],
      sizes[size],
      className
    )}>
      <Icon strokeWidth={1.75} />
    </span>
  );
}
