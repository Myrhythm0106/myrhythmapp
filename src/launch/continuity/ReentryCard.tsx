import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sunrise, X } from 'lucide-react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { useContinuityThread } from './useContinuityThread';
import { detectReentry } from './reentryDetector';

interface Props {
  className?: string;
  missedAnchorTitle?: string | null;
}

export function ReentryCard({ className, missedAnchorTitle = null }: Props) {
  const navigate = useNavigate();
  const { latest, daysSinceLastActivity, loading, recordSnapshot } = useContinuityThread();
  const [dismissed, setDismissed] = React.useState(false);

  if (loading || dismissed) return null;

  const decision = detectReentry({
    latestThread: latest,
    daysSinceLastActivity,
    missedAnchorTitle,
  });

  if (decision.kind === 'none') return null;

  const handleAccept = () => {
    recordSnapshot({ note: `Re-entry accepted (${decision.kind})` });
    if (decision.ctaHref) navigate(decision.ctaHref);
  };

  const handleSkip = () => {
    recordSnapshot({ note: 'Re-entry skipped' });
    setDismissed(true);
  };

  return (
    <LaunchCard className={className}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
          <Sunrise className="h-5 w-5 text-orange-600" strokeWidth={1.75} />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900">{decision.title}</h3>
            <button
              type="button"
              onClick={handleSkip}
              aria-label="Skip re-entry"
              className="text-gray-400 hover:text-gray-600 -mt-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">{decision.body}</p>
          <div className="mt-3 flex items-center gap-2">
            <LaunchButton onClick={handleAccept} className="min-h-[44px]">
              {decision.ctaLabel}
            </LaunchButton>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-gray-500 underline-offset-2 hover:underline px-2"
            >
              Not today
            </button>
          </div>
          <p className="text-[11px] text-gray-500 italic mt-3">
            MyRhythm doesn't penalise gaps. It just helps you start small again.
          </p>
        </div>
      </div>
    </LaunchCard>
  );
}
