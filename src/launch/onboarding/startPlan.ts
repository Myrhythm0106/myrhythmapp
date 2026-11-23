/**
 * How someone chose to begin at Get Started:
 *  - 'trial'  : set up first and use MyRhythm free for 7 days; no payment today.
 *  - 'member' : register fully — secure membership straight after the account,
 *               then carry on with set-up.
 * Device-local; the account itself never depends on it.
 */
export type StartPlan = 'trial' | 'member';

const KEY = 'myrhythm_start_plan';
export const FREE_TRIAL_DAYS = 7;

export function readStartPlan(): StartPlan | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'trial' || v === 'member' ? v : null;
  } catch {
    return null;
  }
}

export function saveStartPlan(plan: StartPlan) {
  try {
    localStorage.setItem(KEY, plan);
    if (plan === 'trial' && !localStorage.getItem('myrhythm_free_start_date')) {
      localStorage.setItem('myrhythm_free_start_date', new Date().toISOString());
    }
  } catch {/* noop */}
}

/** Where to go straight after the account is created. */
export function nextAfterAccount(plan: StartPlan, hasUserType: boolean): string {
  if (plan === 'member') return '/launch/payment?from=setup';
  return hasUserType ? '/launch/assessment?first=1' : '/launch/user-type';
}

/** Whole days left of the free start, never below 0. */
export function freeDaysLeft(startIso: string, now: Date = new Date()): number {
  const start = new Date(startIso).getTime();
  if (Number.isNaN(start)) return 0;
  const used = Math.floor((now.getTime() - start) / 86_400_000);
  return Math.max(0, FREE_TRIAL_DAYS - used);
}
