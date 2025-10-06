import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Target,
  Brain,
  AlertCircle,
  Zap,
  TrendingUp
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { EnhancedSmartSuggestion } from '@/hooks/useEnhancedSmartScheduling';
import { SmartSuggestionCard } from '@/components/ui/SmartSuggestionCard';
import { ConflictIndicator } from '@/components/ui/ConflictIndicator';

interface QuickCaptureResultsScreenProps {
  actions: NextStepsItem[];
  suggestions: Map<string, EnhancedSmartSuggestion[]>;
  onScheduleSelected: (actionIds: string[], selectedSuggestions: Map<string, EnhancedSmartSuggestion>) => Promise<void>;
  onViewInHub: () => void;
  isScheduling?: boolean;
}

export function QuickCaptureResultsScreen({
  actions,
  suggestions,
  onScheduleSelected,
  onViewInHub,
  isScheduling = false
}: QuickCaptureResultsScreenProps) {
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [selectedSuggestions, setSelectedSuggestions] = useState<Map<string, EnhancedSmartSuggestion>>(new Map());
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

  const actionableActions = actions.filter(a => a.category === 'action');
  const totalSuggestions = Array.from(suggestions.values()).reduce((sum, arr) => sum + arr.length, 0);

  const handleToggleAction = (actionId: string) => {
    const newSelected = new Set(selectedActions);
    if (newSelected.has(actionId)) {
      newSelected.delete(actionId);
      const newSuggestions = new Map(selectedSuggestions);
      newSuggestions.delete(actionId);
      setSelectedSuggestions(newSuggestions);
    } else {
      newSelected.add(actionId);
      // Auto-select top suggestion
      const topSuggestion = suggestions.get(actionId)?.[0];
      if (topSuggestion) {
        const newSuggestions = new Map(selectedSuggestions);
        newSuggestions.set(actionId, topSuggestion);
        setSelectedSuggestions(newSuggestions);
      }
    }
    setSelectedActions(newSelected);
  };

  const handleSelectSuggestion = (actionId: string, suggestion: EnhancedSmartSuggestion) => {
    const newSuggestions = new Map(selectedSuggestions);
    newSuggestions.set(actionId, suggestion);
    setSelectedSuggestions(newSuggestions);
    
    // Ensure action is selected
    if (!selectedActions.has(actionId)) {
      const newSelected = new Set(selectedActions);
      newSelected.add(actionId);
      setSelectedActions(newSelected);
    }
  };

  const handleSchedule = async () => {
    const actionIds = Array.from(selectedActions);
    await onScheduleSelected(actionIds, selectedSuggestions);
  };

  const toggleExpanded = (actionId: string) => {
    const newExpanded = new Set(expandedActions);
    if (newExpanded.has(actionId)) {
      newExpanded.delete(actionId);
    } else {
      newExpanded.add(actionId);
    }
    setExpandedActions(newExpanded);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="w-16 h-16 bg-brain-health-600 rounded-lg flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-display-md font-bold text-foreground">Recording Complete</h2>
        <p className="text-body-lg text-muted-foreground">
          {actions.length} action{actions.length !== 1 ? 's' : ''} extracted with {totalSuggestions} smart scheduling suggestions
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-memory-emerald-200 bg-memory-emerald-50 shadow-sm">
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 text-memory-emerald-600 mx-auto mb-2" />
            <div className="text-display-md font-bold text-memory-emerald-900">{actionableActions.length}</div>
            <div className="text-caption text-memory-emerald-700">Actions</div>
          </CardContent>
        </Card>
        <Card className="border-brain-health-200 bg-brain-health-50 shadow-sm">
          <CardContent className="pt-6 text-center">
            <Sparkles className="w-8 h-8 text-brain-health-600 mx-auto mb-2" />
            <div className="text-display-md font-bold text-brain-health-900">{totalSuggestions}</div>
            <div className="text-caption text-brain-health-700">AI Suggestions</div>
          </CardContent>
        </Card>
        <Card className="border-clarity-teal-200 bg-clarity-teal-50 shadow-sm">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 text-clarity-teal-600 mx-auto mb-2" />
            <div className="text-display-md font-bold text-clarity-teal-900">{selectedActions.size}</div>
            <div className="text-caption text-clarity-teal-700">Selected</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions with Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-primary" />
              Review & Schedule Actions
            </span>
            {selectedActions.size > 0 && (
              <Badge variant="secondary">
                {selectedActions.size} selected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {actionableActions.map((action) => {
              const actionSuggestions = suggestions.get(action.id) || [];
              const topSuggestion = actionSuggestions[0];
              const isSelected = selectedActions.has(action.id);
              const isExpanded = expandedActions.has(action.id);
              const selectedSuggestion = selectedSuggestions.get(action.id);

              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`border rounded-lg p-4 transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  {/* Action Header */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleAction(action.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{action.action_text}</h4>
                        {action.priority_level && (
                          <Badge variant="outline" className="text-xs">
                            Priority {action.priority_level}
                          </Badge>
                        )}
                      </div>

                      {/* Top Suggestion Preview */}
                      {topSuggestion && !isExpanded && (
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">AI Suggests:</span>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(topSuggestion.date)} at {formatTime(topSuggestion.time)}
                              </span>
                            </div>
                            <ConflictIndicator 
                              level={topSuggestion.conflictLevel}
                              size="sm"
                              showLabel={false}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {topSuggestion.reason}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {topSuggestion.confidence}% confidence
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(action.id)}
                              className="text-xs"
                            >
                              View {actionSuggestions.length - 1} more options
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Expanded Suggestions */}
                      {isExpanded && actionSuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-semibold text-foreground">Choose your preferred time:</h5>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(action.id)}
                              className="text-xs"
                            >
                              Show less
                            </Button>
                          </div>
                          {actionSuggestions.slice(0, 3).map((suggestion) => (
                            <div
                              key={suggestion.id}
                              onClick={() => handleSelectSuggestion(action.id, suggestion)}
                              className={`cursor-pointer transition-all ${
                                selectedSuggestion?.id === suggestion.id
                                  ? 'ring-2 ring-primary'
                                  : ''
                              }`}
                            >
                              <SmartSuggestionCard
                                suggestion={suggestion}
                                alternatives={[]}
                                onSchedule={async () => {
                                  handleSelectSuggestion(action.id, suggestion);
                                }}
                                isScheduling={false}
                                showAlternatives={false}
                              />
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onViewInHub}
          className="flex-1"
        >
          <Target className="w-5 h-5 mr-2" />
          Review in Next Steps Hub
        </Button>
        <Button
          size="lg"
          onClick={handleSchedule}
          disabled={selectedActions.size === 0 || isScheduling}
          variant="premium"
          className="flex-1"
        >
          {isScheduling ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Scheduling...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Schedule {selectedActions.size} Action{selectedActions.size !== 1 ? 's' : ''}
              <Calendar className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
