import React, { useState } from 'react';
import { Compass, Check } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useStage } from './useStage';
import { stages, type Stage } from './stages';
import { usePersona } from '@/launch/persona/usePersona';
import { cn } from '@/lib/utils';

export function StagePicker() {
  const [open, setOpen] = useState(false);
  const { stage, setStage, markEngaged } = useStage();
  const { persona } = usePersona();
  const showAnchors = persona === 'recovery';

  const handlePick = (next: Stage) => {
    markEngaged();
    setStage(next);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (v) markEngaged(); }}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-brain-health-500 hover:text-brain-health-700 transition-colors"
        >
          <Compass className="h-3.5 w-3.5" strokeWidth={1.75} />
          Where am I in my rhythm?
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your rhythm, your pace</SheetTitle>
          <SheetDescription>
            Move freely between stages. No targets, no countdowns — just a way to say where you are.
          </SheetDescription>
        </SheetHeader>

        <ul className="mt-6 space-y-2">
          {stages.map((s) => {
            const active = s.id === stage;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => handlePick(s.id)}
                  className={cn(
                    'w-full text-left rounded-2xl border p-4 transition-colors min-h-[56px]',
                    active
                      ? 'border-brand-teal-400 bg-brand-teal-50/60'
                      : 'border-brain-health-100 bg-white hover:bg-brain-health-50/60'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brain-health-900">
                        {s.label}
                      </p>
                      <p className="mt-1 text-sm text-brain-health-700 leading-snug">
                        {s.lensByPersona[persona]}
                      </p>
                      {showAnchors && (
                        <p className="mt-1.5 text-[11px] text-brain-health-400">
                          {s.recoveryAnchor}
                        </p>
                      )}
                    </div>
                    {active && (
                      <Check className="h-4 w-4 mt-1 shrink-0 text-brand-teal-600" strokeWidth={2} />
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-[11px] leading-relaxed text-brain-health-400">
          Stages are a guide, not a prescription. MyRhythm does not diagnose, treat, or replace clinical care.
        </p>
      </SheetContent>
    </Sheet>
  );
}
