import React from 'react';
import { GROWTH_STATES, TONE_CLASSES, type GrowthLetter } from './states';
import { cn } from '@/lib/utils';

interface GrowthStatePickerProps {
  value?: GrowthLetter | null;
  onSelect: (letter: GrowthLetter) => void;
  disabled?: boolean;
}

/** 4×2 grid picker. 56px+ tap targets. One-tap primary action. */
export function GrowthStatePicker({ value, onSelect, disabled }: GrowthStatePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Where are you in your rhythm today?"
      className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
    >
      {GROWTH_STATES.map((s) => {
        const tone = TONE_CLASSES[s.tone];
        const active = value === s.key;
        return (
          <button
            key={s.key}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onSelect(s.key)}
            className={cn(
              'min-h-[64px] rounded-2xl px-3 py-2.5 text-left ring-1 transition-all',
              'flex items-start gap-2.5',
              tone.bg, tone.ring,
              active && `${tone.activeBg} ring-2 shadow-sm`,
              !active && 'hover:shadow-sm',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
          >
            <span
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base',
                'bg-white/70', tone.text
              )}
              aria-hidden
            >
              {s.letter}
            </span>
            <span className="min-w-0">
              <span className={cn('block text-[13px] font-semibold leading-tight', tone.text)}>
                {s.name}
              </span>
              <span className="block text-[11px] text-brain-health-600/80 leading-snug mt-0.5">
                {s.prompt}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
