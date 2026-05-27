import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type CaptureStatus = 'queued' | 'awaiting' | 'accepted' | 'declined';

interface Props {
  status: CaptureStatus;
  className?: string;
}

const STATUS_MAP: Record<CaptureStatus, { color: string; label: string }> = {
  queued:   { color: 'bg-brain-health-300',     label: 'Queued — will sync when online' },
  awaiting: { color: 'bg-brand-orange-400',     label: 'Awaiting your review' },
  accepted: { color: 'bg-memory-emerald-500',   label: 'Accepted' },
  declined: { color: 'bg-brain-health-200 opacity-60', label: 'Declined' },
};

/**
 * Single coloured dot per capture. No nagging, no badges-of-shame.
 */
export function CaptureStatusDot({ status, className = '' }: Props) {
  const meta = STATUS_MAP[status];
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-block h-2 w-2 rounded-full ${meta.color} ${className}`}
            aria-label={meta.label}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {meta.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
