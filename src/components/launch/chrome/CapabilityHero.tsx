import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { IconBadge } from './IconBadge';
import { StatusPill } from './StatusPill';
import { cn } from '@/lib/utils';

type Tone = 'teal' | 'emerald' | 'orange' | 'purple' | 'neutral';

interface MetaPill {
  label: string;
  tone?: 'neutral' | 'success' | 'attention' | 'info';
}

interface CapabilityHeroProps {
  eyebrow: string;
  title: string;
  lede?: string;
  icon: LucideIcon;
  tone?: Tone;
  meta?: MetaPill[];
  className?: string;
}

export function CapabilityHero({
  eyebrow,
  title,
  lede,
  icon,
  tone = 'teal',
  meta,
  className,
}: CapabilityHeroProps) {
  return (
    <header className={cn('flex flex-col gap-5', className)}>
      <div className="flex items-start gap-4">
        <IconBadge icon={icon} tone={tone} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-3xl md:text-4xl leading-[1.1] font-semibold text-brain-health-900 tracking-tight">
            {title}
          </h1>
          {lede && (
            <p className="mt-3 text-base md:text-lg text-brain-health-600 max-w-2xl leading-relaxed">
              {lede}
            </p>
          )}
        </div>
      </div>
      {meta && meta.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-0 md:pl-16">
          {meta.map((m) => (
            <StatusPill key={m.label} tone={m.tone ?? 'neutral'}>
              {m.label}
            </StatusPill>
          ))}
        </div>
      )}
    </header>
  );
}
