import { supabase } from '@/integrations/supabase/client';
import { getResumePoint } from './resumePoint';

/**
 * One rule for every landing button: questions first, payment after the snapshot.
 * Light sign-up → Questions → My snapshot → Make it yours (optional) → Home or membership.
 */
export type EntryIntent = 'start' | 'founding';

/** Who is looking at the landing page — drives button wording. */
export type EntryState = 'new' | 'returning' | 'needsQuestions' | 'hasSnapshot' | 'member';

const DEVICE_ACCOUNT_KEY = 'myrhythm_has_account';

/** Remember (no personal data) that an account has been used on this device. */
export function markDeviceHasAccount() {
  try { localStorage.setItem(DEVICE_ACCOUNT_KEY, '1'); } catch { /* noop */ }
}

export function deviceHasAccount(): boolean {
  try { return localStorage.getItem(DEVICE_ACCOUNT_KEY) === '1'; } catch { return false; }
}

export function hasSnapshot(): boolean {
  try {
    const raw = localStorage.getItem('myrhythm_launch_mode');
    return Boolean(raw && JSON.parse(raw)?.assessmentCompleted);
  } catch {
    return false;
  }
}

export async function isMember(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .limit(1);
    return Boolean(data && data.length);
  } catch {
    return false;
  }
}

export async function getEntryState(userId?: string | null): Promise<EntryState> {
  if (!userId) return deviceHasAccount() ? 'returning' : 'new';
  if (!hasSnapshot()) return 'needsQuestions';
  return (await isMember(userId)) ? 'member' : 'hasSnapshot';
}

export async function resolveEntryRoute(intent: EntryIntent, userId?: string | null): Promise<string> {
  try {
    if (intent === 'founding') localStorage.setItem('myrhythm_intent', 'founding');
  } catch {
    /* noop */
  }
  if (!userId) return intent === 'founding' ? '/launch/register?intent=founding' : '/launch/register';

  if (!hasSnapshot()) {
    const resume = getResumePoint();
    if (resume?.startsWith('/launch/assessment')) return '/launch/assessment';
    return '/launch/assessment?first=1';
  }

  if (intent === 'founding') {
    return (await isMember(userId)) ? '/launch/home?from=landing' : '/launch/payment';
  }
  return '/launch/home?from=landing';
}
