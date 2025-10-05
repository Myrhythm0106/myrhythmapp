import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, X, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActionForReview {
  id: string;
  action_text: string;
  assigned_to?: string;
  due_context?: string;
  priority_level?: number;
  category: string;
  validation_score: number;
  validation_issues: string[];
  confidence_score: number;
}

export function ActionReviewQueue() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedAction, setEditedAction] = useState<Partial<ActionForReview>>({});

  const { data: actionsForReview = [], isLoading } = useQuery({
    queryKey: ['actions-for-review'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('extracted_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('requires_review', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ActionForReview[];
    }
  });

  const confirmMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ActionForReview> }) => {
      const { error } = await supabase
        .from('extracted_actions')
        .update({
          ...updates,
          requires_review: false,
          validation_score: 100,
          extraction_method: 'manual'
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions-for-review'] });
      queryClient.invalidateQueries({ queryKey: ['extracted-actions'] });
      toast({ title: 'Action confirmed', description: 'Action marked as verified' });
      setEditingId(null);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('extracted_actions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions-for-review'] });
      toast({ title: 'Action rejected', description: 'Action removed from your list' });
    }
  });

  const handleConfirm = (action: ActionForReview) => {
    confirmMutation.mutate({
      id: action.id,
      updates: editingId === action.id ? editedAction : {}
    });
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to delete this action?')) {
      rejectMutation.mutate(id);
    }
  };

  const startEditing = (action: ActionForReview) => {
    setEditingId(action.id);
    setEditedAction({
      action_text: action.action_text,
      assigned_to: action.assigned_to,
      due_context: action.due_context,
      priority_level: action.priority_level,
      category: action.category
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading actions for review...</div>;
  }

  if (actionsForReview.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
        <h3 className="text-lg font-semibold mb-2">All Actions Verified</h3>
        <p className="text-muted-foreground">No actions need your review right now</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Actions Needing Review</h3>
          <p className="text-sm text-muted-foreground">{actionsForReview.length} actions require your attention</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => actionsForReview.forEach(a => handleConfirm(a))}
        >
          Confirm All
        </Button>
      </div>

      {actionsForReview.map((action) => (
        <Card key={action.id} className="p-4">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-1" />
            
            <div className="flex-1 space-y-3">
              {/* Quality Indicators */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  Score: {action.validation_score}/100
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Confidence: {Math.round((action.confidence_score || 0.75) * 100)}%
                </Badge>
                {action.validation_issues.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {action.validation_issues.length} issues
                  </Badge>
                )}
              </div>

              {/* Issues List */}
              {action.validation_issues.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Issues: {action.validation_issues.join(', ')}
                </div>
              )}

              {/* Editable Fields */}
              {editingId === action.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editedAction.action_text || ''}
                    onChange={(e) => setEditedAction({ ...editedAction, action_text: e.target.value })}
                    placeholder="Action text"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={editedAction.assigned_to || ''}
                      onChange={(e) => setEditedAction({ ...editedAction, assigned_to: e.target.value })}
                      placeholder="Assigned to"
                    />
                    <Input
                      value={editedAction.due_context || ''}
                      onChange={(e) => setEditedAction({ ...editedAction, due_context: e.target.value })}
                      placeholder="Due context"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-medium">{action.action_text}</p>
                  <div className="text-sm text-muted-foreground mt-1">
                    {action.assigned_to && `Assigned: ${action.assigned_to}`}
                    {action.due_context && ` • Due: ${action.due_context}`}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {editingId === action.id ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleConfirm(action)}
                    disabled={confirmMutation.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditing(action)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConfirm(action)}
                    disabled={confirmMutation.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(action.id)}
                    disabled={rejectMutation.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
