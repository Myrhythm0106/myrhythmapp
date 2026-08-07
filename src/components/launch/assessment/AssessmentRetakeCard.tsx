import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, RotateCcw } from 'lucide-react';
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
 * Retake the assessment as often as you like, and see how previous
 * snapshots compare. Past runs only appear for signed-in accounts.
 */
export function AssessmentRetakeCard() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<StoredAssessmentRun[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    let active = true;
    listAssessmentRuns(10)
      .then((r) => active && setRuns(r))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const handleRetake = () => {
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch {/* noop */}
    navigate('/launch/assessment');
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 pb-10">
      <div className="rounded-2xl border border-launch-gold/30 bg-launch-ivory p-5">
        <h3 className="font-display font-bold text-launch-ink mb-1">
          Things change — so can your snapshot
        </h3>
        <p className="text-sm text-launch-ink/65 mb-4">
          Retake the assessment whenever you want. Every snapshot is kept, so you can see
          how your rhythm shifts over time.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRetake}
            className="inline-flex items-center gap-2 min-h-[48px] px-4 rounded-full bg-launch-ink text-launch-cream text-sm font-semibold hover:bg-launch-moss transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Retake assessment
          </button>
          {runs.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory((s) => !s)}
              aria-expanded={showHistory}
              className="inline-flex items-center gap-2 min-h-[48px] px-4 rounded-full border border-launch-gold/40 text-launch-ink text-sm font-semibold hover:bg-launch-gold/10 transition-colors"
            >
              <History className="h-4 w-4" />
              {showHistory ? 'Hide past snapshots' : `Past snapshots (${runs.length})`}
            </button>
          )}
        </div>

        {showHistory && runs.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-launch-gold/30 pt-4">
            {runs.map((run) => (
              <li key={run.id} className="flex items-center justify-between text-sm">
                <span className="text-launch-ink/70">{formatDate(run.completedAt ?? run.createdAt)}</span>
                <span className="font-bold text-launch-ink">{run.total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
