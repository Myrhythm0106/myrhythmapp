
import { useEffect } from 'react';
import { useAccountabilitySystem } from './use-accountability-system';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useAccountabilityIntegration() {
  const { generateAlert } = useAccountabilitySystem();
  const { user } = useAuth();

  // Function to notify support circle when a task is completed
  const notifyTaskCompleted = async (taskTitle: string, taskId: string) => {
    if (!user) return;
    
    try {
      // Use the new database function to notify watchers
      const { data, error } = await supabase.rpc('notify_watchers_of_action_completion', {
        p_action_id: taskId,
        p_user_id: user.id,
        p_action_title: taskTitle,
        p_completion_status: 'completed'
      });

      if (error) {
        console.error('Error notifying watchers:', error);
        // Fallback to the old method
        await generateAlert(
          'task_completed',
          `Task Completed: ${taskTitle}`,
          `Great news! ${taskTitle} has been completed successfully.`,
          taskId,
          'info'
        );
      }
    } catch (error) {
      console.error('Failed to notify task completion:', error);
    }
  };

  // Function to notify support circle when a task is missed
  const notifyTaskMissed = async (taskTitle: string, taskId: string) => {
    if (!user) return;
    
    try {
      // Use the new database function to notify watchers
      const { data, error } = await supabase.rpc('notify_watchers_of_action_completion', {
        p_action_id: taskId,
        p_user_id: user.id,
        p_action_title: taskTitle,
        p_completion_status: 'missed'
      });

      if (error) {
        console.error('Error notifying watchers:', error);
        // Fallback to the old method
        await generateAlert(
          'task_missed',
          `Task Missed: ${taskTitle}`,
          `${taskTitle} was not completed as scheduled. Consider reaching out to offer support.`,
          taskId,
          'warning'
        );
      }
    } catch (error) {
      console.error('Failed to notify task missed:', error);
    }
  };

  // Function to notify support circle of streak milestones
  const notifyStreakMilestone = async (streakType: string, streakCount: number) => {
    if (!user) return;
    
    await generateAlert(
      'streak_milestone',
      `${streakCount}-Day ${streakType} Streak!`,
      `Celebrating a ${streakCount}-day streak in ${streakType}! This is a significant milestone worth celebrating.`,
      undefined,
      'info'
    );
  };

  // Function to notify support circle of concerning patterns
  const notifyConcernPattern = async (pattern: string, details: string) => {
    if (!user) return;
    
    await generateAlert(
      'concern_pattern',
      `Attention Needed: ${pattern}`,
      details,
      undefined,
      'urgent'
    );
  };

  return {
    notifyTaskCompleted,
    notifyTaskMissed,
    notifyStreakMilestone,
    notifyConcernPattern
  };
}
