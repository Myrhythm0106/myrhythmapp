import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Check, 
  Clock, 
  ChevronRight, 
  Lightbulb,
  Heart,
  Loader2,
  Volume2
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { useAssessmentToScheduling } from '@/hooks/useAssessmentToScheduling';
import { useActionCompletion } from '@/hooks/useActionCompletion';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { getPersonaLanguage } from '@/utils/personaLanguage';
import { toast } from 'sonner';
import { celebrateSuccess, celebrateBigWin } from '@/utils/celebration';
import { speechService } from '@/utils/speechSynthesis';
import { VoiceCommandButton } from '@/components/voice/VoiceCommandButton';
import { VoiceCommandHints } from '@/components/voice/VoiceCommandHints';
import { SupportCircleQuickAssign } from './SupportCircleQuickAssign';
import { supabase } from '@/integrations/supabase/client';

interface FocusModeViewProps {
  actions: NextStepsItem[];
  onComplete: (action: NextStepsItem) => void;
  onLater: (action: NextStepsItem) => void;
  onViewAll: () => void;
  onSchedule: (action: NextStepsItem) => void;
  personaType?: string;
}

export function FocusModeView({ 
  actions, 
  onComplete, 
  onLater, 
  onViewAll,
  onSchedule,
  personaType = 'recovery'
}: FocusModeViewProps) {
  const [isCompleting, setIsCompleting] = React.useState(false);
  const [currentWatchers, setCurrentWatchers] = React.useState<string[]>([]);
  const { scheduleMapping, getScheduleReasoning } = useAssessmentToScheduling();
  const { markActionComplete } = useActionCompletion();
  const language = getPersonaLanguage(personaType);

  // Get the highest priority action that's not completed
  const pendingActions = actions.filter(a => 
    a.status !== 'completed' && 
    a.status !== 'done' && 
    a.category === 'action'
  );

  // Sort by priority (lower number = higher priority)
  const sortedActions = [...pendingActions].sort((a, b) => 
    (a.priority_level || 5) - (b.priority_level || 5)
  );

  const currentAction = sortedActions[0];
  const remainingCount = sortedActions.length - 1;
  const completedToday = actions.filter(a => a.status === 'completed' || a.status === 'done').length;

  // Load current watchers when action changes
  React.useEffect(() => {
    if (currentAction?.assigned_watchers) {
      setCurrentWatchers(currentAction.assigned_watchers);
    } else {
      setCurrentWatchers([]);
    }
  }, [currentAction?.id]);

  const handleComplete = async () => {
    if (!currentAction || isCompleting) return;
    
    setIsCompleting(true);
    try {
      const success = await markActionComplete(currentAction.id!, currentAction.action_text);
      if (success) {
        // Enhanced celebration based on progress
        if (remainingCount === 0) {
          celebrateBigWin();
          toast.success('All done! You are amazing!', {
            description: language.progressAck || "You have completed all your steps!"
          });
        } else {
          celebrateSuccess({ particleCount: 120, spread: 80 });
          toast.success('Amazing! You did it!', {
            description: language.progressAck || "Every step forward matters!"
          });
        }
        
        // Notify support circle if watchers assigned
        if (currentWatchers.length > 0) {
          await notifySupportCircle(currentAction, currentWatchers);
        }
        
        onComplete(currentAction);
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const handleReadAction = async () => {
    if (currentAction && speechService.isAvailable()) {
      await speechService.speak(currentAction.action_text, { rate: 0.8, volume: 0.9 });
    }
  };

  const handleShowHelp = () => {
    toast.info('Voice Commands', {
      description: 'Say "Done" to complete, "Skip" to move on, "Schedule" to plan, or "Read" to hear it.',
      duration: 5000,
    });
  };

  // Voice commands
  const { 
    isListening, 
    isSupported, 
    lastTranscript,
    startListening,
    stopListening,
    speakConfirmation 
  } = useVoiceCommands({
    onDone: handleComplete,
    onSkip: () => currentAction && onLater(currentAction),
    onSchedule: () => currentAction && onSchedule(currentAction),
    onRead: handleReadAction,
    onHelp: handleShowHelp,
  });

  // Notify support circle members
  const notifySupportCircle = async (action: NextStepsItem, watcherIds: string[]) => {
    try {
      // Create alert for each watcher
      for (const watcherId of watcherIds) {
        await supabase.from('accountability_alerts').insert({
          user_id: action.user_id,
          alert_type: 'action_completed',
          title: 'Step Completed!',
          message: `Great news! "${action.action_text}" has been completed.`,
          severity: 'info',
          target_members: [watcherId],
          related_id: action.id,
        });
      }
      
      speakConfirmation("Your support circle has been notified!");
    } catch (error) {
      console.error('Failed to notify support circle:', error);
    }
  };

  // Update watchers on database
  const handleWatchersChange = async (watchers: string[]) => {
    setCurrentWatchers(watchers);
    
    if (currentAction?.id) {
      try {
        await supabase
          .from('extracted_actions')
          .update({ assigned_watchers: watchers })
          .eq('id', currentAction.id);
      } catch (error) {
        console.error('Failed to update watchers:', error);
      }
    }
  };

  // Get suggested time reasoning
  const getTimeReasoning = () => {
    if (scheduleMapping?.displayReason) {
      return scheduleMapping.displayReason;
    }
    return "Take your time - no pressure";
  };

  if (!currentAction) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-6"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-3">
          Nothing pending - well done!
        </h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {language.progressAck || "You have accomplished so much. Take a moment to celebrate!"}
        </p>
        <Button variant="outline" onClick={onViewAll}>
          View completed steps
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-4 mb-6"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Check className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {completedToday} complete today
          </span>
        </div>
        {remainingCount > 0 && (
          <span className="text-sm text-muted-foreground">
            +{remainingCount} more
          </span>
        )}
      </motion.div>

      {/* Warm Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">
          {language.warmWelcome || "One step at a time"}
        </h1>
        <p className="text-muted-foreground">
          Focus on just this one thing. Everything else can wait.
        </p>
      </motion.div>

      {/* Main Focus Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAction.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
            {/* Priority indicator */}
            <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
            
            <CardContent className="p-6 md:p-8">
              {/* Action Title with Read Button */}
              <div className="flex items-start gap-3 mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed flex-1">
                  {currentAction.action_text}
                </h2>
                {speechService.isAvailable() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReadAction}
                    className="flex-shrink-0"
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* Schedule Reasoning */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl mb-6">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Suggested timing
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getTimeReasoning()}
                  </p>
                </div>
              </div>

              {/* Due context if available */}
              {currentAction.due_context && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Clock className="w-4 h-4" />
                  <span>{currentAction.due_context}</span>
                </div>
              )}

              {/* Support Circle Quick Assign */}
              <div className="mb-6">
                <SupportCircleQuickAssign
                  actionId={currentAction.id!}
                  currentWatchers={currentWatchers}
                  onWatchersChange={handleWatchersChange}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="flex-1 h-14 text-lg bg-green-500 hover:bg-green-600 text-white"
                >
                  {isCompleting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Check className="w-5 h-5 mr-2" />
                  )}
                  Done!
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onSchedule(currentAction)}
                  className="flex-1 h-14 text-lg"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Schedule
                </Button>
              </div>

              {/* Later option */}
              <button
                onClick={() => onLater(currentAction)}
                className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Voice Command Section */}
      {isSupported && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <VoiceCommandButton
            isListening={isListening}
            isSupported={isSupported}
            onToggle={isListening ? stopListening : startListening}
            lastTranscript={lastTranscript}
            size="large"
          />
          
          <VoiceCommandHints />
        </motion.div>
      )}

      {/* View All Link */}
      {remainingCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-muted-foreground hover:text-foreground"
          >
            See all steps
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
