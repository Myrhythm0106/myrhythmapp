import React from 'react';
import { Sparkles } from 'lucide-react';
import { EDITION_SHORT, EDITION_VERSION, EDITION_NAME } from '@/config/edition';

type Variant = 'chip' | 'inline' | 'footer';

interface EditionBadgeProps {
  variant?: Variant;
  className?: string;
}

export function EditionBadge({ variant = 'chip', className = '' }: EditionBadgeProps) {
  if (variant === 'footer') {
    return (
      <span
        className={`text-[10px] tracking-[0.18em] uppercase text-stone-400 ${className}`}
        aria-label={`${EDITION_NAME} ${EDITION_VERSION}`}
      >
        {EDITION_NAME} · {EDITION_VERSION}
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <span
        className={`text-[10px] tracking-[0.22em] uppercase text-teal-700 font-medium ${className}`}
        aria-label={`${EDITION_NAME} ${EDITION_VERSION}`}
      >
        {EDITION_SHORT} · {EDITION_VERSION}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] uppercase text-teal-700 ${className}`}
      aria-label={`${EDITION_NAME} ${EDITION_VERSION}`}
      title={EDITION_NAME}
    >
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      {EDITION_SHORT} · {EDITION_VERSION}
    </span>
  );
}
