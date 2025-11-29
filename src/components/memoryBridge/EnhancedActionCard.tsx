import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Heart, 
  AlertCircle,
  Target,
  TrendingUp,
  Calendar,
  Flag,
  Check,
  Loader2
} from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';
import { analyzeSMART, getSMARTColor, getSMARTLabel } from '@/utils/smartValidation';
import { celebrateActionComplete, celebrateBigWin } from '@/utils/celebration';
import { toast } from 'sonner';

interface EnhancedActionCardProps {
  action: ExtractedAction;
  onUpdate?: (updates: Partial<ExtractedAction>) => void;
  onMarkComplete?: (actionId: string, actionTitle: string) => Promise<boolean>;
  compact?: boolean;
  layout?: 'card' | 'list';
}

export function EnhancedActionCard({ action, onUpdate, onMarkComplete, compact = false, layout = 'card' }: EnhancedActionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const isCompleted = action.status === 'completed' || action.status === 'done';
  
  const smartAnalysis = analyzeSMART({
    action_text: action.action_text,
    assigned_to: action.assigned_to,
    start_date: action.start_date,
    end_date: action.end_date,
    priority_level: action.priority_level,
    relationship_impact: action.relationship_impact,
    verb_category: action.verb_category,
    completion_criteria_specific: action.completion_criteria_specific
  });

  const confidenceScore = action.confidence_score || 0;
  const isHighConfidence = confidenceScore >= 0.8;
  const isMediumConfidence = confidenceScore >= 0.6 && confidenceScore < 0.8;
  const isLowConfidence = confidenceScore < 0.6;

  const handleComplete = async () => {
    if (isCompleting || isCompleted) return;
    
    setIsCompleting(true);
    try {
      if (onMarkComplete) {
        const success = await onMarkComplete(action.id, action.action_text);
        if (success) {
          // Big celebration for completed actions!
          celebrateBigWin();
          toast.success('🎉 Amazing! Action completed!', {
            description: action.assigned_watchers?.length 
              ? 'Your support circle has been notified!' 
              : 'Keep up the great momentum!'
          });
        }
      } else {
        // Fallback to simple update
        celebrateActionComplete();
        toast.success('🎉 Action completed! Great work!');
        onUpdate?.({ status: 'completed' });
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const getConfidenceBadge = () => {
    if (isHighConfidence) {
      return <Badge className="bg-green-500/10 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> High Confidence</Badge>;
    } else if (isMediumConfidence) {
      return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200"><AlertCircle className="w-3 h-3 mr-1" /> Review Suggested</Badge>;
    } else {
      return <Badge className="bg-orange-500/10 text-orange-700 border-orange-200"><AlertCircle className="w-3 h-3 mr-1" /> Needs Clarification</Badge>;
    }
  };

  const getCategoryIcon = () => {
    switch (action.category) {
      case 'action': return <Flag className="w-4 h-4" />;
      case 'watch_out': return <AlertCircle className="w-4 h-4" />;
      case 'depends_on': return <Clock className="w-4 h-4" />;
      case 'note': return <Target className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  const getCategoryBadge = () => {
    const icons = {
      action: '✅',
      watch_out: '⚠️',
      depends_on: '🔗',
      note: '📝'
    };
    const labels = {
      action: 'Action',
      watch_out: 'Watch Out',
      depends_on: 'Depends On',
      note: 'Note'
    };
    return <Badge variant="outline" className="gap-1">{icons[action.category || 'action']} {labels[action.category || 'action']}</Badge>;
  };

  return (
    <TooltipProvider>
      <Card className={`transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${
        isHighConfidence ? 'border-green-200 bg-green-50/30' : 
        isMediumConfidence ? 'border-yellow-200 bg-yellow-50/30' : 
        'border-orange-200 bg-orange-50/30'
      }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getCategoryBadge()}
              {action.verb_category && (
                <Badge variant="secondary" className="text-xs">{action.verb_category}</Badge>
              )}
              {getConfidenceBadge()}
            </div>
            <CardTitle className="text-xl font-bold leading-tight">
              {action.action_text}
            </CardTitle>
            {action.motivation_statement && (
              <CardDescription className="mt-2 flex items-start gap-2">
                <Heart className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>{action.motivation_statement}</span>
              </CardDescription>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex-shrink-0"
                  aria-label={isExpanded ? "Collapse details" : "Expand details"}
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isExpanded ? "Hide details" : "Show details"}
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

      <CardContent className="space-y-4">
        {/* 2-Minute Starter - Always Visible for Actions */}
        {action.two_minute_starter && action.category === 'action' && (
          <div className="p-3 bg-gradient-to-r from-memory-emerald-500/10 to-brain-health-500/10 rounded-lg border border-memory-emerald-200">
            <div className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-memory-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-memory-emerald-900">Start with just 2 minutes:</p>
                <p className="text-sm text-memory-emerald-800 mt-1">{action.two_minute_starter}</p>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Phrasings for Low Confidence */}
        {isLowConfidence && action.alternative_phrasings && action.alternative_phrasings.length > 0 && (
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="font-semibold text-sm text-orange-900 mb-2">💡 Alternative ways to phrase this:</p>
            <div className="space-y-2">
              {action.alternative_phrasings.map((alt, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => onUpdate?.({ action_text: alt.text })}
                >
                  {alt.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Info Bar */}
        <div className="flex flex-wrap gap-2 text-sm">
          {action.assigned_to && (
            <Badge variant="outline" className="gap-1">
              👤 {action.assigned_to}
            </Badge>
          )}
          {action.completion_date && (
            <Badge variant="outline" className="gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(action.completion_date).toLocaleDateString()}
            </Badge>
          )}
          {action.priority_level && (
            <Badge variant="outline" className={action.priority_level <= 2 ? 'border-red-300 text-red-700' : 'border-gray-300'}>
              {action.priority_level <= 2 ? '🔴 High' : action.priority_level <= 3 ? '🟡 Medium' : '🟢 Low'} Priority
            </Badge>
          )}
          {action.assigned_watchers && action.assigned_watchers.length > 0 && (
            <Badge variant="outline" className="gap-1 border-purple-300 text-purple-700">
              👀 {action.assigned_watchers.length} watcher{action.assigned_watchers.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Mark Complete Button - Prominent */}
        {action.category === 'action' && !isCompleted && (
          <Button
            onClick={handleComplete}
            disabled={isCompleting}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Mark Complete
              </>
            )}
          </Button>
        )}

        {/* Completed Badge */}
        {isCompleted && (
          <div className="flex items-center justify-center gap-2 p-3 bg-green-100 rounded-lg border border-green-300">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Completed!</span>
            {action.completion_date && (
              <span className="text-sm text-green-600">
                on {new Date(action.completion_date).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {/* SMART Score */}
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
          <span className="text-sm font-medium">SMART Score:</span>
          <Badge className={getSMARTColor(smartAnalysis.score)}>
            {smartAnalysis.score}/100 - {getSMARTLabel(smartAnalysis.score)}
          </Badge>
        </div>

        {/* Expanded Details */}
        <Collapsible open={isExpanded}>
          <CollapsibleContent className="space-y-4 pt-2">
            {/* Completion Criteria */}
            {(action.completion_criteria_specific || action.success_criteria) && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-green-900">You'll know you're done when:</p>
                    <p className="text-sm text-green-800 mt-1">
                      {action.completion_criteria_specific || action.success_criteria}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* How Steps */}
            {action.how_steps && action.how_steps.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Step-by-Step:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  {action.how_steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Potential Barriers */}
            {action.potential_barriers && action.potential_barriers.length > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="font-semibold text-sm text-yellow-900 mb-2">⚠️ Watch out for:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                  {action.potential_barriers.map((barrier, idx) => (
                    <li key={idx}>{barrier}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* If Stuck */}
            {action.if_stuck && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-blue-900">If you get stuck:</p>
                    <p className="text-sm text-blue-800 mt-1">{action.if_stuck}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Best Time */}
            {action.best_time && (
              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                <p className="text-sm">
                  <Clock className="w-3 h-3 inline mr-1" />
                  <span className="font-semibold">Best time:</span> {action.best_time}
                </p>
              </div>
            )}

            {/* Momentum Builder */}
            {action.momentum_builder && (
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Build momentum:</p>
                    <p className="text-sm text-muted-foreground mt-1">{action.momentum_builder}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Celebration Trigger */}
            {action.celebration_trigger && (
              <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-orange-900">Celebrate your win:</p>
                    <p className="text-sm text-orange-800 mt-1">{action.celebration_trigger}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Natural Steps */}
            {action.next_natural_steps && action.next_natural_steps.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> What comes next:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {action.next_natural_steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Context & Impact */}
            {(action.emotional_stakes || action.relationship_impact || action.intent_behind) && (
              <div className="space-y-2 pt-2 border-t">
                <p className="font-semibold text-sm">Why this matters:</p>
                {action.emotional_stakes && (
                  <p className="text-sm text-muted-foreground">💭 {action.emotional_stakes}</p>
                )}
                {action.relationship_impact && (
                  <p className="text-sm text-muted-foreground">🤝 {action.relationship_impact}</p>
                )}
                {action.intent_behind && (
                  <p className="text-sm text-muted-foreground">🎯 {action.intent_behind}</p>
                )}
              </div>
            )}

            {/* SMART Suggestions */}
            {smartAnalysis.suggestions.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-sm text-blue-900 mb-2">💡 To make this even better:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  {smartAnalysis.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
}
