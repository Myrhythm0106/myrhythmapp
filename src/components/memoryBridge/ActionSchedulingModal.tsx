import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, CheckCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { ExtractedAction } from '@/types/memoryBridge';
import { useActsScheduling } from '@/hooks/memoryBridge/useActsScheduling';
import { useAssessmentResults } from '@/hooks/useAssessmentResults';
import { AssessmentConfidenceBadge } from '@/components/nextStepsHub/AssessmentConfidenceBadge';
import { SmartScheduleSuggestion } from '@/utils/smartScheduler';

interface ActionSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: ExtractedAction[];
  onScheduleComplete: (scheduledActions: ExtractedAction[]) => void;
}

export function ActionSchedulingModal({
  isOpen,
  onClose,
  actions,
  onScheduleComplete
}: ActionSchedulingModalProps) {
  const [scheduleMode, setScheduleMode] = useState<'proposal' | 'review' | 'manual'>('proposal');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedWatchers, setSelectedWatchers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  
  const { generateSuggestionsForMultipleActions, suggestions, isLoading } = useActsScheduling();
  const isLoadingAny = Object.values(isLoading).some(loading => loading);
  const { assessmentResults } = useAssessmentResults();
  const latestAssessment = assessmentResults[0];
  
  // Generate AI suggestions when modal opens
  useEffect(() => {
    if (isOpen && actions.length > 0 && scheduleMode === 'proposal') {
      generateSuggestionsForMultipleActions(actions);
    }
  }, [isOpen, actions, scheduleMode]);
  
  // Auto-select all actions initially
  useEffect(() => {
    if (isOpen && actions.length > 0) {
      setSelectedActions(actions.map(a => a.id));
    }
  }, [isOpen, actions]);

  const toggleActionSelection = (actionId: string) => {
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleScheduleAllAsProposed = async () => {
    if (selectedActions.length === 0) {
      toast.error('Please select at least one action to schedule');
      return;
    }

    try {
      const scheduledActions = actions
        .filter(action => selectedActions.includes(action.id))
        .map(action => {
          const bestSuggestion = suggestions[action.id]?.[0];
          return {
            ...action,
            scheduled_date: bestSuggestion?.date || '',
            scheduled_time: bestSuggestion?.time || '',
            assigned_watchers: selectedWatchers
          };
        });

      onScheduleComplete(scheduledActions);
      toast.success(`🎉 Successfully scheduled ${selectedActions.length} actions as proposed!`);
      onClose();
    } catch (error) {
      console.error('Error scheduling actions:', error);
      toast.error('Failed to schedule actions. Please try again.');
    }
  };
  
  const handleScheduleWithAdjustments = async () => {
    if (selectedActions.length === 0) {
      toast.error('Please select at least one action to schedule');
      return;
    }

    try {
      const scheduledActions = actions
        .filter(action => selectedActions.includes(action.id))
        .map(action => ({
          ...action,
          scheduled_date: scheduleDate,
          scheduled_time: scheduleTime,
          assigned_watchers: selectedWatchers
        }));

      onScheduleComplete(scheduledActions);
      toast.success(`✅ Successfully scheduled ${selectedActions.length} actions with your adjustments!`);
      onClose();
    } catch (error) {
      console.error('Error scheduling actions:', error);
      toast.error('Failed to schedule actions. Please try again.');
    }
  };
  
  const toggleExpandAction = (actionId: string) => {
    setExpandedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800 border-red-200';
      case 2: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 4: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 5: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {scheduleMode === 'proposal' ? <Sparkles className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
            {scheduleMode === 'proposal' ? 'AI-Proposed Schedule' : 'Schedule Your Actions'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* AI Proposal Mode */}
          {scheduleMode === 'proposal' && (
            <>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 I've analyzed your calendar, energy patterns, and assessment preferences to suggest optimal times for these {selectedActions.length} actions.
                </p>
              </div>
              
              <div className="space-y-3">
                {actions
                  .filter(action => selectedActions.includes(action.id))
                  .map((action) => {
                    const bestSuggestion = suggestions[action.id]?.[0];
                    const isExpanded = expandedActions.has(action.id);
                    const alternatives = suggestions[action.id]?.slice(1, 3) || [];
                    
                    return (
                      <div key={action.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getPriorityColor(action.priority_level)}>
                                Priority {action.priority_level}
                              </Badge>
                              <Badge variant="outline">{action.action_type}</Badge>
                              {bestSuggestion?.assessmentAligned && (
                                <AssessmentConfidenceBadge 
                                  assessmentAligned={true}
                                  confidence={bestSuggestion.confidence / 100}
                                  reason={bestSuggestion.reason}
                                  timeSlot={`${bestSuggestion.date} ${bestSuggestion.time}`}
                                />
                              )}
                            </div>
                            <p className="font-medium mb-2">{action.action_text}</p>
                            
                            {bestSuggestion && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <span className="font-medium">
                                    {new Date(bestSuggestion.date).toLocaleDateString('en-US', { 
                                      weekday: 'short', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}, {bestSuggestion.time}
                                  </span>
                                </div>
                                
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="text-lg">{'⭐'.repeat(Math.ceil(bestSuggestion.confidence / 25))}</span>
                                  <span>Confidence: {bestSuggestion.confidence}%</span>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">
                                  💡 {bestSuggestion.reason}
                                </p>
                                
                                {bestSuggestion.conflictLevel !== 'none' && (
                                  <Badge variant={bestSuggestion.conflictLevel === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                                    ⚠️ {bestSuggestion.conflictLevel === 'high' ? 'High conflict with nearby events' : 'Low conflict - 1 nearby event'}
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            {isLoadingAny && !bestSuggestion && (
                              <p className="text-sm text-muted-foreground animate-pulse">
                                Analyzing optimal time...
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {alternatives.length > 0 && (
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpandAction(action.id)}
                              className="text-xs"
                            >
                              {isExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                              {isExpanded ? 'Hide' : 'View'} Alternative Times
                            </Button>
                            
                            {isExpanded && (
                              <div className="mt-2 space-y-2 pl-4 border-l-2 border-muted">
                                {alternatives.map((alt, idx) => (
                                  <div key={idx} className="text-sm space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-3 w-3" />
                                      <span className="font-medium">
                                        {new Date(alt.date).toLocaleDateString('en-US', { 
                                          weekday: 'short', 
                                          month: 'short', 
                                          day: 'numeric' 
                                        })}, {alt.time}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {'⭐'.repeat(Math.ceil(alt.confidence / 25))} {alt.confidence}%
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{alt.reason}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              
              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <div className="flex gap-3">
                  <Button 
                    variant="secondary"
                    onClick={() => setScheduleMode('review')}
                  >
                    📝 Review & Adjust Timings
                  </Button>
                  <Button 
                    onClick={handleScheduleAllAsProposed}
                    disabled={selectedActions.length === 0 || isLoadingAny}
                    className="bg-primary"
                  >
                    ✅ Schedule All as Proposed
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {/* Review/Manual Mode */}
          {scheduleMode === 'review' && (
            <>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Adjust the timing for your {selectedActions.length} selected actions below.
                </p>
              </div>
              
              {/* Action Selection */}
              <div>
                <Label className="text-base font-medium">Actions to Schedule</Label>
                <div className="mt-2 space-y-3">
                  {actions.map((action) => (
                    <div
                      key={action.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedActions.includes(action.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleActionSelection(action.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPriorityColor(action.priority_level)}>
                              Priority {action.priority_level}
                            </Badge>
                            <Badge variant="outline">
                              {action.action_type}
                            </Badge>
                            {action.proposed_date && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {action.proposed_date} {action.proposed_time}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {action.action_text}
                          </p>
                        </div>
                        {selectedActions.includes(action.id) && (
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduling Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule-date">Schedule Date</Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="schedule-time">Schedule Time</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Watcher Selection */}
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Select Watchers (Optional)
                </Label>
                <Select onValueChange={(value) => setSelectedWatchers([value])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose who should be notified..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accountability-partner">Accountability Partner</SelectItem>
                    <SelectItem value="team-lead">Team Lead</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="family">Family Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional context or reminders..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setScheduleMode('proposal')}
                >
                  ← Back to AI Proposal
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleScheduleWithAdjustments}
                    disabled={selectedActions.length === 0 || !scheduleDate || !scheduleTime}
                  >
                    Schedule {selectedActions.length} Action{selectedActions.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}