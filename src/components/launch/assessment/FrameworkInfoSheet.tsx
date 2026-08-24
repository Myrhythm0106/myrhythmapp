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
import {
  MYRHYTHM_LETTERS,
  FRAMEWORK_BASIS,
  FRAMEWORK_DISCLAIMER,
} from '@/launch/framework/myrhythm';

/**
 * The framework explainer — the single surface where MYRHYTHM's evidence basis is described.
 * Content comes from the canonical definition in src/launch/framework/myrhythm.ts.
 * No named individual or third-party programme is cited in-app (see docs/framework-evidence.md).
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

        <p className="text-sm text-launch-ink/80">{FRAMEWORK_BASIS}</p>

        <ul className="space-y-3 mt-1">
          {MYRHYTHM_LETTERS.map((l) => (
            <li key={l.id} className="flex gap-3">
              <span className="w-7 h-7 shrink-0 rounded-full bg-launch-ember/10 text-launch-ember font-bold text-sm flex items-center justify-center">
                {l.letter}
              </span>
              <div>
                <p className="font-semibold text-launch-ink text-sm">{l.word}</p>
                <p className="text-sm text-launch-ink/65">{l.meaning}</p>
                <p className="text-[11px] text-launch-ink/45 mt-0.5">
                  Anchored to: {l.evidence}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-[11px] leading-relaxed text-launch-ink/50 border-t border-launch-gold/30 pt-3 mt-1">
          {FRAMEWORK_DISCLAIMER}
        </p>
      </DialogContent>
    </Dialog>
  );
}
