import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { pushNotificationService } from '@/services/pushNotifications';
import { getRandomMotivation, getEscalationMessage, getCelebrationMessage } from '@/data/reminderMotivations';
import { celebrateActionComplete } from '@/utils/celebration';

export interface BrainHealthReminder {
  id: string;
  event_id: string;
  user_id: string;
  reminder_time: string;
  reminder_methods: string[];
  is_active: boolean;
  sent_at: string | null;
  created_at: string;
  original_motivation: string | null;
  location_context: string | null;
  success_visual_url: string | null;
  pre_reminder_sent_at: string | null;
  confirmation_received: boolean;
  escalation_level: number;
  benefit_message: string | null;
  who_benefits: string | null;
  calendar_event?: {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string | null;
    category: string | null;
  };
}

export interface ReminderStreak {
  id: string;
  user_id: string;
  reminder_type: string;
  current_streak: number;
  longest_streak: number;
  last_completed_at: string | null;
  total_completions: number;
}

export interface CreateBrainHealthReminderInput {
  eventId: string;
  reminderTime: string;
  methods?: string[];
  originalMotivation?: string;
  locationContext?: string;
  whoBenefits?: string;
  category?: string;
}

export function useBrainHealthReminders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeEscalation, setActiveEscalation] = useState<BrainHealthReminder | null>(null);

  // Initialize push notifications on mount
  useEffect(() => {
    pushNotificationService.initialize();
    pushNotificationService.registerActionTypes();
  }, []);

  // Fetch upcoming reminders with full context
  const { data: upcomingReminders, isLoading } = useQuery({
    queryKey: ['brain-health-reminders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('event_reminders')
        .select(`
          *,
          calendar_events (
            id,
            title,
            date,
            time,
            description,
            category
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .is('sent_at', null)
        .order('created_at', { ascending: true })
        .limit(20);
      
      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        calendar_event: item.calendar_events
      })) as BrainHealthReminder[];
    },
    enabled: !!user?.id,
    refetchInterval: 30000 // Check more frequently for escalation
  });

  // Fetch user's reminder streaks
  const { data: streaks } = useQuery({
    queryKey: ['reminder-streaks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('reminder_streaks')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as ReminderStreak[];
    },
    enabled: !!user?.id
  });

  // Create a brain-health optimized reminder
  const createReminderMutation = useMutation({
    mutationFn: async (input: CreateBrainHealthReminderInput) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Get a motivational benefit message based on category
      const motivation = getRandomMotivation(input.category);
      
      const { data, error } = await supabase
        .from('event_reminders')
        .insert({
          event_id: input.eventId,
          user_id: user.id,
          reminder_time: input.reminderTime,
          reminder_methods: input.methods || ['in_app', 'push'],
          is_active: true,
          original_motivation: input.originalMotivation,
          location_context: input.locationContext,
          who_benefits: input.whoBenefits,
          benefit_message: motivation.benefit,
          escalation_level: 0,
          confirmation_received: false
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brain-health-reminders'] });
      toast.success('Reminder set with brain-health optimization!');
    }
  });

  // Complete a reminder (mark as done)
  const completeReminder = useCallback(async (reminderId: string, reminderType?: string) => {
    if (!user?.id) return;
    
    try {
      // Mark reminder as complete
      await supabase
        .from('event_reminders')
        .update({ 
          confirmation_received: true,
          is_active: false,
          sent_at: new Date().toISOString()
        })
        .eq('id', reminderId);
      
      // Update streak
      const streakType = reminderType || 'general';
      const existingStreak = streaks?.find(s => s.reminder_type === streakType);
      
      if (existingStreak) {
        const lastCompleted = existingStreak.last_completed_at 
          ? new Date(existingStreak.last_completed_at) 
          : null;
        const now = new Date();
        const isConsecutiveDay = lastCompleted && 
          (now.getTime() - lastCompleted.getTime()) < 48 * 60 * 60 * 1000; // Within 48 hours
        
        const newStreak = isConsecutiveDay ? existingStreak.current_streak + 1 : 1;
        const newLongest = Math.max(newStreak, existingStreak.longest_streak);
        
        await supabase
          .from('reminder_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: newLongest,
            last_completed_at: now.toISOString(),
            total_completions: existingStreak.total_completions + 1
          })
          .eq('id', existingStreak.id);
      } else {
        await supabase
          .from('reminder_streaks')
          .insert({
            user_id: user.id,
            reminder_type: streakType,
            current_streak: 1,
            longest_streak: 1,
            last_completed_at: new Date().toISOString(),
            total_completions: 1
          });
      }
      
      // Celebrate!
      celebrateActionComplete();
      toast.success(getCelebrationMessage());
      
      queryClient.invalidateQueries({ queryKey: ['brain-health-reminders'] });
      queryClient.invalidateQueries({ queryKey: ['reminder-streaks'] });
      setActiveEscalation(null);
    } catch (error) {
      console.error('Failed to complete reminder:', error);
      toast.error('Failed to mark as complete');
    }
  }, [user?.id, streaks, queryClient]);

  // Snooze a reminder
  const snoozeReminder = useCallback(async (reminderId: string, snoozeMinutes: number = 10) => {
    if (!user?.id) return;
    
    try {
      // Get current reminder
      const { data: reminder } = await supabase
        .from('event_reminders')
        .select('escalation_level')
        .eq('id', reminderId)
        .single();
      
      // Increase escalation level on snooze
      const newLevel = Math.min((reminder?.escalation_level || 0) + 1, 3);
      
      await supabase
        .from('event_reminders')
        .update({ 
          escalation_level: newLevel
        })
        .eq('id', reminderId);
      
      toast.info(`Snoozed for ${snoozeMinutes} minutes. ${getEscalationMessage(newLevel)}`);
      
      // Schedule local notification for snooze time
      const snoozeTime = new Date(Date.now() + snoozeMinutes * 60 * 1000);
      await pushNotificationService.scheduleLocalNotification({
        title: '⏰ Reminder (Snoozed)',
        body: getEscalationMessage(newLevel),
        schedule: snoozeTime,
        escalationLevel: newLevel,
        data: { reminderId }
      });
      
      queryClient.invalidateQueries({ queryKey: ['brain-health-reminders'] });
      setActiveEscalation(null);
    } catch (error) {
      console.error('Failed to snooze reminder:', error);
      toast.error('Failed to snooze');
    }
  }, [user?.id, queryClient]);

  // Request help from support circle
  const requestHelp = useCallback(async (reminderId: string) => {
    if (!user?.id) return;
    
    try {
      // Get the reminder with event details
      const { data: reminder } = await supabase
        .from('event_reminders')
        .select(`
          *,
          calendar_events (title)
        `)
        .eq('id', reminderId)
        .single();
      
      if (!reminder) return;
      
      // Create a support circle alert
      await supabase
        .from('accountability_alerts')
        .insert({
          user_id: user.id,
          alert_type: 'help_requested',
          title: `Help Requested: ${reminder.calendar_events?.title || 'Task'}`,
          message: `User has requested help with their reminder. They may need support completing this task.`,
          severity: 'warning',
          related_id: reminder.event_id,
          target_members: []
        });
      
      toast.success('Help request sent to your support circle');
      
      // Mark escalation level as max
      await supabase
        .from('event_reminders')
        .update({ escalation_level: 3 })
        .eq('id', reminderId);
      
      setActiveEscalation(null);
    } catch (error) {
      console.error('Failed to request help:', error);
      toast.error('Failed to send help request');
    }
  }, [user?.id]);

  // Dismiss a reminder (without completing)
  const dismissReminder = useCallback(async (reminderId: string) => {
    if (!user?.id) return;
    
    await supabase
      .from('event_reminders')
      .update({ is_active: false })
      .eq('id', reminderId);
    
    queryClient.invalidateQueries({ queryKey: ['brain-health-reminders'] });
    setActiveEscalation(null);
  }, [user?.id, queryClient]);

  // Get total streak across all types
  const getTotalStreak = useCallback(() => {
    if (!streaks || streaks.length === 0) return 0;
    return Math.max(...streaks.map(s => s.current_streak));
  }, [streaks]);

  // Get total completions
  const getTotalCompletions = useCallback(() => {
    if (!streaks || streaks.length === 0) return 0;
    return streaks.reduce((sum, s) => sum + s.total_completions, 0);
  }, [streaks]);

  // Listen for notification actions
  useEffect(() => {
    const handleReminderAction = (event: CustomEvent) => {
      const { reminderId, action } = event.detail;
      
      if (action === 'done') {
        completeReminder(reminderId);
      } else if (action === 'snooze') {
        snoozeReminder(reminderId, 10);
      } else if (action === 'help') {
        requestHelp(reminderId);
      }
    };

    window.addEventListener('reminder-action', handleReminderAction as EventListener);
    return () => {
      window.removeEventListener('reminder-action', handleReminderAction as EventListener);
    };
  }, [completeReminder, snoozeReminder, requestHelp]);

  return {
    upcomingReminders: upcomingReminders || [],
    isLoading,
    streaks: streaks || [],
    currentStreak: getTotalStreak(),
    totalCompletions: getTotalCompletions(),
    activeEscalation,
    setActiveEscalation,
    createReminder: createReminderMutation.mutate,
    isCreating: createReminderMutation.isPending,
    completeReminder,
    snoozeReminder,
    requestHelp,
    dismissReminder
  };
}
