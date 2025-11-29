import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Bell, Check, ArrowRight, Sparkles } from 'lucide-react';
import { PersonaType, getPersonaLanguage } from '@/utils/personaLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSmartReminders } from '@/hooks/useSmartReminders';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { celebrateBigWin } from '@/utils/celebration';
import { format, addDays } from 'date-fns';

interface FirstVictoryCelebrationProps {
  action: {
    id: string;
    action_text: string;
    proposed_date?: string;
    proposed_time?: string;
    priority_level?: number;
  };
  persona: PersonaType;
}

export function FirstVictoryCelebration({ action, persona }: FirstVictoryCelebrationProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createDefaultReminders } = useSmartReminders();
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  const personaLang = getPersonaLanguage(persona);

  // Trigger celebration on mount
  useEffect(() => {
    celebrateBigWin();
  }, []);

  // Smart date suggestion based on action text and persona
  const getSuggestedDateTime = () => {
    if (action.proposed_date && action.proposed_time) {
      return {
        date: action.proposed_date,
        time: action.proposed_time
      };
    }

    // Default smart suggestions
    const now = new Date();
    let suggestedDate = addDays(now, 1); // Tomorrow by default
    let suggestedTime = '09:00';

    // Adjust based on persona
    if (persona === 'student') {
      suggestedTime = '16:00'; // After school
    } else if (persona === 'executive') {
      suggestedTime = '08:00'; // Morning meeting prep
    } else if (persona === 'recovery') {
      suggestedTime = '10:00'; // Mid-morning, low pressure
    } else if (persona === 'caregiver') {
      suggestedTime = '14:00'; // Afternoon, after lunch routines
    }

    return {
      date: format(suggestedDate, 'yyyy-MM-dd'),
      time: suggestedTime
    };
  };

  const { date, time } = getSuggestedDateTime();

  const handleScheduleAndRemind = async () => {
    if (!user?.id) return;

    setIsScheduling(true);

    try {
      // Create calendar event
      const { data: event, error: eventError } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: action.action_text,
          date,
          time,
          type: 'action',
          is_system_generated: true,
          description: `${personaLang.action} from your first recording`
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Update the extracted action with the calendar event
      await supabase
        .from('extracted_actions')
        .update({
          scheduled_date: date,
          scheduled_time: time,
          calendar_event_id: event.id,
          status: 'scheduled'
        })
        .eq('id', action.id);

      // Create default reminders
      await createDefaultReminders(event.id);

      // Mark onboarding as complete
      localStorage.setItem('myrhythm_onboarding_completed', 'true');
      localStorage.setItem('myrhythm_first_action_scheduled', 'true');

      if (user?.id) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id);
      }

      setIsScheduled(true);
      toast.success(`${personaLang.victory} ${personaLang.victoryEmoji}`);

      // Navigate after a short delay
      setTimeout(() => {
        navigate('/calendar');
      }, 2000);
    } catch (error) {
      console.error('Scheduling error:', error);
      toast.error('Failed to schedule. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleSkipToApp = () => {
    localStorage.setItem('myrhythm_onboarding_completed', 'true');
    navigate('/quick-capture');
  };

  return (
    <Card className="border-2 border-primary/30 shadow-xl overflow-hidden">
      <CardContent className="p-0">
        {/* Victory Header */}
        <div className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 p-6 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center"
          >
            <Sparkles className="h-10 w-10" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-2"
          >
            {personaLang.victory} {personaLang.victoryEmoji}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/90"
          >
            We captured your first {personaLang.action.toLowerCase()}!
          </motion.p>
        </div>

        {/* Action Card */}
        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-muted/30 rounded-lg p-4 border border-border"
          >
            <p className="font-medium text-foreground text-lg">
              "{action.action_text}"
            </p>
          </motion.div>

          {/* Suggested Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <h3 className="font-medium text-foreground">Suggested time:</h3>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(date), 'EEEE, MMM d')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-primary">
              <Bell className="h-4 w-4" />
              <span>We'll remind you 15 minutes before</span>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            {!isScheduled ? (
              <>
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleScheduleAndRemind}
                  disabled={isScheduling}
                >
                  {isScheduling ? (
                    <>Scheduling...</>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      {personaLang.schedule} & Set Reminder
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleSkipToApp}
                >
                  Skip for now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Scheduled with reminders!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Taking you to your calendar...
                </p>
              </div>
            )}
          </motion.div>

          {/* Encouragement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-muted-foreground"
          >
            {personaLang.encouragement}
          </motion.p>
        </div>
      </CardContent>
    </Card>
  );
}
