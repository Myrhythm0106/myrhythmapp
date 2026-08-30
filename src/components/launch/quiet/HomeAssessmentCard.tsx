import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, RotateCcw } from 'lucide-react';
import { listAssessmentRuns, type StoredAssessmentRun } from '@/launch/assessment/assessmentHistory';

const PROGRESS_KEY = 'myrhythm_assessment_progress';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso.slice(0, 10);
  }
}

/**
 * Home entry point for the MYRHYTHM Brain Health Assessment.
 * First-timers get one clear invitation; returning users see their last
 * snapshot with a Retake action. One card, one action.
 */
export function HomeAssessmentCard() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<StoredAssessmentRun[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    listAssessmentRuns(1)
      .then((r) => {
        if (!active) return;
        setRuns(r);
        setLoaded(true);
      })
      .catch(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  const handleStart = () => {
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch {/* noop */}
    navigate('/launch/assessment');
  };

  const last = runs[0];
  const hasRun = loaded && !!last;

  return (
    <div className="rounded-3xl bg-launch-ivory border border-launch-gold/30 p-5">
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList className="h-4 w-4 text-launch-ember" />
        <h3 className="font-semibold text-launch-ink">MYRHYTHM Brain Health Assessment</h3>
      </div>
      <p className="text-sm text-launch-ink/65 mb-4">
        {hasRun
          ? `My last snapshot: ${formatDate(last.completedAt ?? last.createdAt)} · score ${last.total}. Things change — so can my snapshot.`
          : 'Eight questions, one per letter of MYRHYTHM — about 3 minutes, shaped around me.'}
      </p>
      <button
        type="button"
        onClick={handleStart}
        className="inline-flex items-center gap-2 min-h-[56px] px-5 rounded-full bg-launch-ink text-launch-cream text-sm font-semibold hover:bg-launch-moss transition-colors"
      >
        {hasRun ? (
          <>
            <RotateCcw className="h-4 w-4" />
            Retake my assessment
          </>
        ) : (
          <>
            <ClipboardList className="h-4 w-4" />
            Take my assessment
          </>
        )}
      </button>
    </div>
  );
}
