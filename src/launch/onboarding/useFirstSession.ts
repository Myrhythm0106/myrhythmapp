import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FirstSessionState {
  loading: boolean;
  /** Has anything at all been captured on this account? */
  recorded: boolean;
  /** Did the app find steps inside a capture? */
  reviewed: boolean;
  /** Is anything in the diary? */
  scheduled: boolean;
  /** Has one step been ticked off? */
  completed: boolean;
  /** All four done — the card retires itself. */
  allDone: boolean;
  /** Nothing yet: Home shows the calm "start here" version. */
  isNewAccount: boolean;
}

const EMPTY: FirstSessionState = {
  loading: true,
  recorded: false,
  reviewed: false,
  scheduled: false,
  completed: false,
  allDone: false,
  isNewAccount: false,
};

async function countRows(
  table: 'voice_recordings' | 'extracted_actions' | 'calendar_events',
  userId: string,
  extra?: (q: never) => never
): Promise<number> {
  try {
    let query = supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    if (extra) query = (extra as unknown as (q: typeof query) => typeof query)(query);
    const { count } = await query;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/**
 * The guided first session: record → see the steps → send one to the diary →
 * tick it off. Derived from real rows, so closing the app never loses progress.
 */
export function useFirstSession(): FirstSessionState {
  const [state, setState] = useState<FirstSessionState>(EMPTY);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) {
        if (active) setState({ ...EMPTY, loading: false });
        return;
      }

      const [recordings, actions, events, done] = await Promise.all([
        countRows('voice_recordings', userId),
        countRows('extracted_actions', userId),
        countRows('calendar_events', userId),
        (async () => {
          try {
            const { count } = await supabase
              .from('calendar_events')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId)
              .eq('status', 'completed');
            return count ?? 0;
          } catch {
            return 0;
          }
        })(),
      ]);

      if (!active) return;

      const recorded = recordings > 0;
      const reviewed = actions > 0;
      const scheduled = events > 0;
      const completed = done > 0;

      setState({
        loading: false,
        recorded,
        reviewed,
        scheduled,
        completed,
        allDone: recorded && reviewed && scheduled && completed,
        isNewAccount: !recorded && !scheduled,
      });
    })();

    return () => {
      active = false;
    };
  }, []);

  return state;
}
