import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CalendarShare {
  id: string;
  calendar_event_id: string;
  shared_with_email: string;
  permission_level: 'view' | 'edit' | 'admin';
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

interface EventInvitation {
  id: string;
  event_id: string;
  invitee_email: string;
  invitee_name?: string;
  status: 'pending' | 'accepted' | 'declined' | 'maybe';
  response_date?: string;
  message?: string;
}

interface EventReminder {
  id: string;
  event_id: string;
  reminder_time: string; // e.g., "7_days", "2_hours", "30_minutes"
  is_active: boolean;
}

export function useCollaborativeCalendar() {
  const { user } = useAuth();
  const [shares, setShares] = useState<CalendarShare[]>([]);
  const [invitations, setInvitations] = useState<EventInvitation[]>([]);
  const [reminders, setReminders] = useState<EventReminder[]>([]);
  const [loading, setLoading] = useState(false);

  // Load collaborative data
  useEffect(() => {
    if (user) {
      loadCollaborativeData();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const loadCollaborativeData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load calendar shares
      const { data: sharesData } = await supabase
        .from('calendar_shares')
        .select('*')
        .or(`shared_with_email.eq.${user.email},creator_id.eq.${user.id}`);

      // Load event invitations  
      const { data: invitationsData } = await supabase
        .from('event_invitations')
        .select('*')
        .or(`invitee_email.eq.${user.email},event_id.in.(select id from calendar_events where user_id = ${user.id})`);

      // Load event reminders
      const { data: remindersData } = await supabase
        .from('event_reminders')
        .select('*')
        .eq('user_id', user.id);

      setShares(sharesData || []);
      setInvitations(invitationsData || []);
      setReminders(remindersData || []);
    } catch (error) {
      console.error('Error loading collaborative data:', error);
      toast.error('Failed to load collaborative calendar data');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    if (!user) return;

    // Subscribe to calendar shares changes
    const sharesSubscription = supabase
      .channel('calendar-shares-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_shares' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setShares(prev => [...prev, payload.new as CalendarShare]);
          if (payload.new.shared_with_email === user.email) {
            toast.info('📅 New calendar shared with you!', {
              description: 'Check your notifications panel for details'
            });
          }
        } else if (payload.eventType === 'UPDATE') {
          setShares(prev => prev.map(share => 
            share.id === payload.new.id ? payload.new as CalendarShare : share
          ));
        } else if (payload.eventType === 'DELETE') {
          setShares(prev => prev.filter(share => share.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to invitation changes
    const invitationsSubscription = supabase
      .channel('invitations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_invitations' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setInvitations(prev => [...prev, payload.new as EventInvitation]);
          if (payload.new.invitee_email === user.email) {
            toast.info('📧 New event invitation received!');
          }
        } else if (payload.eventType === 'UPDATE') {
          setInvitations(prev => prev.map(inv => 
            inv.id === payload.new.id ? payload.new as EventInvitation : inv
          ));
        }
      })
      .subscribe();

    return () => {
      sharesSubscription.unsubscribe();
      invitationsSubscription.unsubscribe();
    };
  };

  const shareCalendarEvent = async (eventId: string, email: string, permission: 'view' | 'edit' | 'admin') => {
    try {
      const { error } = await supabase
        .from('calendar_shares')
        .insert({
          calendar_event_id: eventId,
          shared_with_email: email,
          permission_level: permission,
          creator_id: user?.id
        });

      if (error) throw error;

      toast.success('📤 Calendar event shared successfully!', {
        description: `Shared with ${email} with ${permission} permissions`
      });
    } catch (error) {
      console.error('Error sharing calendar event:', error);
      toast.error('Failed to share calendar event');
    }
  };

  const sendEventInvitation = async (eventId: string, inviteeEmail: string, inviteeName?: string, message?: string) => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .insert({
          event_id: eventId,
          invitee_email: inviteeEmail,
          invitee_name: inviteeName,
          message: message,
          inviter_id: user?.id
        });

      if (error) throw error;

      // Send invitation email via edge function
      await supabase.functions.invoke('send-event-invitation', {
        body: {
          eventId,
          inviteeEmail,
          inviteeName,
          message,
          inviterName: user?.user_metadata?.name || user?.email
        }
      });

      toast.success('📧 Invitation sent successfully!', {
        description: `Invitation sent to ${inviteeEmail}`
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    }
  };

  const respondToInvitation = async (invitationId: string, status: 'accepted' | 'declined' | 'maybe', message?: string) => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .update({
          status,
          response_date: new Date().toISOString(),
          response_message: message
        })
        .eq('id', invitationId);

      if (error) throw error;

      const statusEmoji = status === 'accepted' ? '✅' : status === 'declined' ? '❌' : '🤔';
      toast.success(`${statusEmoji} Response recorded!`, {
        description: `You ${status} the invitation`
      });
    } catch (error) {
      console.error('Error responding to invitation:', error);
      toast.error('Failed to respond to invitation');
    }
  };

  const addEventReminders = async (eventId: string, reminderTimes: string[]) => {
    try {
      const reminderData = reminderTimes.map(time => ({
        event_id: eventId,
        user_id: user?.id,
        reminder_time: time,
        is_active: true
      }));

      const { error } = await supabase
        .from('event_reminders')
        .insert(reminderData);

      if (error) throw error;

      toast.success('⏰ Reminders set successfully!', {
        description: `${reminderTimes.length} reminder(s) added`
      });
    } catch (error) {
      console.error('Error adding reminders:', error);
      toast.error('Failed to add reminders');
    }
  };

  return {
    shares,
    invitations,
    reminders,
    loading,
    shareCalendarEvent,
    sendEventInvitation,
    respondToInvitation,
    addEventReminders,
    refreshData: loadCollaborativeData
  };
}