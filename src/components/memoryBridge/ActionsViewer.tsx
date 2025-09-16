import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Target,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ExtractedAction } from '@/types/memoryBridge';

interface ActionsViewerProps {
  recordingId: string;
  meetingTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ActionsViewer({ 
  recordingId, 
  meetingTitle, 
  isOpen, 
  onClose
}: ActionsViewerProps) {
  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !recordingId) return;

    const fetchActions = async () => {
      setIsLoading(true);
      try {
        // Get meeting record first
        const { data: meetingRecording } = await supabase
          .from('meeting_recordings')
          .select('id')
          .eq('recording_id', recordingId)
          .single();

        if (meetingRecording) {
          // Get extracted actions
          const { data: actions } = await supabase
            .from('extracted_actions')
            .select('*')
            .eq('meeting_recording_id', meetingRecording.id)
            .order('priority_level', { ascending: true });

          setExtractedActions((actions || []) as ExtractedAction[]);
        }
      } catch (error) {
        console.error('Error fetching actions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActions();
  }, [recordingId, isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'confirmed':
      case 'pending':
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'on_hold':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const formatACTSAction = (action: ExtractedAction) => {
    return {
      assign: action.assigned_to || 'You',
      complete: action.due_context || action.scheduled_date || 'Set your timeline',
      track: generateTrackingMessage(action),
      status: action.status || 'ready to start'
    };
  };

  const generateTrackingMessage = (action: ExtractedAction) => {
    const empoweringMessages = [
      "🌟 Your brain loves consistency - check in daily to build this neural pathway stronger!",
      "💪 Each small step rewires your brain for success. Track your wins to boost confidence!",
      "🎯 Progress tracking isn't about perfection - it's about celebrating every step forward.",
      "✨ Your follow-through muscle gets stronger with every check-in. You're building real power!",
      "🚀 Small actions, tracked consistently, create breakthrough momentum. Keep going!",
      "🔥 Every progress update sends a signal to your brain: 'I keep my commitments!' Own that power.",
      "💎 Tracking progress turns ordinary actions into extraordinary self-trust. You've got this!",
      "⚡ Your brain craves the dopamine hit of progress updates. Give yourself that gift daily!"
    ];
    
    // Use action ID to get consistent message per action
    const messageIndex = action.id ? parseInt(action.id.slice(-1), 16) % empoweringMessages.length : 0;
    return empoweringMessages[messageIndex];
  };

  const getStructuredActionText = (action: ExtractedAction) => {
    // Use new structured fields if available, otherwise fallback to parsing
    const what = (action as any).what_outcome || action.action_text;
    const howSteps = (action as any).how_steps || [];
    const microTasks = (action as any).micro_tasks || [];
    
    // If we have structured steps, format them nicely
    let how = "";
    if (howSteps.length > 0) {
      how = howSteps.map((step: string, index: number) => `${index + 1}. ${step}`).join(', ');
    } else if (action.action_text.includes('|')) {
      // Fallback to old format parsing
      const [, howPart] = action.action_text.split('|').map(s => s.trim());
      how = howPart || "Take it step by step, following your own pace and style.";
    } else {
      how = action.relationship_impact || "Break this down into manageable steps that work for you.";
    }
    
    return { 
      what, 
      how,
      microTasks: Array.isArray(microTasks) ? microTasks : []
    };
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            ACTS Report: {meetingTitle}
            <Badge variant="outline" className="ml-2">
              {extractedActions.length} actions
            </Badge>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            <strong>A</strong>ssign • <strong>C</strong>omplete • <strong>T</strong>rack • <strong>S</strong>tatus - Brain injury support optimized
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-8 w-8 mx-auto mb-4 animate-pulse" />
                Analyzing your commitments...
              </div>
            ) : extractedActions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-4" />
                No actionable commitments found in this recording.
              </div>
            ) : (
              extractedActions.map((action, index) => {
                const actsData = formatACTSAction(action);
                const structuredAction = getStructuredActionText(action);
                
                return (
                  <Card key={action.id || index} className="border-l-4 border-l-primary bg-gradient-to-r from-background to-muted/20">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                           <div className="flex items-center gap-2">
                             <Sparkles className="h-4 w-4 text-primary" />
                             <span className="text-lg font-semibold">What needs to be done</span>
                           </div>
                           <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20 ml-6">
                             <p className="text-base font-semibold text-foreground">{structuredAction.what}</p>
                           </div>
                           
                           {structuredAction.how && (
                             <div className="pl-6 pt-2">
                               <div className="flex items-center gap-2 mb-2">
                                 <Target className="h-4 w-4 text-secondary-foreground" />
                                 <span className="text-sm font-semibold text-secondary-foreground">How to approach it step-by-step</span>
                               </div>
                               <div className="bg-secondary/50 p-3 rounded-lg border border-secondary/30">
                                 <p className="text-sm text-secondary-foreground leading-relaxed">{structuredAction.how}</p>
                               </div>
                             </div>
                           )}
                           
                           {structuredAction.microTasks && structuredAction.microTasks.length > 0 && (
                             <div className="pl-6 pt-2">
                               <div className="flex items-center gap-2 mb-2">
                                 <CheckCircle className="h-4 w-4 text-green-600" />
                                 <span className="text-sm font-semibold text-green-700">Start with these tiny steps</span>
                               </div>
                               <div className="space-y-1">
                                 {structuredAction.microTasks.map((task: string, index: number) => (
                                   <div key={index} className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                     {task}
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                        
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {action.priority_level <= 2 ? '🔥 High' : action.priority_level <= 3 ? '⚡ Medium' : '📋 Low'} Priority
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.round((action.confidence_score || 0) * 100)}% Confidence
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* ACTS Framework Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Assign */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-blue-700">A - Assign</span>
                              <p className="text-xs text-blue-600">Who's responsible?</p>
                            </div>
                          </div>
                          <div className="pl-11">
                            <p className="font-medium text-foreground">{actsData.assign}</p>
                          </div>
                        </div>

                        {/* Complete */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-orange-700">C - Complete</span>
                              <p className="text-xs text-orange-600">When is the deadline?</p>
                            </div>
                          </div>
                          <div className="pl-11">
                            <p className="font-medium text-foreground">{actsData.complete}</p>
                          </div>
                        </div>

                        {/* Track */}
                        <div className="space-y-3 md:col-span-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-green-700">T - Track</span>
                              <p className="text-xs text-green-600">Encouraging progress monitoring</p>
                            </div>
                          </div>
                          <div className="pl-11">
                            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                              <p className="font-medium text-green-800 leading-relaxed">
                                {actsData.track}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-3 md:col-span-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <Target className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-purple-700">S - Status</span>
                              <p className="text-xs text-purple-600">Current progress state</p>
                            </div>
                          </div>
                          <div className="pl-11">
                            <Badge className={`${getStatusColor(actsData.status)} border text-sm px-3 py-1`}>
                              {getStatusIcon(actsData.status)}
                              <span className="ml-2 capitalize font-medium">
                                {actsData.status.replace('_', ' ')}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Additional Context */}
                      {action.relationship_impact && structuredAction.how !== action.relationship_impact && (
                        <div className="pt-4 border-t border-muted">
                          <h5 className="text-sm font-semibold text-muted-foreground mb-2">Relationship Impact</h5>
                          <p className="text-sm text-muted-foreground">{action.relationship_impact}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}