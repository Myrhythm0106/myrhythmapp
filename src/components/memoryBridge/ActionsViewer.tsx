import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Sparkles,
  GripVertical,
  LayoutGrid,
  TableIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { NextStepsItem } from '@/types/memoryBridge';
import { EditableField } from './EditableField';
import { ActionWatcherSelector } from './ActionWatcherSelector';
import { ActionCommentsSection } from './ActionCommentsSection';
import { ActionsTableView } from './ActionsTableView';
import { toast } from 'sonner';

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
  const [extractedActions, setExtractedActions] = useState<NextStepsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortField, setSortField] = useState<'priority' | 'status' | 'date'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const statusOptions = [
    { value: 'not_started', label: 'Ready to Begin' },
    { value: 'doing', label: 'In My Flow' },
    { value: 'done', label: 'Accomplished!' },
    { value: 'on_hold', label: 'Paused Mindfully' },
    { value: 'cancelled', label: 'Redirected Energy' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  useEffect(() => {
    if (!isOpen || !recordingId) return;

    const fetchActions = async () => {
      setIsLoading(true);
      try {
        const { data: meetingRecording } = await supabase
          .from('meeting_recordings')
          .select('id')
          .eq('recording_id', recordingId)
          .single();

        if (meetingRecording) {
          const { data: actions } = await supabase
            .from('extracted_actions')
            .select('*')
            .eq('meeting_recording_id', meetingRecording.id)
            .order('priority_level', { ascending: true });

          setExtractedActions((actions || []).map(action => ({ 
            ...action, 
            category: (action.category || 'action') as 'action' | 'watch_out' | 'depends_on' | 'note',
            action_type: action.action_type as 'commitment' | 'promise' | 'task' | 'reminder' | 'follow_up',
            status: action.status as 'done' | 'doing' | 'on_hold' | 'confirmed' | 'pending' | 'rejected' | 'modified' | 'scheduled' | 'not_started' | 'cancelled',
            detail_level: (action.detail_level || 'standard') as 'minimal' | 'standard' | 'complete',
            alternative_phrasings: Array.isArray(action.alternative_phrasings) 
              ? (action.alternative_phrasings as Array<{ text: string; confidence: number }>)
              : []
          })));
        }
      } catch (error) {
        console.error('Error fetching actions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActions();
  }, [recordingId, isOpen]);

  const updateAction = async (actionId: string, updates: Partial<NextStepsItem>) => {
    try {
      const { error } = await supabase
        .from('extracted_actions')
        .update(updates)
        .eq('id', actionId);

      if (error) throw error;

      setExtractedActions(actions => 
        actions.map(action => 
          action.id === actionId ? { ...action, ...updates } : action
        )
      );

      toast.success('Action updated');
    } catch (error) {
      console.error('Error updating action:', error);
      toast.error('Failed to update action');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(extractedActions);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    // Update priority_level based on new positions
    const updates = reordered.map((action, index) => ({
      id: action.id,
      priority_level: index + 1
    }));

    setExtractedActions(reordered);

    // Save to database
    try {
      for (const update of updates) {
        await supabase
          .from('extracted_actions')
          .update({ priority_level: update.priority_level })
          .eq('id', update.id);
      }
      toast.success('Priority order updated!');
    } catch (error) {
      console.error('Error updating priority order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleSort = (field: 'priority' | 'status' | 'date') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = (actionId: string, status: string) => {
    updateAction(actionId, { status: status as any });
  };

  const handleWatchersChange = (actionId: string, watchers: string[]) => {
    updateAction(actionId, { assigned_watchers: watchers });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200 shadow-memory-emerald-500/20';
      case 'doing':
        return 'bg-neural-blue-100 text-neural-blue-700 border-neural-blue-200 shadow-neural-blue-500/20';
      case 'on_hold':
        return 'bg-amber-100 text-amber-700 border-amber-200 shadow-amber-500/20';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200 shadow-red-500/20';
      default:
        return 'bg-muted text-muted-foreground border-muted shadow-none';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-4 w-4" />;
      case 'doing':
        return <Clock className="h-4 w-4" />;
      case 'on_hold':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStructuredActionText = (action: NextStepsItem) => {
    const what = action.what_outcome || action.action_text;
    const howSteps = action.how_steps || [];
    
    let microTasks: Array<{text: string; completed: boolean}> = [];
    try {
      if (action.micro_tasks) {
        if (Array.isArray(action.micro_tasks)) {
          microTasks = (action.micro_tasks as any[]).map(task => 
            typeof task === 'string' 
              ? { text: task, completed: false }
              : { text: task.text || '', completed: task.completed || false }
          );
        }
      }
    } catch (e) {
      console.warn('Error parsing micro_tasks:', e);
    }
    
    let how = "";
    if (howSteps.length > 0) {
      how = howSteps.map((step: string, index: number) => `${index + 1}. ${step}`).join(', ');
    } else if (action.action_text.includes('|')) {
      const [, howPart] = action.action_text.split('|').map(s => s.trim());
      how = howPart || "Take it step by step, following your own pace and style.";
    } else {
      how = action.relationship_impact || "Break this down into manageable steps that work for you.";
    }
    
    return { what, how, microTasks };
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl border border-white/40 shadow-2xl">
        {/* Premium header */}
        <DialogHeader className="relative pb-4 border-b border-white/40">
          {/* Neural pathway decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M10,50 Q30,20 50,50 T90,50" stroke="currentColor" fill="none" strokeWidth="2" className="text-neural-purple-500" />
              <path d="M10,60 Q30,30 50,60 T90,60" stroke="currentColor" fill="none" strokeWidth="1" className="text-brand-orange-500" />
            </svg>
          </div>
          
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 rounded-xl shadow-lg shadow-brand-orange-500/30">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">Next Step Summary</span>
                <span className="text-sm text-muted-foreground ml-2">• {meetingTitle}</span>
              </div>
              <Badge className="bg-gradient-to-r from-brand-orange-100 to-brand-orange-50 text-brand-orange-700 border border-brand-orange-200 shadow-sm">
                {extractedActions.length} actions
              </Badge>
            </div>
            
            {/* View toggle */}
            <div className="flex gap-1 p-1 bg-muted/50 rounded-lg backdrop-blur-sm">
              <Button 
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className={cn(
                  "transition-all duration-200",
                  viewMode === 'cards' && "bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 text-white shadow-md"
                )}
              >
                <LayoutGrid className="h-4 w-4 mr-1" /> Cards
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn(
                  "transition-all duration-200",
                  viewMode === 'table' && "bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 text-white shadow-md"
                )}
              >
                <TableIcon className="h-4 w-4 mr-1" /> Table
              </Button>
            </div>
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to reorder • <strong>W</strong>hat • <strong>W</strong>ho • <strong>W</strong>hen — Brain-friendly and empowering
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 max-h-[calc(95vh-140px)]">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-4 animate-pulse text-brand-orange-500" />
              Analyzing your commitments...
            </div>
          ) : extractedActions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-4" />
              No actionable commitments found in this recording.
            </div>
          ) : viewMode === 'table' ? (
            <ActionsTableView
              actions={extractedActions}
              onDragEnd={handleDragEnd}
              onStatusChange={handleStatusChange}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="actions-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6 py-2">
                    {extractedActions.map((action, index) => {
                      const structuredAction = getStructuredActionText(action);
                      
                      return (
                        <Draggable key={action.id} draggableId={action.id!} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "relative transition-all duration-200",
                                snapshot.isDragging && "shadow-2xl scale-[1.02] rotate-1 z-50"
                              )}
                            >
                              {/* Premium action card */}
                              <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-xl">
                                {/* Glass reflection */}
                                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
                                
                                {/* Drag handle bar */}
                                <div 
                                  {...provided.dragHandleProps}
                                  className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-muted/50 to-transparent flex items-center justify-center cursor-grab active:cursor-grabbing hover:from-brand-orange-100/50 transition-colors"
                                >
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                
                                <div className="pl-10 pr-4 py-5 space-y-4">
                                  {/* Header with status and priority */}
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-4">
                                      {/* ACTION block - Premium burnt orange glass */}
                                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-orange-50/90 to-brand-orange-100/70 backdrop-blur-sm border border-brand-orange-200/50 shadow-lg p-5">
                                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                        <div className="relative z-10">
                                          <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 bg-brand-orange-500 rounded-lg shadow-md">
                                              <Sparkles className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="font-bold text-brand-orange-700 uppercase text-sm tracking-wide">ACTION</span>
                                          </div>
                                          <EditableField
                                            value={action.action_text}
                                            onSave={(value) => updateAction(action.id!, { action_text: value })}
                                            type="textarea"
                                            placeholder="Enter action..."
                                            className="text-lg font-bold text-foreground"
                                          />
                                        </div>
                                      </div>

                                      {/* SUCCESS CRITERIA - Emerald glass */}
                                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-memory-emerald-50/90 to-memory-emerald-100/70 backdrop-blur-sm border border-memory-emerald-200/50 shadow-lg p-4">
                                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                        <div className="relative z-10">
                                          <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="h-4 w-4 text-memory-emerald-600" />
                                            <span className="font-semibold text-memory-emerald-700 text-sm">YOU'LL KNOW YOU'RE DONE WHEN</span>
                                          </div>
                                          <EditableField
                                            value={action.success_criteria || ''}
                                            onSave={(value) => updateAction(action.id!, { success_criteria: value })}
                                            type="textarea"
                                            placeholder="Define success criteria..."
                                            className="text-sm"
                                          />
                                        </div>
                                      </div>

                                      {/* MOTIVATION - Amber glass */}
                                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50/90 to-amber-100/70 backdrop-blur-sm border border-amber-200/50 shadow-lg p-4">
                                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                        <div className="relative z-10">
                                          <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="h-4 w-4 text-amber-600" />
                                            <span className="font-semibold text-amber-700 text-sm">THIS WILL HELP YOU</span>
                                          </div>
                                          <EditableField
                                            value={action.motivation_statement || ''}
                                            onSave={(value) => updateAction(action.id!, { motivation_statement: value })}
                                            type="textarea"
                                            placeholder="Why this matters to you..."
                                            className="text-sm font-medium"
                                          />
                                        </div>
                                      </div>

                                      {/* TIMELINE - Neural blue glass */}
                                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-neural-blue-50/90 to-neural-blue-100/70 backdrop-blur-sm border border-neural-blue-200/50 shadow-lg p-4">
                                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                        {/* Neural pathway decoration */}
                                        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10">
                                          <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <circle cx="80" cy="80" r="15" fill="currentColor" className="text-neural-blue-500" />
                                            <circle cx="60" cy="60" r="8" fill="currentColor" className="text-neural-blue-400" />
                                            <path d="M60,60 L80,80" stroke="currentColor" strokeWidth="2" className="text-neural-blue-400" />
                                          </svg>
                                        </div>
                                        <div className="relative z-10">
                                          <div className="flex items-center gap-2 mb-3">
                                            <Calendar className="h-4 w-4 text-neural-blue-600" />
                                            <span className="font-semibold text-neural-blue-700 text-sm">TIMELINE</span>
                                          </div>
                                          <div className="grid grid-cols-3 gap-3">
                                            <EditableField
                                              value={action.start_date}
                                              onSave={(value) => updateAction(action.id!, { start_date: value })}
                                              type="date"
                                              label="START"
                                              placeholder="Set start date"
                                              className="text-sm"
                                            />
                                            <EditableField
                                              value={action.completion_date}
                                              onSave={(value) => updateAction(action.id!, { completion_date: value })}
                                              type="date"
                                              label="TARGET"
                                              placeholder="Set target date"
                                              className="text-sm font-bold"
                                            />
                                            <EditableField
                                              value={action.end_date}
                                              onSave={(value) => updateAction(action.id!, { end_date: value })}
                                              type="date"
                                              label="DEADLINE"
                                              placeholder="Set deadline"
                                              className="text-sm"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* EXPECTED RESULT - Teal glass */}
                                      {structuredAction.what && (
                                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-clarity-teal-50/90 to-clarity-teal-100/70 backdrop-blur-sm border border-clarity-teal-200/50 shadow-lg p-4">
                                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                          <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                              <Target className="h-4 w-4 text-clarity-teal-600" />
                                              <span className="font-semibold text-clarity-teal-700 text-sm">EXPECTED RESULT</span>
                                            </div>
                                            <p className="text-foreground font-medium">{structuredAction.what}</p>
                                          </div>
                                        </div>
                                      )}

                                      {/* Micro tasks */}
                                      {structuredAction.microTasks && structuredAction.microTasks.length > 0 && (
                                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50/90 to-green-100/70 backdrop-blur-sm border border-green-200/50 shadow-lg p-4">
                                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                          <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                              <CheckCircle className="h-4 w-4 text-green-600" />
                                              <span className="font-semibold text-green-700 text-sm">START WITH THESE TINY STEPS</span>
                                            </div>
                                            <div className="space-y-1">
                                              {structuredAction.microTasks.map((task, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-green-700 bg-green-100/80 px-2 py-1 rounded-lg">
                                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                  {task.text}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* SUPPORT CIRCLE & COMMENTS */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ActionWatcherSelector
                                          actionId={action.id!}
                                          assignedWatchers={action.assigned_watchers || []}
                                          onWatchersChange={(watchers) => handleWatchersChange(action.id!, watchers)}
                                          onNotify={() => updateAction(action.id!, { support_circle_notified: true })}
                                        />
                                        <ActionCommentsSection actionId={action.id!} />
                                      </div>
                                    </div>

                                    {/* Right side - Status & Priority */}
                                    <div className="flex flex-col gap-3 min-w-[140px]">
                                      <EditableField
                                        value={String(action.priority_level || 3)}
                                        onSave={(value) => updateAction(action.id!, { priority_level: Number(value) })}
                                        type="select"
                                        options={priorityOptions}
                                        label="PRIORITY"
                                        className="text-xs"
                                      />
                                      <EditableField
                                        value={action.status}
                                        onSave={(value) => updateAction(action.id!, { status: value as any })}
                                        type="select"
                                        options={statusOptions}
                                        label="STATUS"
                                        className="text-xs"
                                      />
                                      <Badge 
                                        className={cn(
                                          "justify-center py-1.5 border shadow-lg transition-all",
                                          getStatusColor(action.status)
                                        )}
                                      >
                                        {getStatusIcon(action.status)}
                                        <span className="ml-1.5 capitalize text-xs">
                                          {action.status.replace('_', ' ')}
                                        </span>
                                      </Badge>
                                      <Badge variant="outline" className="text-xs justify-center">
                                        {Math.round((action.confidence_score || 0) * 100)}% Confidence
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
