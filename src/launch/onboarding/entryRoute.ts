import { supabase } from '@/integrations/supabase/client';
import { getResumePoint } from './resumePoint';

/**
 * One rule for every landing button: questions first, payment after the snapshot.
 * Account → About me → Questions → My snapshot → Home or membership.
 */
export type EntryIntent = 'start' | 'founding';

function hasSnapshot(): boolean {
  try {
    const raw = localStorage.getItem('myrhythm_launch_mode');
    return Boolean(raw && JSON.parse(raw)?.assessmentCompleted);
  } catch {
    return false;
  }
}

async function isMember(userId: string): Promise<boolean> {
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

export async function resolveEntryRoute(intent: EntryIntent, userId?: string | null): Promise<string> {
  try {
    if (intent === 'founding') localStorage.setItem('myrhythm_intent', 'founding');
  } catch {
    /* noop */
  }
  if (!userId) return intent === 'founding' ? '/launch/register?intent=founding' : '/launch/register';

  if (!hasSnapshot()) {
    const resume = getResumePoint();
    if (resume === '/launch/assessment' || resume?.startsWith('/launch/assessment')) return '/launch/assessment';
    return localStorage.getItem('myrhythm_user_type') ? '/launch/assessment' : '/launch/user-type';
  }

  if (intent === 'founding') {
    return (await isMember(userId)) ? '/launch/home' : '/launch/payment';
  }
  return '/launch/home';
}
