import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { celebrateBigWin } from '@/utils/celebration';
import { useCompleteAction } from './useCompleteAction';

export function useActionCompletion() {
  const { user } = useAuth();
  const { completeAction } = useCompleteAction();

  const markActionComplete = useCallback(async (
    actionId: string,
    actionTitle: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to complete actions');
      return false;
    }

    const result = await completeAction(actionId, actionTitle);
    if (!result) {
      toast.error("That didn't save — please try again");
      return false;
    }

    // Legacy callers keep their existing local refresh/animation behaviour;
    // persistence, reminders, notices and stats now use the shared path.
    celebrateBigWin();
    return true;
  }, [completeAction, user]);

  const markDailyActionComplete = useCallback(async (
    actionId: string,
    actionTitle: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to complete actions');
      return false;
    }

    try {
      // Update daily action status
      const { error: updateError } = await supabase
        .from('daily_actions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', actionId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Notify watchers
      const { error: notifyError } = await supabase.rpc('notify_watchers_of_action_completion', {
        p_action_id: actionId,
        p_user_id: user.id,
        p_action_title: actionTitle,
        p_completion_status: 'completed'
      });

      if (notifyError) {
        console.warn('Could not notify watchers:', notifyError);
      }

      // Trigger celebration
      celebrateBigWin();
      
      return true;
    } catch (error) {
      console.error('Error completing daily action:', error);
      toast.error('Failed to mark action as complete');
      return false;
    }
  }, [user]);

  return {
    markActionComplete,
    markDailyActionComplete
  };
}
