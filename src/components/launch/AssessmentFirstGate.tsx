import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import {
  hasCompletedAssessment,
  hasLocalAssessment,
  isAssessmentDeferred,
} from '@/launch/onboarding/nextDestination';

/**
 * The brain health questions come first. Anyone who has never answered them
 * is taken there before Home — unless they chose "Not now" today.
 */
export function AssessmentFirstGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'allow' | 'redirect'>(() =>
    hasLocalAssessment() || isAssessmentDeferred() ? 'allow' : 'checking'
  );

  useEffect(() => {
    if (status !== 'checking') return;
    let active = true;
    hasCompletedAssessment()
      .then((done) => {
        if (!active) return;
        setStatus(done ? 'allow' : 'redirect');
      })
      .catch(() => active && setStatus('allow'));
    return () => {
      active = false;
    };
  }, [status]);

  if (status === 'checking') {
    return (
      <div className="min-h-[60svh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-launch-ink/50" />
      </div>
    );
  }

  if (status === 'redirect') {
    return <Navigate to="/launch/assessment?first=1" replace />;
  }

  return <>{children}</>;
}
