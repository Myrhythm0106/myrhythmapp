import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface StepLocatorItem {
  /** Short label shown under the dot on desktop */
  label: string;
  /** Optional route to jump to when clicked. If omitted the dot is not clickable. */
  path?: string;
}

interface LaunchStepLocatorProps {
  steps: StepLocatorItem[];
  /** Zero-based current step index */
  currentIndex: number;
  className?: string;
  /** Optional aria-label; defaults to "Progress" */
  ariaLabel?: string;
}

/**
 * Shared "you-are-here" step-dot locator used across onboarding and the 4C loop.
 *
 * - role="progressbar" with aria-valuenow / aria-valuemax
 * - min 24px tap target, 12px+ spacing (see mem://ux/inclusive-design-first)
 * - Completed steps are clickable to jump back
 * - Current step is emphasised with the brand-orange ring
 */
export function LaunchStepLocator({
  steps,
  currentIndex,
  className,
  ariaLabel = 'Progress',
}: LaunchStepLocatorProps) {
  const navigate = useNavigate();
  const total = steps.length;

  if (total === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={currentIndex + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      className={cn(
        'flex items-center justify-center gap-3 py-2 select-none',
        className
      )}
    >
      {steps.map((step, idx) => {
        const isCurrent = idx === currentIndex;
        const isComplete = idx < currentIndex;
        const clickable = Boolean(step.path) && (isComplete || isCurrent);

        return (
          <button
            key={step.label + idx}
            type="button"
            disabled={!clickable}
            onClick={() => step.path && navigate(step.path)}
            aria-current={isCurrent ? 'step' : undefined}
            aria-label={
              `${step.label} — step ${idx + 1} of ${total}` +
              (isCurrent ? ' (current)' : isComplete ? ' (completed)' : '')
            }
            className={cn(
              'flex flex-col items-center gap-1 group',
              'min-h-[44px] min-w-[44px] px-1',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-500 rounded-lg',
              !clickable && 'cursor-default'
            )}
          >
            <span
              className={cn(
                'inline-block rounded-full transition-all',
                'h-3 w-3',
                isCurrent && 'h-4 w-4 ring-2 ring-offset-2 ring-brand-orange-500 bg-brand-orange-500',
                !isCurrent && isComplete && 'bg-brand-teal-500',
                !isCurrent && !isComplete && 'bg-brain-health-200'
              )}
            />
            <span
              className={cn(
                'text-[11px] leading-tight font-medium',
                isCurrent ? 'text-brand-orange-700' : 'text-brain-health-600',
                'hidden sm:inline'
              )}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default LaunchStepLocator;
