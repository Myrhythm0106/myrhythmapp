import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Check, 
  Clock, 
  ChevronRight, 
  Lightbulb,
  Sparkles,
  Heart,
  Loader2
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { useAssessmentToScheduling } from '@/hooks/useAssessmentToScheduling';
import { useActionCompletion } from '@/hooks/useActionCompletion';
import { getPersonaLanguage } from '@/utils/personaLanguage';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

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

  const handleComplete = async () => {
    if (!currentAction || isCompleting) return;
    
    setIsCompleting(true);
    try {
      const success = await markActionComplete(currentAction.id!, currentAction.action_text);
      if (success) {
        // Celebrate!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success('🎉 Amazing! You did it!', {
          description: language.progressAck || "Every step forward matters!"
        });
        onComplete(currentAction);
      }
    } finally {
      setIsCompleting(false);
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
          Nothing pending - well done! 🎉
        </h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {language.progressAck || "You've accomplished so much. Take a moment to celebrate!"}
        </p>
        <Button variant="outline" onClick={onViewAll}>
          View completed steps
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Warm Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold mb-2">
          {language.warmWelcome || "One step at a time 💜"}
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
            
            <CardContent className="p-8">
              {/* Action Title - Large and Clear */}
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 leading-relaxed">
                {currentAction.action_text}
              </h2>

              {/* Schedule Reasoning - Visible WHY */}
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

              {/* Action Buttons - Large Touch Targets */}
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

              {/* Later option - subtle */}
              <button
                onClick={() => onLater(currentAction)}
                className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now →
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Remaining Count - Gentle, not overwhelming */}
      {remainingCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground mb-3">
            +{remainingCount} more {remainingCount === 1 ? 'step' : 'steps'} waiting
            <span className="text-primary ml-1">(no rush)</span>
          </p>
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
