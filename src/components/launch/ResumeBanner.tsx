import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getResumePoint } from '@/launch/onboarding/resumePoint';
import { isAppReady } from '@/hooks/useAppReady';

const LABELS: Record<string, string> = {
  '/launch/user-type': 'choosing what brings you here',
  '/launch/assessment': 'your assessment',
  '/launch/payment': 'choosing your plan',
};

/**
 * If someone closed the app part-way through onboarding, bring them back to
 * that exact step instead of making them start again.
 */
export function ResumeBanner() {
  const navigate = useNavigate();
  const [path, setPath] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAppReady()) return;
    const p = getResumePoint();
    if (p && LABELS[p]) setPath(p);
  }, []);

  if (!path) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 px-4 pb-safe">
      <Button
        onClick={() => navigate(path)}
        className="mx-auto flex min-h-14 w-full max-w-md items-center justify-between gap-3 rounded-md bg-launch-ink-deep px-5 py-4 text-left text-primary-foreground shadow-2xl hover:bg-launch-ink"
      >
        <span className="text-sm font-semibold">
          Pick up where you left off — {LABELS[path]}
        </span>
        <ArrowRight className="h-5 w-5 shrink-0" />
      </Button>
    </div>
  );
}
