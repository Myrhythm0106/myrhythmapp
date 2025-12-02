import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, Bell, Clock, X, Volume2, 
  CheckCircle2, Timer, HelpCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { getEscalationMessage } from '@/data/reminderMotivations';
import { pushNotificationService } from '@/services/pushNotifications';
import { BrainHealthReminder } from '@/hooks/useBrainHealthReminders';

interface EscalatingReminderModalProps {
  reminder: BrainHealthReminder | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onSnooze: (minutes: number) => void;
  onNeedHelp: () => void;
}

const SNOOZE_OPTIONS = [
  { minutes: 5, label: '5 min' },
  { minutes: 10, label: '10 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 60, label: '1 hour' }
];

export function EscalatingReminderModal({
  reminder,
  isOpen,
  onClose,
  onComplete,
  onSnooze,
  onNeedHelp
}: EscalatingReminderModalProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const escalationLevel = reminder?.escalation_level || 0;

  // Vibrate on high escalation
  useEffect(() => {
    if (isOpen && escalationLevel >= 2) {
      pushNotificationService.vibrateForEscalation(escalationLevel);
    }
  }, [isOpen, escalationLevel]);

  // Get styling based on escalation level
  const getEscalationStyles = () => {
    switch (escalationLevel) {
      case 0:
        return {
          bgClass: 'bg-card',
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          headerBg: 'bg-primary/5',
          Icon: Bell
        };
      case 1:
        return {
          bgClass: 'bg-card',
          iconBg: 'bg-yellow-500/10',
          iconColor: 'text-yellow-600',
          headerBg: 'bg-yellow-500/5',
          Icon: Clock
        };
      case 2:
        return {
          bgClass: 'bg-orange-500/5',
          iconBg: 'bg-orange-500/20',
          iconColor: 'text-orange-600',
          headerBg: 'bg-orange-500/10',
          Icon: AlertCircle
        };
      case 3:
        return {
          bgClass: 'bg-destructive/5',
          iconBg: 'bg-destructive/20',
          iconColor: 'text-destructive',
          headerBg: 'bg-destructive/10',
          Icon: AlertCircle
        };
      default:
        return {
          bgClass: 'bg-card',
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          headerBg: 'bg-primary/5',
          Icon: Bell
        };
    }
  };

  const styles = getEscalationStyles();
  const escalationMessage = getEscalationMessage(escalationLevel);

  if (!reminder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-md p-0 overflow-hidden",
        styles.bgClass,
        escalationLevel >= 3 && "animate-pulse"
      )}>
        {/* Colored header */}
        <div className={cn("px-6 py-4", styles.headerBg)}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", styles.iconBg)}>
                <styles.Icon className={cn("h-6 w-6", styles.iconColor)} />
              </div>
              <div>
                <DialogTitle className="text-left text-lg">
                  {reminder.calendar_event?.title || 'Reminder'}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {reminder.calendar_event?.time} • {reminder.calendar_event?.date}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Escalation message */}
          <motion.div
            key={escalationLevel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-muted-foreground">{escalationMessage}</p>
          </motion.div>

          {/* Motivation context */}
          {reminder.original_motivation && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm text-center italic">
                💭 You said: "{reminder.original_motivation}"
              </p>
            </div>
          )}

          {/* Brain benefit */}
          {reminder.benefit_message && (
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground text-center">
                🧠 {reminder.benefit_message}
              </p>
            </div>
          )}

          {/* Escalation progress */}
          {escalationLevel > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Urgency Level</span>
                <span>{escalationLevel}/3</span>
              </div>
              <Progress 
                value={(escalationLevel / 3) * 100} 
                className={cn(
                  "h-2",
                  escalationLevel >= 2 && "[&>div]:bg-orange-500",
                  escalationLevel >= 3 && "[&>div]:bg-destructive"
                )}
              />
            </div>
          )}

          {/* Main action button - large and prominent */}
          <Button 
            onClick={onComplete}
            size="lg"
            className="w-full h-14 text-lg font-bold"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            I Did It! ✓
          </Button>

          {/* Snooze options */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">Snooze for:</p>
            <div className="flex gap-2">
              {SNOOZE_OPTIONS.map(option => (
                <Button
                  key={option.minutes}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => onSnooze(option.minutes)}
                >
                  <Timer className="h-3 w-3 mr-1" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Help button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={onNeedHelp}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            I Need Help With This
          </Button>

          {/* Escalation warning */}
          {escalationLevel >= 2 && (
            <p className="text-xs text-center text-muted-foreground">
              {escalationLevel === 2 
                ? "⚠️ Escalation active - we want to help you succeed"
                : "🚨 Your support circle will be notified to help"
              }
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
