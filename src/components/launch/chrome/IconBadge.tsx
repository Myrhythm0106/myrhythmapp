import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tone = 'teal' | 'emerald' | 'orange' | 'purple' | 'neutral';

interface IconBadgeProps {
  icon: LucideIcon;
  tone?: Tone;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  teal: 'bg-launch-gold/10 text-launch-gold ring-launch-gold/30',
  emerald: 'bg-launch-gold/10 text-launch-gold ring-launch-gold/30',
  orange: 'bg-launch-ember/10 text-launch-ember ring-launch-ember/30',
  purple: 'bg-launch-gold/10 text-launch-gold ring-launch-gold/30',
  neutral: 'bg-launch-ink/5 text-launch-ink ring-launch-ink/10',
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
