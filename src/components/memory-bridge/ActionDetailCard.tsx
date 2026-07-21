import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { 
  ArrowLeft, 
  Calendar,
  Users, 
  CheckCircle,
  Clock,
  Target,
  MessageSquare,
  Star,
  Play,
  Pause,
  Square,
  TrendingUp,
  Heart
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { toast } from 'sonner';
import { LoopInPicker, AdhocLoopIn } from '@/components/shared/LoopInPicker';
import { supabase } from '@/integrations/supabase/client';

interface ActionDetailCardProps {
  action: NextStepsItem;
  onStatusUpdate: (actionId: string, newStatus: string, notes?: string) => Promise<void>;
  onBack: () => void;
  onSupportCircle: () => void;
}

export function ActionDetailCard({ action, onStatusUpdate, onBack, onSupportCircle }: ActionDetailCardProps) {
  const [notes, setNotes] = useState(action.user_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(action.status);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(action.id!, newStatus, notes);
      setSelectedStatus(newStatus);
      toast.success('Status updated! 🎉');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_started': return <Square className="h-4 w-4" />;
      case 'in_progress': 
      case 'doing': return <Play className="h-4 w-4" />;
      case 'on_hold': return <Pause className="h-4 w-4" />;
      case 'completed':
      case 'done': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'done':
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Report
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onSupportCircle}>
                <Users className="h-4 w-4 mr-2" />
                Support Circle View
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-purple-800 leading-tight">
                {action.action_text}
              </h2>
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(action.status)} flex items-center gap-1`}>
                  {getStatusIcon(action.status)}
                  {action.status.replace('_', ' ')}
                </Badge>
                {action.category && (
                  <Badge variant="secondary">
                    {action.category}
                  </Badge>
                )}
              </div>
            </div>
            {action.confidence_score && (
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(action.confidence_score * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">AI Confidence</p>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick summary row */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {action.scheduled_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-green-600" />
                {new Date(action.scheduled_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                {action.scheduled_time && ` · ${action.scheduled_time}`}
              </span>
            )}
            {!action.scheduled_date && action.due_context && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {action.due_context}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-purple-500" />
              {action.assigned_to || 'Me'}
            </span>
            {action.assigned_watchers && action.assigned_watchers.length > 0 && (
              <Badge variant="outline" className="text-[10px]">
                {action.assigned_watchers.length} in the loop
              </Badge>
            )}
          </div>

          {/* Reveal 1: You'll know you're done */}
          {(action.success_criteria || action.what_outcome || (action.how_steps && action.how_steps.length > 0)) && (
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors group">
                <span className="flex items-center gap-2 text-sm font-medium text-green-800">
                  <Target className="h-4 w-4" />
                  You'll know you're done when…
                </span>
                <ChevronDown className="h-4 w-4 text-green-700 transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 pt-3 space-y-2">
                {action.success_criteria && (
                  <p className="text-sm text-green-800">{action.success_criteria}</p>
                )}
                {action.what_outcome && (
                  <div>
                    <p className="text-xs text-green-600 font-medium">Expected outcome</p>
                    <p className="text-sm text-green-700">{action.what_outcome}</p>
                  </div>
                )}
                {action.how_steps && action.how_steps.length > 0 && (
                  <div>
                    <p className="text-xs text-green-600 font-medium">Steps</p>
                    <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
                      {action.how_steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Reveal 2: This will help */}
          {(action.motivation_statement || action.relationship_impact || action.emotional_stakes) && (
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors group">
                <span className="flex items-center gap-2 text-sm font-medium text-purple-800">
                  <Heart className="h-4 w-4" />
                  This will help because…
                </span>
                <ChevronDown className="h-4 w-4 text-purple-700 transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 pt-3 space-y-2">
                {action.motivation_statement && (
                  <p className="text-sm text-purple-800">{action.motivation_statement}</p>
                )}
                {action.relationship_impact && (
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Relationship impact</p>
                    <p className="text-sm text-purple-700">{action.relationship_impact}</p>
                  </div>
                )}
                {action.emotional_stakes && (
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Why it matters</p>
                    <p className="text-sm text-purple-700">{action.emotional_stakes}</p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Reveal 3: More details */}
          <Collapsible>
            <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg border bg-muted/40 hover:bg-muted transition-colors group">
              <span className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                More details
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pt-3 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Owner</span><span>{action.owner || 'Me'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Assigned to</span><span>{action.assigned_to || 'Me'}</span></div>
                {action.completion_date && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Completed</span><span className="text-green-600">{new Date(action.completion_date).toLocaleDateString()}</span></div>
                )}
                {action.assigned_watchers && action.assigned_watchers.length > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">In the loop</span><span>{action.assigned_watchers.length}</span></div>
                )}
              </div>
              {action.transcript_excerpt && (
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium mb-1">From the recording</p>
                  <p className="text-blue-700 text-sm italic">"{action.transcript_excerpt}"</p>
                  {action.timestamp_in_recording && (
                    <p className="text-xs text-blue-600 mt-1">
                      At {Math.floor(action.timestamp_in_recording / 60)}:{(action.timestamp_in_recording % 60).toString().padStart(2, '0')}
                    </p>
                  )}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>


          {/* Status Update Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Update Progress
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={selectedStatus} onValueChange={(value: string) => setSelectedStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-1">
                <Label htmlFor="notes">Progress Notes</Label>
                <Textarea 
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about your progress..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => handleStatusUpdate(selectedStatus)}
                disabled={isUpdating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
              
              {selectedStatus !== 'completed' && (
                <Button 
                  variant="outline"
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={isUpdating}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}