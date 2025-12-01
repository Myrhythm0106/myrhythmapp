import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Clock, 
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Loader2,
  Target,
  AlertCircle,
  Brain
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { useActionCompletion } from '@/hooks/useActionCompletion';
import { useAssessmentToScheduling } from '@/hooks/useAssessmentToScheduling';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface SimplifiedActionCardProps {
  action: NextStepsItem;
  onSchedule: (action: NextStepsItem) => void;
  onComplete: (action: NextStepsItem) => void;
  onViewDetails: (action: NextStepsItem) => void;
}

export function SimplifiedActionCard({ 
  action, 
  onSchedule,
  onComplete,
  onViewDetails
}: SimplifiedActionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { markActionComplete } = useActionCompletion();
  const { getScheduleReasoning } = useAssessmentToScheduling();

  const isCompleted = action.status === 'completed' || action.status === 'done';

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleting || isCompleted) return;
    
    setIsCompleting(true);
    try {
      const success = await markActionComplete(action.id!, action.action_text);
      if (success) {
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.8 }
        });
        toast.success('🎉 Done!');
        onComplete(action);
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const getCategoryIcon = () => {
    switch (action.category) {
      case 'action': return Target;
      case 'watch_out': return AlertCircle;
      case 'note': return Brain;
      default: return Target;
    }
  };

  const getCategoryColor = () => {
    switch (action.category) {
      case 'action': return 'text-emerald-600 bg-emerald-50';
      case 'watch_out': return 'text-amber-600 bg-amber-50';
      case 'note': return 'text-purple-600 bg-purple-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityLabel = () => {
    const level = action.priority_level || 5;
    if (level <= 1) return { label: 'Top Priority', color: 'bg-red-100 text-red-700' };
    if (level <= 3) return { label: 'Important', color: 'bg-amber-100 text-amber-700' };
    return { label: 'When Ready', color: 'bg-blue-100 text-blue-700' };
  };

  const IconComponent = getCategoryIcon();
  const priorityInfo = getPriorityLabel();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`transition-all duration-200 ${
        isCompleted ? 'opacity-60 bg-muted/30' : 'hover:shadow-md'
      }`}>
        <CardContent className="p-4">
          {/* Main Row - Always Visible */}
          <div className="flex items-start gap-3">
            {/* Category Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getCategoryColor()}`}>
              <IconComponent className="w-5 h-5" />
            </div>

            {/* Title and Status */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium leading-snug ${
                isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {action.action_text}
              </h3>
              
              {/* Minimal metadata - only essential info */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {action.category === 'action' && !isCompleted && (
                  <Badge variant="secondary" className={`text-xs ${priorityInfo.color}`}>
                    {priorityInfo.label}
                  </Badge>
                )}
                {action.due_context && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {action.due_context}
                  </span>
                )}
                {isCompleted && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    ✓ Completed
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!isCompleted && action.category === 'action' && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSchedule(action);
                  }}
                  className="h-10 w-10 p-0"
                >
                  <Clock className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white"
                >
                  {isCompleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Expand Toggle - Progressive Disclosure */}
          {!isCompleted && (action.motivation_statement || action.how_steps?.length) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Less details
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  More details
                </>
              )}
            </button>
          )}

          {/* Expanded Content - Hidden by Default */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t space-y-3">
                  {/* Schedule Reasoning */}
                  <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {getScheduleReasoning(action.scheduled_time || '10:00') || 
                       "Schedule this when you have good energy"}
                    </p>
                  </div>

                  {/* Why This Matters */}
                  {action.motivation_statement && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Why this matters
                      </p>
                      <p className="text-sm text-foreground">
                        {action.motivation_statement}
                      </p>
                    </div>
                  )}

                  {/* Steps */}
                  {action.how_steps && action.how_steps.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Quick steps
                      </p>
                      <ul className="space-y-1">
                        {action.how_steps.slice(0, 3).map((step, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* View Full Details */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(action)}
                    className="w-full text-muted-foreground"
                  >
                    View full details →
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
