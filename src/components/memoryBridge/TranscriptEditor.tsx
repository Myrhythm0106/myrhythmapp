import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranscriptEditorProps {
  meetingId: string;
  initialTranscript: string;
  transcriptionConfidence?: number;
}

export function TranscriptEditor({ 
  meetingId, 
  initialTranscript,
  transcriptionConfidence 
}: TranscriptEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState(initialTranscript);

  const saveTranscriptMutation = useMutation({
    mutationFn: async (newTranscript: string) => {
      const { error } = await supabase
        .from('meeting_recordings')
        .update({ transcript: newTranscript })
        .eq('id', meetingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-details', meetingId] });
      setIsEditing(false);
      toast({ 
        title: 'Transcript Updated', 
        description: 'Changes saved successfully' 
      });
    },
    onError: (error) => {
      toast({ 
        title: 'Save Failed', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const reprocessMutation = useMutation({
    mutationFn: async () => {
      // Call extract-acts-incremental with updated transcript
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('extract-acts-incremental', {
        body: {
          transcript: editedTranscript,
          meetingId,
          userId: user.id
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extracted-actions'] });
      queryClient.invalidateQueries({ queryKey: ['meeting-details', meetingId] });
      toast({ 
        title: 'Reprocessing Complete', 
        description: 'Actions have been re-extracted from the updated transcript' 
      });
    },
    onError: (error) => {
      toast({ 
        title: 'Reprocessing Failed', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSave = () => {
    saveTranscriptMutation.mutate(editedTranscript);
  };

  const handleCancel = () => {
    setEditedTranscript(initialTranscript);
    setIsEditing(false);
  };

  const handleReprocess = () => {
    if (confirm('Re-extract actions from this transcript? Existing actions will be updated.')) {
      reprocessMutation.mutate();
    }
  };

  const getConfidenceBadge = () => {
    if (!transcriptionConfidence) return null;
    
    const percentage = Math.round(transcriptionConfidence * 100);
    const variant = percentage >= 90 ? 'default' : percentage >= 75 ? 'secondary' : 'destructive';
    
    return (
      <Badge variant={variant} className="text-xs">
        Confidence: {percentage}%
      </Badge>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Transcript</h3>
          {getConfidenceBadge()}
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={saveTranscriptMutation.isPending}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saveTranscriptMutation.isPending}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReprocess}
                disabled={reprocessMutation.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${reprocessMutation.isPending ? 'animate-spin' : ''}`} />
                Re-extract Actions
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <Textarea
          value={editedTranscript}
          onChange={(e) => setEditedTranscript(e.target.value)}
          rows={15}
          className="font-mono text-sm"
          placeholder="Edit transcript..."
        />
      ) : (
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {initialTranscript}
          </p>
        </div>
      )}

      {transcriptionConfidence && transcriptionConfidence < 0.8 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            ⚠️ Low transcription confidence detected. Please review the transcript for accuracy before extracting actions.
          </p>
        </div>
      )}
    </Card>
  );
}
