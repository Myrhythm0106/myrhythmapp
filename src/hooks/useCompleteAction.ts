import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { clearActionReminders, ensureDefaultLadder } from '@/utils/reminderLadder';

/**
 * The one place a next step gets finished.
 *
 * Closing a step always does the same four things, wherever it is ticked:
 * close it properly, tell the people already attached to it, celebrate the
 * person who did it, and move the numbers. Undo puts all four back.
 */

export interface CompletionResult {
  actionId: string;
  actionTitle: string;
  notified: number;
  emailed: number;
  streak: number;
  isPersonalBest: boolean;
  doneThisWeek: number;
}

export interface CompletionStats {
  doneThisWeek: number;
  currentStreak: number;
  openSteps: number;
}

export const COMPLETION_STATS_EVENT = 'myrhythm:completion-stats-changed';

function announceStatsChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COMPLETION_STATS_EVENT));
  }
}

export async function fetchCompletionStats(): Promise<CompletionStats> {
  const { data, error } = await supabase.rpc('my_completion_stats');
  if (error || !data || !data[0]) {
    if (error) console.error('[completion] stats failed', error);
    return { doneThisWeek: 0, currentStreak: 0, openSteps: 0 };
  }
  const row = data[0] as { done_this_week: number; current_streak: number; open_steps: number };
  return {
    doneThisWeek: row.done_this_week ?? 0,
    currentStreak: row.current_streak ?? 0,
    openSteps: row.open_steps ?? 0
  };
}

/** Snapshot of what a step looked like before it was closed, so undo is exact. */
interface PreCompletionSnapshot {
  status: string;
  completion_date: string | null;
  archived_at: string | null;
  end_date: string | null;
  priority_level: number | null;
}

const snapshots = new Map<string, PreCompletionSnapshot>();

export function useCompleteAction() {
  const { user } = useAuth();
  const [isCompleting, setIsCompleting] = useState(false);

  const completeAction = useCallback(
    async (actionId: string, actionTitle: string): Promise<CompletionResult | null> => {
      if (!user) return null;
      setIsCompleting(true);

      try {
        // Remember the exact state so undo is a true reversal.
        const { data: before } = await supabase
          .from('extracted_actions')
          .select('status, completion_date, archived_at, end_date, priority_level')
          .eq('id', actionId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (before) {
          snapshots.set(actionId, before as PreCompletionSnapshot);
        }

        const today = new Date();
        const completionDate = [
          today.getFullYear(),
          String(today.getMonth() + 1).padStart(2, '0'),
          String(today.getDate()).padStart(2, '0')
        ].join('-');

        const { error } = await supabase
          .from('extracted_actions')
          .update({
            status: 'done',
            completion_date: completionDate,
            archived_at: new Date().toISOString()
          })
          .eq('id', actionId)
          .eq('user_id', user.id);

        if (error) throw error;

        // Closed work stops nagging.
        await clearActionReminders(actionId);

        // Tell only the people already attached to this step.
        let notified = 0;
        let emailed = 0;
        try {
          const { data: notice } = await supabase.rpc('notify_circle_of_step_completion', {
            p_action_id: actionId
          });
          const payload = notice as
            | { notified?: number; emails?: string[]; title?: string; message?: string }
            | null;
          notified = payload?.notified ?? 0;
          const emails = Array.isArray(payload?.emails) ? payload!.emails! : [];

          await Promise.all(
            emails.map(async to => {
              const { error: mailError } = await supabase.functions.invoke('send-email', {
                body: {
                  to,
                  subject: payload?.title || 'A next step has been completed',
                  content: `<p>${payload?.message || `"${actionTitle}" has been completed.`}</p>`,
                  invitationType: 'action_completed'
                }
              });
              if (!mailError) emailed += 1;
            })
          );
        } catch (notifyError) {
          // A missed notice must never block the completion itself.
          console.warn('[completion] notification failed', notifyError);
        }

        const stats = await fetchCompletionStats();
        const best = Number(localStorage.getItem('mr:best-streak') || 0);
        const isPersonalBest = stats.currentStreak > 0 && stats.currentStreak > best;
        if (isPersonalBest) {
          try {
            localStorage.setItem('mr:best-streak', String(stats.currentStreak));
          } catch {
            /* storage unavailable — streak still shows for this session */
          }
        }

        announceStatsChange();

        return {
          actionId,
          actionTitle,
          notified,
          emailed,
          streak: stats.currentStreak,
          isPersonalBest,
          doneThisWeek: stats.doneThisWeek
        };
      } catch (err) {
        console.error('[completion] failed', err);
        return null;
      } finally {
        setIsCompleting(false);
      }
    },
    [user]
  );

  /** Undo means undo: status, date, archive, reminders and the notice all go back. */
  const undoCompletion = useCallback(
    async (actionId: string): Promise<boolean> => {
      if (!user) return false;
      const before = snapshots.get(actionId);

      const { error } = await supabase
        .from('extracted_actions')
        .update({
          status: before?.status && before.status !== 'done' ? before.status : 'pending',
          completion_date: before?.completion_date ?? null,
          archived_at: before?.archived_at ?? null
        })
        .eq('id', actionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('[completion] undo failed', error);
        return false;
      }

      await supabase.rpc('withdraw_step_completion_notice', { p_action_id: actionId });

      if (before?.end_date) {
        await ensureDefaultLadder(actionId, user.id, before.end_date, before.priority_level ?? undefined);
      }

      snapshots.delete(actionId);
      announceStatsChange();
      return true;
    },
    [user]
  );

  return { completeAction, undoCompletion, isCompleting };
}
