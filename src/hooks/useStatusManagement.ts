import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccountabilitySystem } from './use-accountability-system';
import { useSubscription } from './useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ActionStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

interface StatusUpdate {
  actionId: string;
  previousStatus: ActionStatus;
  newStatus: ActionStatus;
  timestamp: string;
  note?: string;
}

interface StatusSuggestion {
  status: ActionStatus;
  reason: string;
  confidence: number;
  autoApply?: boolean;
}

export function useStatusManagement() {
  const { user } = useAuth();
  const { generateAlert, supportCircle } = useAccountabilitySystem();
  const { tier, hasFeature } = useSubscription();
  const [statusHistory, setStatusHistory] = useState<StatusUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateActionStatus = useCallback(async (
    actionId: string,
    newStatus: ActionStatus,
    note?: string,
    notifySupport: boolean = true
  ) => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Get current action details
      const { data: currentAction, error: fetchError } = await supabase
        .from('extracted_actions')
        .select('*')
        .eq('id', actionId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const previousStatus = currentAction.status as ActionStatus;

      // Update the action status
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Set completion date if completed
      if (newStatus === 'completed') {
        updateData.completion_date = new Date().toISOString().split('T')[0];
      }

      const { error: updateError } = await supabase
        .from('extracted_actions')
        .update(updateData)
        .eq('id', actionId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Record status change in history
      const statusUpdate: StatusUpdate = {
        actionId,
        previousStatus,
        newStatus,
        timestamp: new Date().toISOString(),
        note
      };

      setStatusHistory(prev => [statusUpdate, ...prev]);

      // Notify support circle if enabled and has members
      if (notifySupport && supportCircle.length > 0 && hasFeature('supportCircle')) {
        await notifySupportCircle(currentAction, previousStatus, newStatus, note);
      }

      // Generate celebration for completed actions
      if (newStatus === 'completed') {
        toast.success(`🎉 Great job completing "${currentAction.action_text}"!`);
      }

      return statusUpdate;
    } catch (error) {
      console.error('Error updating action status:', error);
      toast.error('Failed to update action status');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, supportCircle, hasFeature, generateAlert]);

  const notifySupportCircle = useCallback(async (
    action: any,
    previousStatus: ActionStatus,
    newStatus: ActionStatus,
    note?: string
  ) => {
    const getStatusMessage = (status: ActionStatus) => {
      switch (status) {
        case 'completed': return '✅ Completed';
        case 'in_progress': return '⏳ Started working on';
        case 'on_hold': return '⏸️ Put on hold';
        case 'cancelled': return '❌ Cancelled';
        default: return status;
      }
    };

    const alertType = newStatus === 'completed' ? 'task_completed' : 'task_missed';
    const severity = newStatus === 'completed' ? 'info' : 
                    newStatus === 'cancelled' ? 'warning' : 'info';

    const message = `${getStatusMessage(newStatus)}: "${action.action_text}"${note ? `\n\nNote: ${note}` : ''}`;

    await generateAlert(
      alertType,
      `Status Update: ${action.action_text}`,
      message,
      action.id,
      severity
    );
  }, [generateAlert]);

  const getStatusSuggestions = useCallback(async (actionId: string): Promise<StatusSuggestion[]> => {
    if (!user || tier === 'starter') return [];

    try {
      // Get action details
      const { data: action } = await supabase
        .from('extracted_actions')
        .select('*')
        .eq('id', actionId)
        .eq('user_id', user.id)
        .single();

      if (!action) return [];

      const suggestions: StatusSuggestion[] = [];
      const now = new Date();
      const createdAt = new Date(action.created_at);
      const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

      // AI-powered suggestions based on tier
      if (tier === 'stretch' || tier === 'leap') {
        // Suggest status changes based on patterns
        if (action.status === 'not_started' && daysSinceCreated >= 2) {
          suggestions.push({
            status: 'in_progress',
            reason: `This action has been pending for ${daysSinceCreated} days. Consider starting to maintain momentum.`,
            confidence: 75
          });
        }

        if (action.status === 'in_progress' && daysSinceCreated >= 7) {
          suggestions.push({
            status: 'on_hold',
            reason: `This action has been in progress for a week. Consider if it needs to be put on hold or broken down further.`,
            confidence: 60
          });
        }

        // Check for similar completed actions for time estimation
        const { data: similarActions } = await supabase
          .from('extracted_actions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .ilike('action_text', `%${action.action_text.split(' ').slice(0, 2).join(' ')}%`)
          .limit(5);

        if (similarActions && similarActions.length > 0) {
          const avgCompletionDays = similarActions.reduce((sum, a) => {
            const created = new Date(a.created_at);
            const completed = new Date(a.completion_date || a.updated_at);
            return sum + Math.floor((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) / similarActions.length;

          if (daysSinceCreated >= avgCompletionDays * 1.5) {
            suggestions.push({
              status: 'in_progress',
              reason: `Similar actions typically take ${Math.round(avgCompletionDays)} days. You might want to check progress.`,
              confidence: 70
            });
          }
        }
      }

      return suggestions;
    } catch (error) {
      console.error('Error getting status suggestions:', error);
      return [];
    }
  }, [user, tier]);

  const getStatusProgress = useCallback(async (timeframe: 'week' | 'month' | 'quarter' = 'week') => {
    if (!user) return null;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90));

      const { data: actions } = await supabase
        .from('extracted_actions')
        .select('status, created_at, completion_date')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      if (!actions) return null;

      const statusCounts = actions.reduce((acc: any, action) => {
        acc[action.status] = (acc[action.status] || 0) + 1;
        return acc;
      }, {});

      const totalActions = actions.length;
      const completedActions = statusCounts.completed || 0;
      const completionRate = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

      return {
        totalActions,
        completedActions,
        completionRate: Math.round(completionRate),
        statusBreakdown: statusCounts,
        timeframe
      };
    } catch (error) {
      console.error('Error getting status progress:', error);
      return null;
    }
  }, [user]);

  return {
    updateActionStatus,
    getStatusSuggestions,
    getStatusProgress,
    statusHistory,
    isLoading,
    tier,
    hasFeature
  };
}