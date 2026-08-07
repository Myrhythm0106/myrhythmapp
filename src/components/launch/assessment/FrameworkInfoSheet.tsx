import React, { useState } from 'react';
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const LETTERS: { letter: string; word: string; line: string }[] = [
  { letter: 'M', word: 'Mindset', line: 'How you talk to yourself about your own mind sets the tone for everything after it.' },
  { letter: 'Y', word: 'Yes to Reality', line: 'An honest starting point beats an optimistic one. We plan from where you actually are.' },
  { letter: 'R', word: 'Rhythm', line: 'Attention rises and falls through the day. Important things belong in your clearest window.' },
  { letter: 'H', word: 'Harness Support', line: 'People who know your plan make it far more likely to happen.' },
  { letter: 'Y', word: 'Your Victories', line: 'Noticing what went well is how momentum is built and kept.' },
  { letter: 'T', word: 'Transform', line: 'Shrink the friction. Fewer things to hold in your head, more things that happen.' },
  { letter: 'H', word: 'Heal', line: 'Sleep, movement, food and rest are the quiet infrastructure of a good day.' },
  { letter: 'M', word: 'Meaning', line: 'A reason that matters to you is what keeps a plan going when motivation dips.' },
];

/**
 * Brief, engaging explainer of the MYRHYTHM framework.
 * Inspired by widely published brain-health principles (Dr Daniel Amen's work on
 * lifestyle, mindset and daily habits; Dr Caroline Leaf on directed thinking),
 * kept deliberately non-clinical — no diagnosis, no treatment claims.
 */
export function FrameworkInfoSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-launch-moss hover:text-launch-ember transition-colors min-h-[36px] px-2 -ml-2 rounded-full"
        >
          <Info className="h-4 w-4" />
          What is MYRHYTHM?
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-launch-cream border-launch-gold/30">
        <DialogHeader>
          <DialogTitle className="font-display text-launch-ink">The MYRHYTHM framework</DialogTitle>
          <DialogDescription className="text-launch-ink/70">
            Eight everyday levers that shape how a day actually goes. One letter, one question.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-launch-ink/80">
          The framework draws on a simple, well-supported idea in brain health: the everyday things
          you repeat — how you think about yourself, when you do hard things, who is around you,
          how you rest — shape how life feels far more than any single big decision does.
          MyRhythm turns those levers into a plan you can actually follow.
        </p>

        <ul className="space-y-2.5 mt-1">
          {LETTERS.map((l, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-7 h-7 shrink-0 rounded-full bg-launch-ember/10 text-launch-ember font-bold text-sm flex items-center justify-center">
                {l.letter}
              </span>
              <div>
                <p className="font-semibold text-launch-ink text-sm">{l.word}</p>
                <p className="text-sm text-launch-ink/65">{l.line}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-[11px] leading-relaxed text-launch-ink/50 border-t border-launch-gold/30 pt-3 mt-1">
          MyRhythm is a planning and follow-through companion. It does not diagnose, treat or fix
          any condition, and it is not a substitute for medical or rehabilitation advice.
        </p>
      </DialogContent>
    </Dialog>
  );
}
