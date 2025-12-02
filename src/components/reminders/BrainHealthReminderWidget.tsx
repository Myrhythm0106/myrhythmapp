import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Bell, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBrainHealthReminders } from '@/hooks/useBrainHealthReminders';
import { ContextualReminderCard } from './ContextualReminderCard';
import { EscalatingReminderModal } from './EscalatingReminderModal';
import { ReminderCelebration } from './ReminderCelebration';
import { ReminderStreakDisplay } from './ReminderStreakDisplay';
import { PreReminderNudge } from './PreReminderNudge';

interface BrainHealthReminderWidgetProps {
  onCreateReminder?: () => void;
  showStreak?: boolean;
  maxReminders?: number;
}

export function BrainHealthReminderWidget({
  onCreateReminder,
  showStreak = true,
  maxReminders = 3
}: BrainHealthReminderWidgetProps) {
  const {
    upcomingReminders,
    isLoading,
    streaks,
    currentStreak,
    totalCompletions,
    activeEscalation,
    setActiveEscalation,
    completeReminder,
    snoozeReminder,
    requestHelp,
    dismissReminder
  } = useBrainHealthReminders();

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    title: string;
    isNewRecord: boolean;
  } | null>(null);
  const [preReminderVisible, setPreReminderVisible] = useState(false);
  const [preReminderData, setPreReminderData] = useState<{
    title: string;
    timeUntil: string;
    motivation?: string;
    location?: string;
  } | null>(null);

  // Handle completion with celebration
  const handleComplete = async (reminderId: string, title: string, category?: string) => {
    const previousStreak = currentStreak;
    await completeReminder(reminderId, category);
    
    // Show celebration
    const newStreak = currentStreak + 1;
    const longestStreak = Math.max(...streaks.map(s => s.longest_streak), 0);
    
    setCelebrationData({
      title,
      isNewRecord: newStreak > longestStreak
    });
    setShowCelebration(true);
  };

  // Get longest streak from all types
  const longestStreak = Math.max(...streaks.map(s => s.longest_streak), currentStreak);

  // Display limited reminders
  const displayReminders = upcomingReminders.slice(0, maxReminders);

  return (
    <div className="space-y-4">
      {/* Streak display */}
      {showStreak && (
        <ReminderStreakDisplay
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          totalCompletions={totalCompletions}
        />
      )}

      {/* Pre-reminder nudge (floating) */}
      <PreReminderNudge
        title={preReminderData?.title || ''}
        timeUntil={preReminderData?.timeUntil || ''}
        motivation={preReminderData?.motivation}
        location={preReminderData?.location}
        isVisible={preReminderVisible}
        onDismiss={() => setPreReminderVisible(false)}
      />

      {/* Upcoming reminders */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" />
              Brain-Health Reminders
            </CardTitle>
            {onCreateReminder && (
              <Button variant="ghost" size="sm" onClick={onCreateReminder}>
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading reminders...
            </div>
          ) : displayReminders.length === 0 ? (
            <div className="text-center py-6">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No upcoming reminders</p>
              {onCreateReminder && (
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={onCreateReminder}
                  className="mt-1"
                >
                  Create your first reminder
                </Button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayReminders.map(reminder => (
                <ContextualReminderCard
                  key={reminder.id}
                  title={reminder.calendar_event?.title || 'Reminder'}
                  time={reminder.calendar_event?.time || ''}
                  date={reminder.calendar_event?.date}
                  category={reminder.calendar_event?.category}
                  motivation={reminder.original_motivation}
                  location={reminder.location_context}
                  whoBenefits={reminder.who_benefits}
                  benefitMessage={reminder.benefit_message}
                  currentStreak={currentStreak}
                  escalationLevel={reminder.escalation_level}
                  onComplete={() => handleComplete(
                    reminder.id, 
                    reminder.calendar_event?.title || 'Task',
                    reminder.calendar_event?.category || undefined
                  )}
                  onSnooze={() => setActiveEscalation(reminder)}
                  onNeedHelp={() => requestHelp(reminder.id)}
                />
              ))}
            </AnimatePresence>
          )}

          {upcomingReminders.length > maxReminders && (
            <p className="text-xs text-center text-muted-foreground pt-2">
              +{upcomingReminders.length - maxReminders} more reminders
            </p>
          )}
        </CardContent>
      </Card>

      {/* Escalating reminder modal */}
      <EscalatingReminderModal
        reminder={activeEscalation}
        isOpen={!!activeEscalation}
        onClose={() => setActiveEscalation(null)}
        onComplete={() => {
          if (activeEscalation) {
            handleComplete(
              activeEscalation.id,
              activeEscalation.calendar_event?.title || 'Task',
              activeEscalation.calendar_event?.category || undefined
            );
          }
        }}
        onSnooze={(minutes) => {
          if (activeEscalation) {
            snoozeReminder(activeEscalation.id, minutes);
          }
        }}
        onNeedHelp={() => {
          if (activeEscalation) {
            requestHelp(activeEscalation.id);
          }
        }}
      />

      {/* Celebration modal */}
      <ReminderCelebration
        isOpen={showCelebration}
        onClose={() => {
          setShowCelebration(false);
          setCelebrationData(null);
        }}
        title={celebrationData?.title || ''}
        currentStreak={currentStreak}
        totalCompletions={totalCompletions}
        isNewRecord={celebrationData?.isNewRecord}
      />
    </div>
  );
}
