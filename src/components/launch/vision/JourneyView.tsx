import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Target, Star, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Dream } from './DreamCard';

interface JourneyStep {
  type: 'dream' | 'goal' | 'priority' | 'action';
  title: string;
  progress?: number;
  completed?: boolean;
  items?: { id: string; title: string; completed: boolean }[];
}

interface JourneyViewProps {
  open: boolean;
  onClose: () => void;
  dream: Dream | null;
  linkedGoal?: {
    id: string;
    title: string;
    progress: number;
    priorities?: { id: string; title: string; status: string }[];
    actions?: { id: string; title: string; completed: boolean }[];
  };
}

export function JourneyView({
  open,
  onClose,
  dream,
  linkedGoal
}: JourneyViewProps) {
  if (!open || !dream) return null;

  const journeySteps: JourneyStep[] = [
    {
      type: 'dream',
      title: dream.title,
      progress: dream.progress
    }
  ];

  if (linkedGoal) {
    journeySteps.push({
      type: 'goal',
      title: linkedGoal.title,
      progress: linkedGoal.progress,
      items: linkedGoal.priorities?.map(p => ({
        id: p.id,
        title: p.title,
        completed: p.status === 'completed'
      }))
    });

    if (linkedGoal.actions && linkedGoal.actions.length > 0) {
      journeySteps.push({
        type: 'action',
        title: "Today's Actions",
        items: linkedGoal.actions.map(a => ({
          id: a.id,
          title: a.title,
          completed: a.completed
        }))
      });
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'dream': return <Sparkles className="h-5 w-5 text-white" />;
      case 'goal': return <Target className="h-5 w-5 text-white" />;
      case 'priority': return <Star className="h-5 w-5 text-white" />;
      case 'action': return <CheckCircle2 className="h-5 w-5 text-white" />;
      default: return <Circle className="h-5 w-5 text-white" />;
    }
  };

  const getStepGradient = (type: string) => {
    switch (type) {
      case 'dream': return 'from-neural-purple-500 to-neural-purple-600';
      case 'goal': return 'from-brain-health-500 to-brain-health-600';
      case 'priority': return 'from-brand-orange-500 to-brand-orange-600';
      case 'action': return 'from-memory-emerald-500 to-memory-emerald-600';
      default: return 'from-muted to-muted';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto max-h-[80vh] overflow-y-auto bg-card rounded-2xl shadow-xl border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{dream.emoji || '✨'}</div>
            <div>
              <h2 className="font-semibold text-foreground">Your Journey</h2>
              <p className="text-xs text-muted-foreground">Dream → Goal → Daily Actions</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Journey Visualization */}
        <div className="p-6">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-5 top-12 bottom-12 w-0.5 bg-gradient-to-b from-neural-purple-300 via-brain-health-300 to-memory-emerald-300" />

            {/* Steps */}
            <div className="space-y-6 relative">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      "bg-gradient-to-br shadow-md",
                      getStepGradient(step.type)
                    )}>
                      {getStepIcon(step.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium uppercase text-muted-foreground">
                          {step.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>

                      {/* Progress */}
                      {step.progress !== undefined && (
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-brain-health-600">{step.progress}%</span>
                          </div>
                          <Progress value={step.progress} className="h-2" />
                        </div>
                      )}

                      {/* Sub-items */}
                      {step.items && step.items.length > 0 && (
                        <div className="space-y-2 bg-muted/30 rounded-xl p-3">
                          {step.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              {item.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-memory-emerald-500" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={cn(
                                "text-sm",
                                item.completed 
                                  ? "text-muted-foreground line-through" 
                                  : "text-foreground"
                              )}>
                                {item.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* No linked goal message */}
          {!linkedGoal && (
            <div className="mt-6 p-4 bg-brain-health-50 border border-brain-health-200 rounded-xl text-center">
              <p className="text-sm text-brain-health-700 mb-2">
                This dream isn't linked to a goal yet
              </p>
              <p className="text-xs text-brain-health-600">
                Create a goal to track progress with daily actions
              </p>
            </div>
          )}

          {/* Motivational Footer */}
          <div className="mt-6 p-4 bg-gradient-to-r from-neural-purple-50 to-brain-health-50 rounded-xl">
            <p className="text-sm text-center text-foreground">
              "{dream.affirmation || 'Every small step brings you closer to your dream.'}"
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
