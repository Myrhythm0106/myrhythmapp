import React from 'react';
import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStage } from './useStage';
import { usePersona } from '@/launch/persona/usePersona';

interface Props {
  className?: string;
}

/**
 * Small contextual chip surfacing the active rhythm stage and its persona-tuned lens.
 * Hidden until the user has opened the picker at least once, so it never feels like a nag.
 */
export function StageLensChip({ className }: Props) {
  const { stage, stageData, hasEngaged } = useStage();
  const { persona } = usePersona();
  if (!hasEngaged) return null;
  const lens = stageData.lensByPersona[persona];

  return (
    <div
      className={cn(
        'mt-4 inline-flex items-start gap-2 rounded-xl border border-brain-health-100 bg-white/80 px-3 py-2 text-xs text-brain-health-700',
        className
      )}
      aria-label={`Current stage: ${stageData.label}`}
    >
      <Compass className="h-3.5 w-3.5 mt-0.5 shrink-0 text-brand-teal-600" strokeWidth={1.75} />
      <span className="leading-snug">
        <span className="font-semibold text-brain-health-900">Stage: {stageData.label}</span>
        <span className="text-brain-health-400"> · </span>
        <span>{lens}</span>
      </span>
    </div>
  );
}
