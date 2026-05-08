import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: 'left' | 'center';
  className?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({ eyebrow, title, lede, align = 'left', className, actions }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className={cn(align === 'center' && 'mx-auto text-center')}>
        {eyebrow && (
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500 mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl md:text-[28px] leading-tight font-semibold text-brain-health-900">
          {title}
        </h2>
        {lede && (
          <p className="mt-2 text-sm md:text-base text-brain-health-600 max-w-2xl">
            {lede}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
