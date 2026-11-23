import { closeLinkedAction } from '@/launch/reminders/closeLinkedAction';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bell, X, Clock, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSmartReminders } from '@/hooks/useSmartReminders';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { answerPatch } from '@/launch/reminders/reminderStages';
import { announceDiaryChange } from '@/launch/reminders/diarySync';

interface ReminderNotification {
  id: string;
  notification_type: string;
  data: {
    event_id?: string;
    event_title?: string;
    reminder_time?: string;
    action_id?: string;
  };
  created_at: string;
  is_read: boolean;
}

export function SmartReminderToast() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { dismissReminder, snoozeReminder } = useSmartReminders();
  const [activeNotification, setActiveNotification] = useState<ReminderNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('reminder-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cross_device_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const notification = payload.new as ReminderNotification;
          
          if (notification.notification_type === 'reminder') {
            setActiveNotification(notification);
            setIsVisible(true);
            
            // Auto-hide after 30 seconds
            setTimeout(() => {
              setIsVisible(false);
            }, 30000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleDismiss = async () => {
    if (activeNotification) {
      // Mark as read
      await supabase
        .from('cross_device_notifications')
        .update({ is_read: true })
        .eq('id', activeNotification.id);
    }
    setIsVisible(false);
    setActiveNotification(null);
  };

  const eventId = activeNotification?.data?.event_id;

  const handleSnooze = async (minutes: number) => {
    if (eventId) {
      // Same snooze as the in-app reminder card, saved on the diary item itself.
      const { error } = await supabase.from('calendar_events').update({
        reminder_status: 'snoozed', snoozed_until: new Date(Date.now() + minutes * 60_000).toISOString(),
        due_sent_at: null, followup_sent_at: null,
      }).eq('id', eventId);
      if (error) { toast.error("Couldn't save that. Please try again."); return; }
      announceDiaryChange('reminder-toast');
    }
    toast.success(`Reminding you in ${minutes} minutes`);
    handleDismiss();
  };

  const handleMarkDone = async () => {
    if (eventId) {
      // Done on a diary reminder ticks the diary item, exactly like Home and the reminder card.
      const { data: row } = await supabase.from('calendar_events')
        .select('date,time,prep_sent_at,due_sent_at,followup_sent_at').eq('id', eventId).maybeSingle();
      const { error } = row
        ? await supabase.from('calendar_events').update(answerPatch(row, 'done', new Date()) as never).eq('id', eventId)
        : { error: new Error('missing') };
      if (error) { toast.error("Couldn't save that. Please try again."); return; }
      announceDiaryChange('reminder-toast');
      const closed = await closeLinkedAction(eventId, 'done');
      if (!closed) toast.success('Done. Well followed through.');
    } else if (activeNotification?.data?.action_id) {
      try {
        await supabase
          .from('daily_actions')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', activeNotification.data.action_id);
        
        toast.success('Marked as complete! 🎉');
      } catch (error) {
        console.error('Error marking complete:', error);
      }
    }
    handleDismiss();
  };

  const handleViewDetails = () => {
    if (activeNotification?.data?.event_id) {
      navigate('/launch/calendar?view=day');
    }
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && activeNotification && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-4 left-1/2 z-[100] w-full max-w-md px-4"
        >
          <div className="bg-background border-2 border-primary/30 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-medium text-foreground">Reminder</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {activeNotification.data?.event_title || 'Upcoming task'}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {activeNotification.data?.reminder_time || 'Starting soon'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={handleMarkDone}
                >
                  <Check className="h-4 w-4" />
                  Done
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSnooze(15)}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  15 min
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewDetails}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
