import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        <CardContent className="space-y-6">
          
          {/* Context Information */}
          {action.transcript_excerpt && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Original Conversation Context
              </h4>
              <p className="text-blue-700 text-sm italic">
                "{action.transcript_excerpt}"
              </p>
              {action.timestamp_in_recording && (
                <p className="text-xs text-blue-600 mt-2">
                  At {Math.floor(action.timestamp_in_recording / 60)}:{(action.timestamp_in_recording % 60).toString().padStart(2, '0')} in recording
                </p>
              )}
            </div>
          )}

          {/* Action Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Assignment Information */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                Assignment & Responsibility
              </h4>
              <div className="space-y-2 pl-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Assigned to:</span>
                  <span className="text-sm font-medium">{action.assigned_to || 'Me'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Owner:</span>
                  <span className="text-sm font-medium">{action.owner || 'Me'}</span>
                </div>
                {action.assigned_watchers && action.assigned_watchers.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Watchers:</span>
                    <Badge variant="outline" className="text-xs">
                      {action.assigned_watchers.length} support members
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Timing Information */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                Timing & Schedule
              </h4>
              <div className="space-y-2 pl-6">
                {action.due_context && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Due:</span>
                    <span className="text-sm font-medium">{action.due_context}</span>
                  </div>
                )}
                {action.scheduled_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Scheduled:</span>
                    <span className="text-sm font-medium">
                      {new Date(action.scheduled_date).toLocaleDateString()}
                      {action.scheduled_time && ` at ${action.scheduled_time}`}
                    </span>
                  </div>
                )}
                {action.completion_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed:</span>
                    <span className="text-sm font-medium text-green-600">
                      {new Date(action.completion_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Motivation & Impact */}
          {(action.motivation_statement || action.relationship_impact || action.emotional_stakes) && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Motivation & Impact
              </h4>
              <div className="space-y-2">
                {action.motivation_statement && (
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Why this matters:</p>
                    <p className="text-sm text-purple-700">{action.motivation_statement}</p>
                  </div>
                )}
                {action.relationship_impact && (
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Relationship impact:</p>
                    <p className="text-sm text-purple-700">{action.relationship_impact}</p>
                  </div>
                )}
                {action.emotional_stakes && (
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Emotional significance:</p>
                    <p className="text-sm text-purple-700">{action.emotional_stakes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Criteria & Steps */}
          {(action.success_criteria || action.what_outcome || action.how_steps) && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Success Definition
              </h4>
              <div className="space-y-3">
                {action.success_criteria && (
                  <div>
                    <p className="text-xs text-green-600 font-medium">Success looks like:</p>
                    <p className="text-sm text-green-700">{action.success_criteria}</p>
                  </div>
                )}
                {action.what_outcome && (
                  <div>
                    <p className="text-xs text-green-600 font-medium">Expected outcome:</p>
                    <p className="text-sm text-green-700">{action.what_outcome}</p>
                  </div>
                )}
                {action.how_steps && action.how_steps.length > 0 && (
                  <div>
                    <p className="text-xs text-green-600 font-medium">Steps to take:</p>
                    <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
                      {action.how_steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

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