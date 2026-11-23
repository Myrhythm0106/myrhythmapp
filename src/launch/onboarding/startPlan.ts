/**
 * How someone chose to begin at Get Started. Both choices add a card straight
 * after the account is created, then carry on with the same set-up:
 *  - 'trial'  : free for 7 days — card at the start, nothing charged for 7 days,
 *               cancel before then and nothing is paid.
 *  - 'member' : register fully — membership starts today, first payment today.
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
  } catch {/* noop */}
}

/** Where to go straight after the account is created: the card step, for both choices. */
export function nextAfterAccount(plan: StartPlan): string {
  return `/launch/payment?from=setup&start=${plan}`;
}

/** Where set-up carries on once the card step is done. */
export function nextAfterCard(hasUserType: boolean): string {
  return hasUserType ? '/launch/assessment?first=1' : '/launch/user-type';
}

/** Days before the first charge: 7 for the free start, 0 when registering fully. */
export function daysBeforeFirstCharge(plan: StartPlan): number {
  return plan === 'trial' ? FREE_TRIAL_DAYS : 0;
}

/** What the card step asks the payment provider for. A card is always collected. */
export function checkoutRequest(plan: StartPlan, interval: 'month' | 'year') {
  return { plan: 'premium' as const, interval, startTrial: plan === 'trial' };
}

/** Reads the choice from the card step's address, falling back to the saved one. */
export function planFromSearch(search: string): StartPlan {
  const v = new URLSearchParams(search).get('start');
  if (v === 'trial' || v === 'member') return v;
  return readStartPlan() ?? 'trial';
}

/** Whole days left of the free start, never below 0. */
export function freeDaysLeft(startIso: string, now: Date = new Date()): number {
  const start = new Date(startIso).getTime();
  if (Number.isNaN(start)) return 0;
  const used = Math.floor((now.getTime() - start) / 86_400_000);
  return Math.max(0, FREE_TRIAL_DAYS - used);
}
