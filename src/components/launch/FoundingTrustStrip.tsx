import React from 'react';
import { EditionBadge } from '@/components/launch/EditionBadge';

export function FoundingTrustStrip() {
  const claims = [
    '50% off for life for founding members',
    'Funds founder-led development',
    'No card required to start',
    'Your data stays yours',
  ];

  return (
    <div className="flex justify-center mb-10">
      <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border border-brain-health-200/60 bg-white/70 backdrop-blur-sm px-5 py-2.5 shadow-sm text-sm text-brain-health-700">
        <EditionBadge variant="chip" />
        {claims.map((claim, i) => (
          <React.Fragment key={claim}>
            <span className="text-brain-health-300" aria-hidden>·</span>
            <span className={i === 0 ? 'font-semibold text-brand-orange-500' : ''}>
              {claim}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
