import React from 'react';
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  text: string;
  className?: string;
}

export function BrainHealthLensChip({ text, className }: Props) {
  return (
    <div className={cn(
      'inline-flex items-start gap-2 rounded-2xl bg-brain-health-50/80 border border-brain-health-100 px-3 py-2 text-xs text-brain-health-800',
      className
    )}>
      <Brain className="h-3.5 w-3.5 mt-0.5 shrink-0 text-brain-health-600" />
      <span><span className="font-semibold">Why this matters for you:</span> {text}</span>
    </div>
  );
}
