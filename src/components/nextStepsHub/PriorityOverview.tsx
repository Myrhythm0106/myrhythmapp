import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  ChevronDown, 
  ChevronRight,
  Check,
  Clock,
  Loader2,
  Sparkles
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { useActionCompletion } from '@/hooks/useActionCompletion';
import { getPersonaLanguage } from '@/utils/personaLanguage';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PriorityOverviewProps {
  actions: NextStepsItem[];
  onActionClick: (action: NextStepsItem) => void;
  onSchedule: (action: NextStepsItem) => void;
  onComplete: (action: NextStepsItem) => void;
  personaType?: string;
}

interface PriorityGroup {
  id: string;
  label: string;
  emoji: string;
  description: string;
  actions: NextStepsItem[];
  color: string;
}

export function PriorityOverview({ 
  actions, 
  onActionClick,
  onSchedule,
  onComplete,
  personaType = 'recovery'
}: PriorityOverviewProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('most-important');
  const [completingId, setCompletingId] = useState<string | null>(null);
  const { markActionComplete } = useActionCompletion();
  const language = getPersonaLanguage(personaType);

  // Filter to only pending actions
  const pendingActions = actions.filter(a => 
    a.status !== 'completed' && 
    a.status !== 'done' && 
    a.category === 'action'
  );

  // Group by priority (max 3 groups)
  const priorityGroups: PriorityGroup[] = [
    {
      id: 'most-important',
      label: 'Most Important',
      emoji: '🎯',
      description: 'Focus on these first',
      actions: pendingActions.filter(a => (a.priority_level || 5) <= 1),
      color: 'border-l-red-500'
    },
    {
      id: 'also-important',
      label: 'Also Important',
      emoji: '📋',
      description: 'When you have time',
      actions: pendingActions.filter(a => (a.priority_level || 5) === 2 || (a.priority_level || 5) === 3),
      color: 'border-l-amber-500'
    },
    {
      id: 'when-ready',
      label: 'When Ready',
      emoji: '💭',
      description: 'No pressure on these',
      actions: pendingActions.filter(a => (a.priority_level || 5) >= 4),
      color: 'border-l-blue-500'
    }
  ].filter(group => group.actions.length > 0);

  const handleComplete = async (action: NextStepsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completingId) return;
    
    setCompletingId(action.id!);
    try {
      const success = await markActionComplete(action.id!, action.action_text);
      if (success) {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 }
        });
        toast.success('🎉 Well done!', {
          description: language.progressAck || "You're making great progress!"
        });
        onComplete(action);
      }
    } finally {
      setCompletingId(null);
    }
  };

  if (priorityGroups.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">All caught up! 🎉</h3>
        <p className="text-muted-foreground">
          {language.progressAck || "You've completed everything. Amazing work!"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Warm Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold mb-2">Your Next Steps</h1>
        <p className="text-muted-foreground">
          {pendingActions.length} {pendingActions.length === 1 ? 'step' : 'steps'} organized by priority
        </p>
      </motion.div>

      {/* Priority Groups */}
      <div className="space-y-4">
        {priorityGroups.map((group, groupIndex) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <Card className={`overflow-hidden border-l-4 ${group.color}`}>
              {/* Group Header - Clickable */}
              <button
                onClick={() => setExpandedGroup(
                  expandedGroup === group.id ? null : group.id
                )}
                className="w-full text-left"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{group.emoji}</span>
                      <div>
                        <CardTitle className="text-lg">{group.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {group.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-sm">
                        {group.actions.length}
                      </Badge>
                      {expandedGroup === group.id ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedGroup === group.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-2 pb-4">
                      <div className="space-y-3">
                        {group.actions.slice(0, 5).map((action, index) => (
                          <motion.div
                            key={action.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            {/* Action Text */}
                            <div 
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => onActionClick(action)}
                            >
                              <p className="font-medium text-foreground truncate">
                                {action.action_text}
                              </p>
                              {action.due_context && (
                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {action.due_context}
                                </p>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSchedule(action);
                                }}
                                className="h-9 px-3"
                              >
                                <Clock className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={(e) => handleComplete(action, e)}
                                disabled={completingId === action.id}
                                className="h-9 px-3 bg-green-500 hover:bg-green-600 text-white"
                              >
                                {completingId === action.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </motion.div>
                        ))}

                        {/* Show more indicator */}
                        {group.actions.length > 5 && (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            +{group.actions.length - 5} more
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
