import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RealtimeACT {
  id?: string;
  action: string;
  assignee: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  context: string;
  is_realtime?: boolean;
}

export const useRealtimeACTs = (meetingId?: string) => {
  const [acts, setActs] = useState<RealtimeACT[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const { user } = useAuth();

  const extractACTs = useCallback(async (transcript: string) => {
    if (!transcript.trim() || !meetingId || !user?.id) {
      return;
    }

    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-acts-incremental', {
        body: {
          transcript,
          meetingId,
          userId: user.id
        }
      });

      if (error) {
        console.error('Error extracting ACTs:', error);
        return;
      }

      if (data?.actions && data.actions.length > 0) {
        setActs(prev => {
          // Merge new actions, avoiding duplicates
          const newActions = data.actions.filter((newAct: RealtimeACT) => 
            !prev.some(existingAct => existingAct.action === newAct.action)
          );
          return [...prev, ...newActions];
        });
      }
    } catch (error) {
      console.error('Error extracting ACTs:', error);
    } finally {
      setIsExtracting(false);
    }
  }, [meetingId, user?.id]);

  const clearACTs = useCallback(() => {
    setActs([]);
  }, []);

  // Subscribe to realtime updates for this meeting
  useEffect(() => {
    if (!meetingId || !user?.id) return;

    const channel = supabase
      .channel('extracted_actions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'extracted_actions',
          filter: `meeting_recording_id=eq.${meetingId}`
        },
        (payload) => {
          const newAction = payload.new;
          if (newAction.is_realtime) {
            setActs(prev => {
              // Check if this action already exists
              const exists = prev.some(act => 
                act.action === newAction.action_text && 
                act.assignee === newAction.assignee
              );
              
              if (!exists) {
                return [...prev, {
                  id: newAction.id,
                  action: newAction.action_text,
                  assignee: newAction.assignee,
                  deadline: newAction.due_context,
                  priority: newAction.priority,
                  context: newAction.context,
                  confidence_score: newAction.confidence_score || 0.5,
                  reasoning: newAction.reasoning || '',
                  is_realtime: true
                }];
              }
              return prev;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId, user?.id]);

  return {
    acts,
    isExtracting,
    extractACTs,
    clearACTs
  };
};