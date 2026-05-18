import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  text?: string;
  className?: string;
}

export function PersonaLensChip({ text, className }: Props) {
  if (!text) return null;
  return (
    <div
      className={cn(
        'mt-4 inline-flex items-start gap-2 rounded-xl border border-brain-health-100 bg-white/80 px-3 py-2 text-xs text-brain-health-700',
        className
      )}
    >
      <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0 text-brand-teal-600" strokeWidth={1.75} />
      <span className="leading-snug">{text}</span>
    </div>
  );
}
