import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Grid, 
  List, 
  Calendar,
  Clock,
  Brain,
  Sparkles,
  TrendingUp,
  Target,
  Grid3x3,
  Tablet,
  ListChecks,
  Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ActionsViewer } from './ActionsViewer';
import { NextStepsGridView } from './NextStepsGridView';
import { ActionStatus } from '@/hooks/useStatusManagement';
import { Priority, numericToPriority, priorityToNumeric } from '@/types/priority';
import { motion } from 'framer-motion';

interface NextStepsItem {
  id: string;
  action_text: string;
  status: ActionStatus;
  priority_level: number;
  due_context?: string;
  proposed_date?: string;
  proposed_time?: string;
  confidence_score?: number;
  category: string;
  assigned_to?: string;
  created_at: string;
  meeting_recording_id?: string;
  scheduled_date?: string;  
  scheduled_time?: string;
}

interface NextStepsHubProps {
  recordingId?: string;
  meetingTitle?: string;
}

export function NextStepsHub({ recordingId, meetingTitle }: NextStepsHubProps) {
  const { user } = useAuth();
  const [actions, setActions] = useState<NextStepsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'tablet'>('grid');
  const [showActionsViewer, setShowActionsViewer] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [showSelectModeHint, setShowSelectModeHint] = useState(false);

  // Load saved view preference
  useEffect(() => {
    const savedView = localStorage.getItem('nextStepsViewMode');
    if (savedView && ['grid', 'list', 'tablet'].includes(savedView)) {
      setViewMode(savedView as 'grid' | 'list' | 'tablet');
    }
  }, []);

  // Save view preference
  useEffect(() => {
    localStorage.setItem('nextStepsViewMode', viewMode);
  }, [viewMode]);

  // Show select mode hint for users with 3+ actions
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('hasSeenSelectModeHint');
    if (!hasSeenHint && actions.length >= 3) {
      setShowSelectModeHint(true);
    }
  }, [actions.length]);

  useEffect(() => {
    if (!user) return;
    fetchActions();
  }, [user, recordingId]);

  const fetchActions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('extracted_actions')
        .select('*')
        .eq('user_id', user!.id)
        .order('priority_level', { ascending: true });

      if (recordingId) {
        // Get specific recording actions
        const { data: meetingRecording } = await supabase
          .from('meeting_recordings')
          .select('id')
          .eq('recording_id', recordingId)
          .single();

        if (meetingRecording) {
          query = query.eq('meeting_recording_id', meetingRecording.id);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;

      setActions((data || []).map(action => ({
        ...action,
        category: action.category || 'action',
        status: action.status as ActionStatus
      })));
    } catch (error) {
      console.error('Error fetching actions:', error);
      toast.error('Failed to load actions');
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize filtered actions for performance
  const filteredActions = useMemo(() => {
    return actions.filter(action => {
      // Add any filtering logic here if needed
      return true;
    });
  }, [actions]);

  const handleActionUpdate = async (actionId: string, updates: Partial<NextStepsItem>) => {
    try {
      const { error } = await supabase
        .from('extracted_actions')
        .update(updates)
        .eq('id', actionId);

      if (error) throw error;

      setActions(prev => 
        prev.map(action => 
          action.id === actionId ? { ...action, ...updates } : action
        )
      );

      toast.success('Action updated successfully');
    } catch (error) {
      console.error('Error updating action:', error);
      toast.error('Failed to update action');
    }
  };

  const handleReorder = async (reorderedActions: NextStepsItem[]) => {
    setActions(reorderedActions);
    
    // Update priority_level in database based on new order
    const updates = reorderedActions.map((action, index) => ({
      id: action.id,
      priority_level: index + 1
    }));

    try {
      for (const update of updates) {
        await supabase
          .from('extracted_actions')
          .update({ priority_level: update.priority_level })
          .eq('id', update.id);
      }
      
      toast.success('Actions reordered successfully');
    } catch (error) {
      console.error('Error reordering actions:', error);
      toast.error('Failed to save new order');
    }
  };

  const getActionStats = () => {
    const total = actions.length;
    const done = actions.filter(a => a.status === 'done').length;
    const doing = actions.filter(a => a.status === 'doing').length;
    const notStarted = actions.filter(a => a.status === 'not_started').length;
    
    return { total, done, doing, notStarted };
  };

  const stats = getActionStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Select Mode Hint Modal */}
        {showSelectModeHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowSelectModeHint(false);
              localStorage.setItem('hasSeenSelectModeHint', 'true');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">💡 Pro Tip: Bulk Scheduling</h3>
                <p className="text-muted-foreground mb-4">
                  With 3+ actions, you can use Select Mode to schedule multiple actions at once. 
                  Our AI will suggest optimal times based on your energy patterns!
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowSelectModeHint(false);
                      localStorage.setItem('hasSeenSelectModeHint', 'true');
                    }}
                  >
                    Maybe Later
                  </Button>
                  <Button onClick={() => {
                    setShowSelectModeHint(false);
                    setSelectionMode(true);
                    localStorage.setItem('hasSeenSelectModeHint', 'true');
                  }}>
                    Try It Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Selection Mode Help Banner */}
        {selectionMode && selectedActionIds.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/20 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-primary">Selection Mode Active</p>
                <p className="text-sm text-muted-foreground">
                  Tap on action cards to select them, then use "Schedule All" to batch schedule with smart time suggestions.
                </p>
              </div>
            </div>
          </motion.div>
        )}

      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {recordingId ? `Next Steps: ${meetingTitle}` : 'All Next Steps'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Your brain-friendly action dashboard
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('grid')}
                      className="h-8 px-3"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Grid View</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('list')}
                      className="h-8 px-3"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>List View</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('tablet')}
                      className="h-8 px-3"
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tablet View</TooltipContent>
                </Tooltip>
              </div>

              {/* Select Mode Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectionMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectionMode(!selectionMode);
                      if (selectionMode) {
                        setSelectedActionIds([]);
                      }
                    }}
                  >
                    <ListChecks className="w-4 h-4 mr-2" />
                    {selectionMode ? "Exit Selection" : "Select Mode"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-semibold mb-1">✨ Bulk Actions</p>
                  <p className="text-xs">
                    Select multiple actions and schedule them all at once with AI-powered time suggestions
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stats.total} Total
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-success">
                <Sparkles className="h-3 w-3" />
                {stats.done} Done
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-primary">
                <Clock className="h-3 w-3" />
                {stats.doing} In Flow
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
                <Target className="h-3 w-3" />
                {stats.notStarted} Ready
              </Badge>
            </div>
            
            {stats.total > 0 && (
              <div className="flex-1 max-w-xs">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.done / stats.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((stats.done / stats.total) * 100)}% Complete
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NextStepsGridView
            actions={filteredActions}
            onActionUpdate={handleActionUpdate}
            onReorder={handleReorder}
          />
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-2">
          {filteredActions.map((action) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="transition-all hover:scale-[1.01]"
            >
              <Card className="p-4 hover:shadow-md cursor-pointer">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{action.action_text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {action.category}
                      </Badge>
                      {action.due_context && (
                        <span className="text-xs text-muted-foreground">
                          {action.due_context}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={action.status === 'done' ? 'default' : 'outline'}
                    className="flex-shrink-0"
                  >
                    {action.status}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : viewMode === 'tablet' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <NextStepsGridView
            actions={filteredActions}
            onActionUpdate={handleActionUpdate}
            onReorder={handleReorder}
          />
        </div>
      ) : recordingId ? (
        <ActionsViewer
          recordingId={recordingId}
          meetingTitle={meetingTitle || 'Meeting'}
          isOpen={true}
          onClose={() => {}}
        />
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Select a specific recording to view detailed actions, or use the grid view above.
            </p>
          </CardContent>
        </Card>
      )}

      {actions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Actions Yet</h3>
            <p className="text-muted-foreground">
              {recordingId 
                ? "No actionable commitments found in this recording."
                : "Create a meeting recording to extract your next steps automatically."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
    </TooltipProvider>
  );
}