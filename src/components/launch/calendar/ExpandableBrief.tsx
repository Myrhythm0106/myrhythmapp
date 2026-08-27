import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExpandableBriefProps {
  text: string | null | undefined;
  previewLines?: number;
  className?: string;
  textClassName?: string;
}

export function ExpandableBrief({
  text,
  previewLines = 3,
  className,
  textClassName,
}: ExpandableBriefProps) {
  const [expanded, setExpanded] = useState(false);

  if (!text || !text.trim()) return null;

  const lineClampClass = previewLines === 2 ? 'line-clamp-2' : previewLines === 3 ? 'line-clamp-3' : 'line-clamp-3';

  return (
    <div className={cn('space-y-1', className)}>
      <p
        className={cn(
          'text-sm text-launch-ink/80 whitespace-pre-wrap',
          !expanded && lineClampClass,
          textClassName
        )}
      >
        {text.trim()}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-xs font-medium text-brand-emerald-600 hover:text-brand-emerald-700 transition-colors min-h-[28px] px-1 -ml-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald-300"
        aria-expanded={expanded}
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </div>
  );
}
