import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Clock, 
  Play, 
  Users, 
  Calendar,
  MessageCircle,
  Star,
  TrendingUp,
  BarChart3,
  Target,
  Heart,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchExtractedActions, updateExtractedAction } from '@/utils/memoryBridgeApi';
import { useStatusManagement } from '@/hooks/useStatusManagement';
import { NextStepsItem } from '@/types/memoryBridge';
import { toast } from 'sonner';
import { ActionDetailCard } from './ActionDetailCard';
import { SupportCircleActionView } from './SupportCircleActionView';
import { ProgressCelebration } from './ProgressCelebration';

export function MemoryBridgeActionReport() {
  const { user } = useAuth();
  const { updateActionStatus, getStatusProgress } = useStatusManagement();
  const [actions, setActions] = useState<NextStepsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<NextStepsItem | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detailed' | 'support-circle' | 'progress'>('list');

  useEffect(() => {
    if (user) {
      loadActions();
    }
  }, [user]);

  const loadActions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const actionsData = await fetchExtractedActions(user.id);
      setActions(actionsData);
    } catch (error) {
      console.error('Error loading actions:', error);
      toast.error('Failed to load actions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (actionId: string, newStatus: any, notes?: string) => {
    try {
      await updateActionStatus(actionId, newStatus, notes, true);
      await loadActions(); // Refresh the list
      toast.success('Action status updated successfully! 🎉', {
        description: 'Your support circle has been notified'
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update action status');
    }
  };

  const groupedActions = {
    'to-do': actions.filter(a => ['not_started', 'pending', 'scheduled'].includes(a.status)),
    'doing': actions.filter(a => ['doing', 'in_progress', 'on_hold'].includes(a.status)),
    'done': actions.filter(a => ['done', 'completed', 'confirmed'].includes(a.status))
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'done':
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'doing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEmpoweringTitle = (category: string) => {
    switch (category) {
      case 'to-do': return 'Ready to Take Action';
      case 'doing': return 'Building Momentum';
      case 'done': return 'Celebrating Victories';
      default: return 'Your Progress Journey';
    }
  };

  const getEmpoweringIcon = (category: string) => {
    switch (category) {
      case 'to-do': return <Target className="h-5 w-5 text-blue-500" />;
      case 'doing': return <Zap className="h-5 w-5 text-orange-500" />;
      case 'done': return <Star className="h-5 w-5 text-green-500" />;
      default: return <Heart className="h-5 w-5 text-purple-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Memory Bridge Action Report
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-muted-foreground">Loading your action journey...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'detailed' && selectedAction) {
    return (
      <ActionDetailCard 
        action={selectedAction}
        onStatusUpdate={handleStatusUpdate}
        onBack={() => setViewMode('list')}
        onSupportCircle={() => setViewMode('support-circle')}
      />
    );
  }

  if (viewMode === 'support-circle') {
    return (
      <SupportCircleActionView 
        actions={actions}
        onBack={() => setViewMode('list')}
      />
    );
  }

  if (viewMode === 'progress') {
    return (
      <ProgressCelebration 
        actions={actions}
        onBack={() => setViewMode('list')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Empowering Header */}
      <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-purple-800">
                Your Memory Bridge Action Report
              </CardTitle>
              <p className="text-purple-600">
                Every conversation becomes empowering action. Track your journey from words to wins.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode('support-circle')}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Support Circle
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode('progress')}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Progress View
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedActions).map(([category, categoryActions]) => (
          <Card key={category} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getEmpoweringIcon(category)}
                {getEmpoweringTitle(category)}
                <Badge variant="secondary" className="ml-auto">
                  {categoryActions.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {categoryActions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="mb-2">
                        {category === 'to-do' && '🎯'}
                        {category === 'doing' && '⚡'}
                        {category === 'done' && '🌟'}
                      </div>
                      <p className="text-sm">
                        {category === 'to-do' && 'Ready for new actions'}
                        {category === 'doing' && 'Building momentum'}
                        {category === 'done' && 'Celebrating your victories!'}
                      </p>
                    </div>
                  ) : (
                    categoryActions.map((action, index) => (
                      <Card 
                        key={action.id} 
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-purple-200"
                        onClick={() => {
                          setSelectedAction(action);
                          setViewMode('detailed');
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm leading-tight">
                              {action.action_text}
                            </h4>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getStatusColor(action.status)}`}
                            >
                              {action.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          {action.due_context && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {action.due_context}
                            </div>
                          )}
                          
                          {action.assigned_to && action.assigned_to !== 'me' && (
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <Users className="h-3 w-3" />
                              Assigned to {action.assigned_to}
                            </div>
                          )}

                          {action.scheduled_date && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Calendar className="h-3 w-3" />
                              {new Date(action.scheduled_date).toLocaleDateString()}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {action.confidence_score && (
                                <>
                                  <TrendingUp className="h-3 w-3" />
                                  {Math.round(action.confidence_score * 100)}% confidence
                                </>
                              )}
                            </div>
                            
                            {action.assigned_watchers && action.assigned_watchers.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-purple-600">
                                <Users className="h-3 w-3" />
                                {action.assigned_watchers.length} watchers
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Your Empowerment Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {groupedActions['done'].length}
              </div>
              <p className="text-sm text-green-700">Actions Completed</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {groupedActions['doing'].length}
              </div>
              <p className="text-sm text-blue-700">In Progress</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {actions.filter(a => a.assigned_watchers && a.assigned_watchers.length > 0).length}
              </div>
              <p className="text-sm text-purple-700">With Support Circle</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((groupedActions['done'].length / Math.max(actions.length, 1)) * 100)}%
              </div>
              <p className="text-sm text-orange-700">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}