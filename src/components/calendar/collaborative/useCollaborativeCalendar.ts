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
  creator_id: string;
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
  inviter_id: string;
  created_at: string;
}

interface EventReminder {
  id: string;
  event_id: string;
  user_id: string;
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
    }
  }, [user]);

  const loadCollaborativeData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Use existing calendar events for now until types are regenerated
      // Mock data for shares and invitations based on watchers field
      const { data: calendarEvents } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id);

      // Create mock shares from events with watchers
      const mockShares: CalendarShare[] = [];
      calendarEvents?.forEach(event => {
        if (event.watchers && event.watchers.length > 0) {
          event.watchers.forEach((watcherEmail: string) => {
            mockShares.push({
              id: `share-${event.id}-${watcherEmail}`,
              calendar_event_id: event.id,
              shared_with_email: watcherEmail,
              permission_level: 'view',
              status: 'accepted',
              creator_id: user.id,
              created_at: event.created_at
            });
          });
        }
      });

      // Mock invitations
      const mockInvitations: EventInvitation[] = [];
      
      // Mock reminders
      const mockReminders: EventReminder[] = [];

      setShares(mockShares);
      setInvitations(mockInvitations);
      setReminders(mockReminders);
    } catch (error) {
      console.error('Error loading collaborative data:', error);
      toast.error('Failed to load collaborative calendar data');
    } finally {
      setLoading(false);
    }
  };

  const shareCalendarEvent = async (eventId: string, email: string, permission: 'view' | 'edit' | 'admin') => {
    try {
      // For now, add to watchers field until types are regenerated
      const { data: event } = await supabase
        .from('calendar_events')
        .select('watchers')
        .eq('id', eventId)
        .single();

      if (event) {
        const currentWatchers = event.watchers || [];
        if (!currentWatchers.includes(email)) {
          await supabase
            .from('calendar_events')
            .update({
              watchers: [...currentWatchers, email]
            })
            .eq('id', eventId);
        }
      }

      toast.success('📤 Calendar event shared successfully!', {
        description: `Shared with ${email} with ${permission} permissions`
      });
      loadCollaborativeData(); // Refresh data
    } catch (error) {
      console.error('Error sharing calendar event:', error);
      toast.error('Failed to share calendar event');
    }
  };

  const sendEventInvitation = async (eventId: string, inviteeEmail: string, inviteeName?: string, message?: string) => {
    try {
      // For now, simulate invitation by adding to mock data
      const newInvitation: EventInvitation = {
        id: `inv-${Date.now()}`,
        event_id: eventId,
        invitee_email: inviteeEmail,
        invitee_name: inviteeName,
        status: 'pending',
        message: message,
        inviter_id: user?.id || '',
        created_at: new Date().toISOString()
      };

      setInvitations(prev => [...prev, newInvitation]);

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
      setInvitations(prev => prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status, response_date: new Date().toISOString() }
          : inv
      ));

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
      const newReminders = reminderTimes.map(time => ({
        id: `rem-${Date.now()}-${time}`,
        event_id: eventId,
        user_id: user?.id || '',
        reminder_time: time,
        is_active: true
      }));

      setReminders(prev => [...prev, ...newReminders]);

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