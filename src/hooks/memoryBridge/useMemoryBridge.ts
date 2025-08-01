import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { MeetingRecording, ExtractedAction, MeetingSetupData } from '@/types/memoryBridge';
import * as memoryBridgeApi from '@/utils/memoryBridgeApi';

export function useMemoryBridge() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<MeetingRecording | null>(null);
  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([]);

  const startMeetingRecording = useCallback(async (setupData: MeetingSetupData, voiceRecordingId: string) => {
    if (!user) {
      toast.error('Please sign in to start meeting recording');
      return null;
    }

    try {
      setIsProcessing(true);

      const meetingRecord = await memoryBridgeApi.createMeetingRecording(user.id, voiceRecordingId, setupData);
      
      setCurrentMeeting(meetingRecord as MeetingRecording);
      setIsRecording(true);
      toast.success('Meeting recording started');
      return meetingRecord;

    } catch (error) {
      console.error('Error starting meeting recording:', error);
      toast.error('Failed to start meeting recording');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  const stopMeetingRecording = useCallback(async (audioBlob: Blob) => {
    if (!currentMeeting || !user) {
      toast.error('No active meeting to stop');
      return;
    }

    try {
      setIsProcessing(true);
      setIsRecording(false);

      // Convert audio blob to base64
      const reader = new FileReader();
      const audioDataPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data:audio/webm;base64, prefix
        };
      });
      reader.readAsDataURL(audioBlob);
      
      const audioData = await audioDataPromise;

      // Process the audio through our edge function
      const { data, error } = await supabase.functions.invoke('process-meeting-audio', {
        body: {
          audioData,
          meetingId: currentMeeting.id,
          userId: user.id
        }
      });

      if (error) throw error;

      toast.success(`Meeting processed! Found ${data.actions_found} actions to review`);
      
      // Fetch the extracted actions
      await fetchExtractedActions(currentMeeting.id);
      
      setCurrentMeeting(null);
      return data;

    } catch (error) {
      console.error('Error processing meeting:', error);
      toast.error('Failed to process meeting recording');
    } finally {
      setIsProcessing(false);
    }
  }, [currentMeeting, user]);

  const fetchExtractedActions = useCallback(async (meetingId?: string) => {
    if (!user) return;

    try {
      const data = await memoryBridgeApi.fetchExtractedActions(user.id, meetingId);
      setExtractedActions(data as ExtractedAction[]);

    } catch (error) {
      console.error('Error fetching extracted actions:', error);
      toast.error('Failed to load extracted actions');
    }
  }, [user]);

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

  return {
    isRecording,
    isProcessing,
    currentMeeting,
    extractedActions,
    startMeetingRecording,
    stopMeetingRecording,
    fetchExtractedActions,
    confirmAction,
    fetchMeetingHistory
  };
}