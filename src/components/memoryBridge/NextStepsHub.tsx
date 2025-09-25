import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Grid, 
  List, 
  Calendar,
  Clock,
  Brain,
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ActionsViewer } from './ActionsViewer';
import { NextStepsGridView } from './NextStepsGridView';
import { ActionStatus } from '@/hooks/useStatusManagement';
import { Priority, numericToPriority, priorityToNumeric } from '@/types/priority';

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
  const [viewMode, setViewMode] = useState<'detailed' | 'grid'>('grid');
  const [showActionsViewer, setShowActionsViewer] = useState(false);

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
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-8 w-8 mx-auto mb-4 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading your next steps...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
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
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid View
              </Button>
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detailed')}
              >
                <List className="h-4 w-4 mr-2" />
                Detailed View
              </Button>
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
        <NextStepsGridView
          actions={actions}
          onActionUpdate={handleActionUpdate}
          onReorder={handleReorder}
        />
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
  );
}