import { useState, useCallback } from 'react';
import { ExtractedAction, MeetingRecording, MeetingSetupData, ActionConfirmation } from '@/types/memoryBridge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useMemoryBridgeDemoData } from './useMemoryBridgeDemoData';
import { toast } from 'sonner';

export function useMemoryBridge() {
  const { user } = useAuth();
  const { demoMode } = useSubscription();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<MeetingRecording | null>(null);
  
  // Use demo data when in demo mode, otherwise use real state
  const demoData = useMemoryBridgeDemoData();
  const [realExtractedActions, setRealExtractedActions] = useState<ExtractedAction[]>([]);
  
  // Choose data source based on demo mode
  const extractedActions = demoMode ? demoData.extractedActions : realExtractedActions;
  const setExtractedActions = demoMode ? demoData.setExtractedActions : setRealExtractedActions;

  const startMeetingRecording = useCallback(async (setupData: MeetingSetupData, voiceRecordingId: string): Promise<any | null> => {
    if (demoMode) {
      console.log('🎯 useMemoryBridge: Demo mode - simulating meeting recording start');
      setIsRecording(true);
      toast.success('Demo: Meeting recording started!');
      return { id: 'demo-meeting', title: setupData.title };
    }

    if (!user) {
      console.log('🔍 useMemoryBridge: No user found, cannot start recording');
      toast.error('Please sign in to start meeting recording');
      return null;
    }

    try {
      console.log('🔍 useMemoryBridge: Starting meeting recording for user:', user.id);
      setIsProcessing(true);

      // Create voice recording first
      const { data: voiceRecording, error: voiceError } = await supabase
        .from('voice_recordings')
        .insert({
          user_id: user.id,
          title: setupData.title,
          category: 'meeting',
          file_path: voiceRecordingId,
          file_size_bytes: 0,
          transcription: 'Recording in progress...'
        })
        .select()
        .single();

      if (voiceError) throw voiceError;

      // Create meeting recording
      const { data: meetingRecord, error: meetingError } = await supabase
        .from('meeting_recordings')
        .insert({
          user_id: user.id,
          recording_id: voiceRecording.id,
          meeting_title: setupData.title,
          meeting_type: setupData.meetingType || 'general',
          meeting_context: setupData.title || '',
          participants: setupData.participants.map(p => ({ name: p.name, relationship: p.relationship })),
          is_active: true
        })
        .select()
        .single();

      if (meetingError) throw meetingError;

      console.log('✅ useMemoryBridge: Meeting recording created:', meetingRecord.id);
      setCurrentMeeting(meetingRecord as MeetingRecording);
      setIsRecording(true);
      toast.success('Meeting recording started');
      return meetingRecord;

    } catch (error) {
      console.error('❌ useMemoryBridge: Error starting meeting recording:', error);
      toast.error('Failed to start meeting recording');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [user, demoMode]);

  const stopMeetingRecording = useCallback(async (audioBlob: Blob): Promise<any | undefined> => {
    if (demoMode) {
      console.log('🎯 useMemoryBridge: Demo mode - simulating meeting stop');
      setIsRecording(false);
      toast.success('Demo: Meeting processing completed! Found 3 actions to review');
      return { actions_found: 3 };
    }

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
  }, [currentMeeting, user, demoMode]);

  const fetchExtractedActions = useCallback(async (meetingId?: string): Promise<void> => {
    if (demoMode) {
      console.log('🔍 useMemoryBridge: Using demo extracted actions');
      return;
    }

    if (!user) {
      console.log('🔍 useMemoryBridge: No user found, cannot fetch extracted actions');
      return;
    }

    try {
      console.log('🔍 useMemoryBridge: Fetching extracted actions for user:', user.id, meetingId ? `meeting: ${meetingId}` : '(all meetings)');
      
      let query = supabase
        .from('extracted_actions')
        .select('*')
        .eq('user_id', user.id);

      if (meetingId) {
        query = query.eq('meeting_recording_id', meetingId);
      }

      const { data: actions, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('❌ useMemoryBridge: Error fetching extracted actions:', error);
        toast.error('Failed to fetch extracted actions');
        return;
      }

      console.log('✅ useMemoryBridge: Fetched extracted actions:', actions?.length || 0, 'actions');
      setExtractedActions(actions || []);
    } catch (error) {
      console.error('❌ useMemoryBridge: Unexpected error fetching extracted actions:', error);
      toast.error('Failed to fetch extracted actions');
    }
  }, [user, demoMode]);

  const confirmAction = useCallback(async (
    actionId: string, 
    status: 'confirmed' | 'modified' | 'rejected',
    modifications?: Record<string, any>,
    note?: string
  ): Promise<void> => {
    if (demoMode) {
      console.log('🎯 useMemoryBridge: Demo mode - simulating action confirmation');
      toast.success(`Demo: Action ${status}!`);
      return;
    }

    if (!user) return;

    try {
      // Update the action status
      const { error: updateError } = await supabase
        .from('extracted_actions')
        .update({ status, user_notes: note })
        .eq('id', actionId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

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

      // Refresh the actions list
      await fetchExtractedActions();
      
      toast.success(`Action ${status}`);

    } catch (error) {
      console.error('Error confirming action:', error);
      toast.error('Failed to confirm action');
    }
  }, [user, fetchExtractedActions, demoMode]);

  const fetchMeetingHistory = useCallback(async (): Promise<MeetingRecording[]> => {
    if (demoMode) {
      console.log('🔍 useMemoryBridge: Returning demo meeting history');
      return demoData.meetingHistory;
    }

    if (!user) {
      console.log('🔍 useMemoryBridge: No user found, returning empty meeting history');
      return [];
    }

    try {
      console.log('🔍 useMemoryBridge: Fetching meeting history for user:', user.id);
      
      const { data: meetings, error } = await supabase
        .from('meeting_recordings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ useMemoryBridge: Error fetching meeting history:', error);
        toast.error('Failed to fetch meeting history');
        return [];
      }

      console.log('✅ useMemoryBridge: Fetched meeting history:', meetings?.length || 0, 'meetings');
      return meetings || [];
    } catch (error) {
      console.error('❌ useMemoryBridge: Unexpected error fetching meeting history:', error);
      toast.error('Failed to fetch meeting history');
      return [];
    }
  }, [user, demoMode, demoData.meetingHistory]);

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