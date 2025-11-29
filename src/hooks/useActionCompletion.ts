import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { celebrateBigWin } from '@/utils/celebration';

export function useActionCompletion() {
  const { user } = useAuth();

  const markActionComplete = useCallback(async (
    actionId: string,
    actionTitle: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to complete actions');
      return false;
    }

    try {
      // Update action status to completed
      const { error: updateError } = await supabase
        .from('extracted_actions')
        .update({ 
          status: 'completed',
          completion_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', actionId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Notify support circle watchers via the RPC function
      const { error: notifyError } = await supabase.rpc('notify_watchers_of_action_completion', {
        p_action_id: actionId,
        p_user_id: user.id,
        p_action_title: actionTitle,
        p_completion_status: 'completed'
      });

      if (notifyError) {
        console.warn('Could not notify watchers:', notifyError);
        // Don't fail the completion if notification fails
      }

      // Create cross-device notification for the user's own devices
      await supabase.from('cross_device_notifications').insert({
        user_id: user.id,
        notification_type: 'action_completed',
        device_source: 'web',
        data: {
          action_id: actionId,
          action_title: actionTitle,
          completed_at: new Date().toISOString()
        }
      });

      // Trigger celebration
      celebrateBigWin();
      
      return true;
    } catch (error) {
      console.error('Error completing action:', error);
      toast.error('Failed to mark action as complete');
      return false;
    }
  }, [user]);

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
