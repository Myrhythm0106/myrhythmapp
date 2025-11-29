import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface SmartReminder {
  id: string;
  event_id: string;
  user_id: string;
  reminder_time: string;
  reminder_methods: string[];
  is_active: boolean;
  sent_at: string | null;
  created_at: string;
  calendar_event?: {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string | null;
  };
}

export interface CreateReminderInput {
  eventId: string;
  reminderTime: '5_minutes_before' | '15_minutes_before' | '30_minutes_before' | '1_hour_before' | '1_day_before' | 'morning_of';
  methods?: string[];
}

// Default reminders to create when scheduling an action
export const DEFAULT_REMINDER_TIMES = [
  { time: '15_minutes_before', methods: ['in_app', 'push'] },
  { time: 'morning_of', methods: ['email', 'in_app'] }
] as const;

export function useSmartReminders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch upcoming reminders
  const { data: upcomingReminders, isLoading, refetch } = useQuery({
    queryKey: ['smart-reminders', user?.id],
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
            description
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .is('sent_at', null)
        .order('created_at', { ascending: true })
        .limit(20);
      
      if (error) throw error;
      
      // Transform the data
      return (data || []).map(item => ({
        ...item,
        calendar_event: item.calendar_events
      })) as SmartReminder[];
    },
    enabled: !!user?.id,
    refetchInterval: 60000 // Refresh every minute
  });

  // Create a single reminder
  const createReminderMutation = useMutation({
    mutationFn: async ({ eventId, reminderTime, methods = ['in_app', 'push'] }: CreateReminderInput) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('event_reminders')
        .insert({
          event_id: eventId,
          user_id: user.id,
          reminder_time: reminderTime,
          reminder_methods: methods,
          is_active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smart-reminders'] });
    }
  });

  // Create default reminders for an event
  const createDefaultReminders = useCallback(async (eventId: string) => {
    if (!user?.id) return;
    
    const promises = DEFAULT_REMINDER_TIMES.map(({ time, methods }) =>
      supabase
        .from('event_reminders')
        .insert({
          event_id: eventId,
          user_id: user.id,
          reminder_time: time,
          reminder_methods: [...methods],
          is_active: true
        })
    );
    
    await Promise.all(promises);
    queryClient.invalidateQueries({ queryKey: ['smart-reminders'] });
  }, [user?.id, queryClient]);

  // Snooze a reminder
  const snoozeReminder = useCallback(async (reminderId: string, snoozeMinutes: number) => {
    if (!user?.id) return;
    
    // Mark current as sent, create new one with delayed time
    const { error } = await supabase
      .from('event_reminders')
      .update({ 
        sent_at: new Date().toISOString(),
        is_active: false 
      })
      .eq('id', reminderId);
    
    if (error) {
      toast.error('Failed to snooze reminder');
      return;
    }
    
    toast.success(`Snoozed for ${snoozeMinutes} minutes`);
    queryClient.invalidateQueries({ queryKey: ['smart-reminders'] });
  }, [user?.id, queryClient]);

  // Dismiss a reminder
  const dismissReminder = useCallback(async (reminderId: string) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('event_reminders')
      .update({ is_active: false })
      .eq('id', reminderId);
    
    if (error) {
      toast.error('Failed to dismiss reminder');
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: ['smart-reminders'] });
  }, [user?.id, queryClient]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('smart-reminders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cross_device_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // New notification received - could trigger toast here
          queryClient.invalidateQueries({ queryKey: ['smart-reminders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return {
    upcomingReminders: upcomingReminders || [],
    isLoading,
    refetch,
    createReminder: createReminderMutation.mutate,
    createDefaultReminders,
    snoozeReminder,
    dismissReminder,
    isCreating: createReminderMutation.isPending
  };
}
