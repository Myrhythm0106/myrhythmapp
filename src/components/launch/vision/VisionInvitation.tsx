import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { readLocalFocusValue, writeLocalFocusValue } from '@/hooks/useLaunchFocusDisplay';

/** Offered after a first capture, never required and always available later from Vision. */
export function VisionInvitation({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const key = `launch.vision-invitation-dismissed:${userId}`;
  const [dismissed, setDismissed] = React.useState(() => readLocalFocusValue<unknown>(key, false) === true);
  if (dismissed) return null;

  return (
    <section aria-labelledby="vision-invitation-title" className="rounded-3xl border border-launch-teal/25 bg-launch-teal/5 p-5 sm:p-6">
      <Compass className="h-6 w-6 text-launch-teal" aria-hidden="true" />
      <h2 id="vision-invitation-title" className="mt-3 font-instrument text-2xl text-launch-ink">What would a good life look like for me?</h2>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-launch-ink/75">
        A few words about home, family or work is enough. I can include a target from my care team too. This is optional, and I can come back to it at any time.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => navigate('/launch/vision-statement')} className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-launch-teal px-5 font-semibold text-primary-foreground">
          Write my vision<ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => { writeLocalFocusValue(key, true); setDismissed(true); }}
          className="min-h-[56px] rounded-2xl border border-launch-teal/25 px-5 font-semibold text-launch-ink"
        >
          Not now
        </button>
      </div>
    </section>
  );
}
