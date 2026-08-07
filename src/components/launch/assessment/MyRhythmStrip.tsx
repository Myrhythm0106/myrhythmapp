import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssessmentQuestion } from '@/data/launchAssessmentBanks';

interface MyRhythmStripProps {
  questions: AssessmentQuestion[];
  currentIndex: number;
  answeredIds: Set<string>;
  onJump?: (index: number) => void;
}

/**
 * The MYRHYTHM letter strip — shows all 8 letters, where you are, and what's done.
 * Questions that share a letter slot (e.g. the follow-through probe under T)
 * collapse into the same chip.
 */
export function MyRhythmStrip({ questions, currentIndex, answeredIds, onJump }: MyRhythmStripProps) {
  const slots: { key: string; letter: string; word: string; indices: number[] }[] = [];
  questions.forEach((q, i) => {
    const key = q.slot ?? q.id;
    const existing = slots.find((s) => s.key === key);
    if (existing) existing.indices.push(i);
    else slots.push({ key, letter: q.letter, word: q.word, indices: [i] });
  });

  const currentSlot = slots.find((s) => s.indices.includes(currentIndex));

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between gap-1">
        {slots.map((slot) => {
          const isCurrent = slot === currentSlot;
          const done = slot.indices.every((i) => answeredIds.has(questions[i].id));
          const reachable = slot.indices.some((i) => i < currentIndex || answeredIds.has(questions[i].id));
          const target = slot.indices[0];
          return (
            <button
              key={slot.key}
              type="button"
              disabled={!reachable || !onJump}
              onClick={() => reachable && onJump?.(target)}
              aria-label={`${slot.letter} — ${slot.word}${done ? ' (answered)' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'relative flex-1 h-10 rounded-lg text-sm font-bold uppercase tracking-wide transition-all',
                isCurrent
                  ? 'bg-launch-ember text-launch-cream scale-110 shadow-sm'
                  : done
                    ? 'bg-launch-moss/20 text-launch-moss'
                    : 'bg-launch-ink/5 text-launch-ink/35',
                reachable && !isCurrent && 'hover:bg-launch-moss/30 cursor-pointer'
              )}
            >
              {slot.letter}
              {done && !isCurrent && (
                <Check className="h-3 w-3 absolute top-0.5 right-0.5 text-launch-moss" />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-launch-ink/60 mt-2 text-center">
        {currentSlot ? (
          <>
            <span className="font-semibold text-launch-ink">{currentSlot.letter}</span> is for{' '}
            <span className="font-semibold text-launch-ink">{currentSlot.word}</span> · step{' '}
            {currentIndex + 1} of {questions.length}
          </>
        ) : (
          <>Step {currentIndex + 1} of {questions.length}</>
        )}
      </p>
    </div>
  );
}
