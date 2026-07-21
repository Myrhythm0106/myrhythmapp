import React from 'react';
import { cn } from '@/lib/utils';

interface LaunchHeroBandProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  showContours?: boolean;
  align?: 'left' | 'center';
}

const INK = '#064e3b';
const GOLD = '#c9a84c';

export function LaunchHeroBand({
  eyebrow,
  title,
  subtitle,
  children,
  className,
  showContours = true,
  align = 'left',
}: LaunchHeroBandProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-launch-ink px-4 md:px-8 py-8 md:py-10',
        // Break out of any constrained parent (LaunchLayout's max-w-7xl wrapper, etc.)
        'w-screen relative left-1/2 right-1/2 -translate-x-1/2',
        className
      )}
    >
      {showContours && (
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          viewBox="0 0 800 400"
          fill="none"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path d="M-50 320C100 270 200 370 400 320C600 270 700 370 850 320" stroke={GOLD} strokeWidth="2" />
          <path d="M-50 260C100 210 200 310 400 260C600 210 700 310 850 260" stroke={GOLD} strokeWidth="1.5" />
          <path d="M-50 200C100 150 200 250 400 200C600 150 700 250 850 200" stroke={GOLD} strokeWidth="1" />
          <path d="M-50 140C100 90 200 190 400 140C600 90 700 190 850 140" stroke={GOLD} strokeWidth="0.75" />
          <path d="M-50 80C100 30 200 130 400 80C600 30 700 130 850 80" stroke={GOLD} strokeWidth="0.5" />
        </svg>
      )}

      <div
        className={cn(
          'relative z-10 max-w-7xl mx-auto flex flex-col gap-3',
          align === 'center' && 'items-center text-center'
        )}
      >
        {eyebrow && (
          <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-launch-gold">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-semibold text-white font-display tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        <div
          className={cn(
            'mt-3 h-px bg-launch-gold/60',
            align === 'center' ? 'w-16' : 'w-12'
          )}
        />
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

