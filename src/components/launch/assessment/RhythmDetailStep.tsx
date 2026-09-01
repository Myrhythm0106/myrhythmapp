import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RhythmDetailRow } from '@/data/launchAssessmentBanks';

interface RhythmDetailStepProps {
  rows: RhythmDetailRow[];
  values: Record<string, string>;
  onSelect: (rowId: string, value: string) => void;
}

/**
 * The compact two-row rhythm step. Not scored — it feeds "My Best Window",
 * which the calendar uses as advice, never as a gate.
 */
export function RhythmDetailStep({ rows, values, onSelect }: RhythmDetailStepProps) {
  return (
    <div className="space-y-6 pb-4">
      {rows.map((row) => (
        <fieldset key={row.id} className="space-y-2">
          <legend className="text-sm font-semibold text-launch-ink mb-2">{row.label}</legend>
          {row.options.map((opt) => {
            const selected = values[row.id] === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSelect(row.id, opt.value)}
                aria-pressed={selected}
                className={cn(
                  'w-full p-3.5 rounded-2xl border-2 text-left transition-all min-h-[56px] flex items-center gap-3',
                  selected
                    ? 'border-launch-ember bg-launch-ember/10 ring-2 ring-launch-ember/20'
                    : 'border-launch-gold/30 bg-launch-ivory hover:border-launch-moss'
                )}
              >
                <span
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                    selected ? 'border-launch-ember bg-launch-ember' : 'border-launch-ink/20'
                  )}
                >
                  {selected && <Check className="h-4 w-4 text-white" />}
                </span>
                <span className="font-semibold text-launch-ink">{opt.label}</span>
              </button>
            );
          })}
        </fieldset>
      ))}

      <p className="text-xs text-launch-ink/55 leading-relaxed">
        This shapes suggestions only. I can always pick any time I like — other people's
        availability and real deadlines still come first.
      </p>
    </div>
  );
}
