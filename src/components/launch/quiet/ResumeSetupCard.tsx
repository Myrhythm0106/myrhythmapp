import React from 'react';
import { ArrowRight, BookmarkCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ResumeStep } from '@/launch/onboarding/resumePoint';

/** A single calm route back into unfinished set-up. */
export function ResumeSetupCard({ step }: { step: ResumeStep }) {
  const navigate = useNavigate();
  return (
    <section aria-labelledby="resume-setup-title" className="rounded-3xl border border-launch-teal/25 bg-launch-ivory p-5 shadow-[0_18px_44px_-34px_hsl(var(--launch-ink-deep)/0.4)] sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-launch-teal/10 text-launch-teal">
          <BookmarkCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-launch-moss">Pick up where I left off</p>
          <h2 id="resume-setup-title" className="mt-1 font-instrument text-2xl text-launch-ink">{step.title}</h2>
          <p className="mt-2 text-base leading-relaxed text-launch-ink/70">{step.description}</p>
          <button
            type="button"
            onClick={() => navigate(step.path)}
            className="mt-4 inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-brand-orange-500 px-5 font-semibold text-primary-foreground"
          >
            {step.button}<ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
