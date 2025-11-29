import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { MeetingRecording, ExtractedAction, MeetingSetupData } from '@/types/memoryBridge';
import * as memoryBridgeApi from '@/utils/memoryBridgeApi';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export function useMemoryBridge() {
  const { user } = useAuth();
  const { handleError, handleAsyncError } = useErrorHandler();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<MeetingRecording | null>(null);
  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([]);

  const startMeetingRecording = useCallback(async (setupData: MeetingSetupData, voiceRecordingId: string) => {
    if (!user) {
      console.log('useMemoryBridge: No user available for meeting recording');
      toast.error('Please sign in to start meeting recording');
      return null;
    }

    console.log('useMemoryBridge: Starting meeting recording for user:', user.id);
    
    return handleAsyncError(
      async () => {
        setIsProcessing(true);
        console.log('useMemoryBridge: Creating meeting record with data:', setupData);

        const meetingRecord = await memoryBridgeApi.createMeetingRecording(user.id, voiceRecordingId, setupData);
        
        console.log('useMemoryBridge: Meeting record created successfully:', meetingRecord?.id);
        setCurrentMeeting(meetingRecord as MeetingRecording);
        setIsRecording(true);
        
        toast.success('Meeting recording started');
        return meetingRecord;
      },
      null,
      'Failed to start meeting recording'
    ).finally(() => {
      setIsProcessing(false);
    });
  }, [user, handleAsyncError]);

  const fetchExtractedActions = useCallback(async (meetingId?: string) => {
    if (!user) {
      console.log('useMemoryBridge: No user available for fetching actions');
      return [];
    }

    console.log('useMemoryBridge: Fetching extracted actions for user:', user.id, 'meeting:', meetingId);
    
    return handleAsyncError(
      async () => {
        const data = await memoryBridgeApi.fetchExtractedActions(user.id, meetingId);
        const typedData = data as ExtractedAction[];
        console.log('useMemoryBridge: Fetched actions count:', typedData.length);
        setExtractedActions(typedData);
        return typedData;
      },
      [],
      'Failed to load extracted actions'
    );
  }, [user, handleAsyncError]);

  const stopMeetingRecording = useCallback(async (audioBlob: Blob) => {
    if (!currentMeeting || !user) {
      console.log('useMemoryBridge: Cannot stop meeting - missing meeting or user');
      toast.error('No active meeting to stop');
      return;
    }

    console.log('useMemoryBridge: Stopping meeting recording:', currentMeeting.id);

    return handleAsyncError(
      async () => {
        setIsProcessing(true);
        setIsRecording(false);

        console.log('useMemoryBridge: Converting audio blob to base64');
        // Convert audio blob to base64
        const reader = new FileReader();
        const audioDataPromise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            try {
              const base64 = reader.result as string;
              resolve(base64.split(',')[1]); // Remove data:audio/webm;base64, prefix
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = () => reject(new Error('Failed to read audio file'));
        });
        reader.readAsDataURL(audioBlob);
        
        const audioData = await audioDataPromise;
        console.log('useMemoryBridge: Audio converted to base64, length:', audioData.length);

        // Update meeting record as ended
        console.log('useMemoryBridge: Updating meeting record as ended');
        const { error: updateError } = await supabase
          .from('meeting_recordings')
          .update({ 
            is_active: false,
            ended_at: new Date().toISOString()
          })
          .eq('id', currentMeeting.id);

        if (updateError) {
          console.error('useMemoryBridge: Error updating meeting record:', updateError);
          throw updateError;
        }

        // Process the audio through our edge function
        console.log('useMemoryBridge: Invoking process-meeting-audio function');
        const { data, error } = await supabase.functions.invoke('process-meeting-audio', {
          body: {
            audio: audioData,
            meetingId: currentMeeting.id,
            userId: user.id,
            meetingData: {
              title: currentMeeting.meeting_title,
              type: currentMeeting.meeting_type,
              participants: currentMeeting.participants,
              context: currentMeeting.meeting_context,
              recording_id: currentMeeting.recording_id
            }
          }
        });

        if (error) {
          console.error('useMemoryBridge: Edge function error:', error);
          throw error;
        }

        console.log('useMemoryBridge: Meeting processed successfully, actions found:', data.actionsExtracted);
        toast.success(`Meeting processed! Found ${data.actionsExtracted} actions to review`);
        
        // Fetch the extracted actions
        await fetchExtractedActions(currentMeeting.id);
        
        setCurrentMeeting(null);
        
        // Return enhanced data for results display
        return {
          ...data,
          meetingId: currentMeeting.id,
          actions_found: data.actionsExtracted
        };
      },
      undefined,
      'Failed to process meeting recording'
    ).finally(() => {
      setIsProcessing(false);
    });
  }, [currentMeeting, user, handleAsyncError, fetchExtractedActions]);

  const confirmAction = useCallback(async (
    actionId: string, 
    status: 'confirmed' | 'modified' | 'rejected',
    modifications?: Record<string, any>,
    note?: string
  ) => {
    if (!user) return;

    try {
      // Update the action status
      await memoryBridgeApi.updateExtractedAction(actionId, user.id, status, note);

      // Create confirmation record
      await memoryBridgeApi.createActionConfirmation(user.id, actionId, status, modifications, note);

      // Refresh the actions list
      await fetchExtractedActions();
      
      toast.success(`Action ${status}`);

    } catch (error) {
      console.error('Error confirming action:', error);
      toast.error('Failed to confirm action');
    }
  }, [user, fetchExtractedActions]);

  const fetchMeetingHistory = useCallback(async () => {
    if (!user) return [];

    try {
      const data = await memoryBridgeApi.fetchMeetingHistory(user.id);
      return data;

    } catch (error) {
      console.error('Error fetching meeting history:', error);
      toast.error('Failed to load meeting history');
      return [];
    }
  }, [user]);

  const updateExtractedAction = useCallback(async (
    actionId: string,
    updates: Partial<ExtractedAction>
  ): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('extracted_actions')
        .update(updates)
        .eq('id', actionId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh actions
      await fetchExtractedActions();
    } catch (error) {
      console.error('Error updating action:', error);
      toast.error('Failed to update action');
    }
  }, [user, fetchExtractedActions]);

  const markActionComplete = useCallback(async (
    actionId: string,
    actionTitle: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // Update action status to completed
      const { error: updateError } = await supabase
        .from('extracted_actions')
        .update({ 
          status: 'completed',
          completion_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', actionId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Notify support circle watchers via the RPC function
      const { error: notifyError } = await supabase.rpc('notify_watchers_of_action_completion', {
        p_action_id: actionId,
        p_user_id: user.id,
        p_action_title: actionTitle,
        p_completion_status: 'completed'
      });

      if (notifyError) {
        console.warn('Could not notify watchers:', notifyError);
        // Don't fail the completion if notification fails
      }

      // Create cross-device notification for the user's own devices
      await supabase.from('cross_device_notifications').insert({
        user_id: user.id,
        notification_type: 'action_completed',
        device_source: 'web',
        data: {
          action_id: actionId,
          action_title: actionTitle,
          completed_at: new Date().toISOString()
        }
      });

      // Refresh actions
      await fetchExtractedActions();
      
      return true;
    } catch (error) {
      console.error('Error completing action:', error);
      toast.error('Failed to mark action as complete');
      return false;
    }
  }, [user, fetchExtractedActions]);

  return {
    isRecording,
    isProcessing,
    currentMeeting,
    extractedActions,
    startMeetingRecording,
    stopMeetingRecording,
    fetchExtractedActions,
    confirmAction,
    fetchMeetingHistory,
    updateExtractedAction,
    markActionComplete
  };
}