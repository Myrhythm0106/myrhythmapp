import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { loopProgress, type LoopCounts } from './firstLoop';

const count = async (q: PromiseLike<{ count: number | null }>) => (await q).count ?? 0;

export function useFirstLoop() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<LoopCounts | null>(null);
  useEffect(() => {
    if (!user?.id) return;
    let live = true;
    const uid = user.id;
    const head = { count: 'exact' as const, head: true };
    Promise.all([
      count(supabase.from('meeting_recordings').select('id', head).eq('user_id', uid)),
      count(supabase.from('extracted_actions').select('id', head).eq('user_id', uid).in('status', ['confirmed', 'scheduled', 'modified', 'doing', 'in_progress', 'done', 'completed'])),
      count(supabase.from('calendar_events').select('id', head).eq('user_id', uid)),
      count(supabase.from('calendar_events').select('id', head).eq('user_id', uid).eq('status', 'done')),
      count(supabase.from('support_circle_members').select('id', head).eq('user_id', uid)),
    ]).then(([recordings, confirmed, scheduled, finished, circle]) => {
      if (live) setCounts({ recordings, confirmed, scheduled, finished, circle });
    }).catch(() => { /* leave hidden if counts cannot load */ });
    return () => { live = false; };
  }, [user?.id]);
  return counts ? { counts, ...loopProgress(counts) } : null;
}
