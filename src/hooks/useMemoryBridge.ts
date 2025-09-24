import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MeetingSetupData, ExtractedAction } from '@/types/memoryBridge';

export function useMemoryBridge() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<any>(null);
  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([]);

  const startMeetingRecording = useCallback(async (
    setupData: MeetingSetupData, 
    voiceRecordingId: string
  ): Promise<any | null> => {
    if (!user) return null;

    try {
      const { data: meeting, error } = await supabase
        .from('meeting_recordings')
        .insert({
          user_id: user.id,
          recording_id: voiceRecordingId,
          meeting_title: setupData.title,
          participants: setupData.participants,
          meeting_context: setupData.context,
          meeting_type: setupData.meetingType,
          location: setupData.location,
          energy_level: setupData.energyLevel,
          emotional_context: setupData.emotionalContext,
          relationship_context: {},
          watchers: setupData.watchers || [],
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentMeeting(meeting);
      setIsRecording(true);
      return meeting;
    } catch (error) {
      console.error('Error starting meeting recording:', error);
      toast.error('Failed to start meeting recording');
      return null;
    }
  }, [user]);

  const stopMeetingRecording = useCallback(async (audioBlob: Blob): Promise<any | undefined> => {
    if (!currentMeeting || !user) return;

    try {
      setIsProcessing(true);

      // Update meeting as ended
      await supabase
        .from('meeting_recordings')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', currentMeeting.id);

      // Convert blob to base64 for processing
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // Process audio with edge function
      const { data, error } = await supabase.functions.invoke('process-meeting-audio', {
        body: {
          audio: base64Audio,
          meetingId: currentMeeting.id,
          meetingData: {
            title: currentMeeting.meeting_title,
            participants: currentMeeting.participants,
            context: currentMeeting.meeting_context,
            type: currentMeeting.meeting_type
          }
        }
      });

      if (error) throw error;

      // Fetch the extracted actions
      await fetchExtractedActions(currentMeeting.id);
      
      toast.success('Meeting processed! ACTs extracted successfully.');
      setCurrentMeeting(null);
      setIsRecording(false);

      return data;
    } catch (error) {
      console.error('Error processing meeting:', error);
      toast.error('Failed to process meeting recording');
    } finally {
      setIsProcessing(false);
    }
  }, [currentMeeting, user]);

  const fetchExtractedActions = useCallback(async (meetingId?: string): Promise<ExtractedAction[]> => {
    if (!user) return [];

    try {
      let query = supabase
        .from('extracted_actions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (meetingId) {
        query = query.eq('meeting_recording_id', meetingId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setExtractedActions((data || []) as ExtractedAction[]);
      return (data || []) as ExtractedAction[];
    } catch (error) {
      console.error('Error fetching extracted actions:', error);
      return [];
    }
  }, [user]);

  const confirmAction = useCallback(async (
    actionId: string,
    status: 'confirmed' | 'modified' | 'rejected',
    modifications?: Record<string, any>,
    note?: string
  ): Promise<void> => {
    if (!user) return;

    try {
      // Create confirmation record
      const { error: confirmError } = await supabase
        .from('action_confirmations')
        .insert({
          user_id: user.id,
          extracted_action_id: actionId,
          confirmation_status: status,
          user_modifications: modifications || {},
          confirmation_note: note
        });

      if (confirmError) throw confirmError;

      // Update action status
      const { error: updateError } = await supabase
        .from('extracted_actions')
        .update({ status })
        .eq('id', actionId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Refresh actions
      await fetchExtractedActions();
      
      toast.success(`Action ${status} successfully`);
    } catch (error) {
      console.error('Error confirming action:', error);
      toast.error('Failed to update action');
    }
  }, [user, fetchExtractedActions]);

  const fetchMeetingHistory = useCallback(async (): Promise<any[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('meeting_recordings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching meeting history:', error);
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
    updateExtractedAction
  };
}