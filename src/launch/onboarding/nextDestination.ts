/**
 * Where should a signed-in person land?
 *
 * Order of truth:
 *   1. An unfinished onboarding step they were part-way through.
 *   2. The brain health questions, if they have never answered them.
 *   3. Home.
 */
import { getResumePoint } from './resumePoint';
import { listAssessmentRuns } from '@/launch/assessment/assessmentHistory';

const LOCAL_SNAPSHOT_KEY = 'myrhythm_launch_mode';
const DEFER_KEY = 'myrhythm_assessment_deferred';

const ONBOARDING_RESUME_PATHS = new Set([
  '/launch/user-type',
  '/launch/assessment',
  '/launch/payment',
]);

/** A completed run stored locally (works for tester / offline sessions too). */
export function hasLocalAssessment(): boolean {
  try {
    const raw = localStorage.getItem(LOCAL_SNAPSHOT_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    const score = data?.brainHealthScore ?? data?.assessmentResults?.brainHealthScore;
    return typeof score?.total === 'number';
  } catch {
    return false;
  }
}

/** Local first (instant), then the saved runs on the account. */
export async function hasCompletedAssessment(): Promise<boolean> {
  if (hasLocalAssessment()) return true;
  try {
    const runs = await listAssessmentRuns(1);
    return runs.length > 0;
  } catch {
    return false;
  }
}

/** "Not now" — respected for the rest of the day, Home keeps the reminder. */
export function deferAssessment() {
  try {
    localStorage.setItem(DEFER_KEY, new Date().toDateString());
  } catch {/* noop */}
}

export function isAssessmentDeferred(): boolean {
  try {
    return localStorage.getItem(DEFER_KEY) === new Date().toDateString();
  } catch {
    return false;
  }
}

/**
 * Resolve the destination after a successful sign-in.
 * `requested` is an explicit deep link the user was trying to reach.
 */
export async function resolveNextDestination(requested?: string | null): Promise<string> {
  const resume = getResumePoint();
  if (resume && ONBOARDING_RESUME_PATHS.has(resume)) return resume;

  const done = await hasCompletedAssessment();
  if (!done && !isAssessmentDeferred()) return '/launch/assessment?first=1';

  return requested && requested !== '/launch/signin' ? requested : '/launch/home';
}
