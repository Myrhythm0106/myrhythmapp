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

  const startMeetingRecording = useCallback(async (setupData: MeetingSetupData, voiceRecordingId: string | null): Promise<any | null> => {
    if (demoMode) {
      console.log('🎯 useMemoryBridge: Demo mode - simulating meeting recording start');
      setIsRecording(true);
      const mockMeeting: MeetingRecording = {
        id: 'demo-meeting-' + Date.now(),
        user_id: user?.id || 'demo-user',
        recording_id: null,
        meeting_title: setupData.title,
        participants: setupData.participants,
        meeting_type: setupData.meetingType,
        meeting_context: setupData.context || '',
        location: setupData.location || '',
        emotional_context: setupData.emotionalContext || '',
        energy_level: setupData.energyLevel || 5,
        relationship_context: {},
        is_active: true,
        started_at: new Date().toISOString(),
        ended_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCurrentMeeting(mockMeeting);
      toast.success('Demo: PACT recording started!');
      return mockMeeting;
    }

    if (!user) {
      console.log('🔍 useMemoryBridge: No user found, cannot start recording');
      toast.error('Please sign in to start PACT recording');
      return null;
    }

    try {
      console.log('🔍 useMemoryBridge: Starting PACT recording for user:', user.id);
      setIsProcessing(true);

      // Create meeting recording immediately (voice recording will be added later)
      const { data: meetingRecord, error: meetingError } = await supabase
        .from('meeting_recordings')
        .insert({
          user_id: user.id,
          recording_id: voiceRecordingId, // Will be null initially, updated when audio is saved
          meeting_title: setupData.title,
          meeting_type: setupData.meetingType || 'general',
          meeting_context: setupData.context || '',
          location: setupData.location || '',
          emotional_context: setupData.emotionalContext || '',
          energy_level: setupData.energyLevel || 5,
          participants: setupData.participants.map(p => ({ name: p.name, relationship: p.relationship })),
          is_active: true,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (meetingError) throw meetingError;

      console.log('✅ useMemoryBridge: PACT recording created:', meetingRecord.id);
      setCurrentMeeting(meetingRecord as unknown as MeetingRecording);
      setIsRecording(true);
      return meetingRecord;

    } catch (error) {
      console.error('❌ useMemoryBridge: Error starting PACT recording:', error);
      toast.error('Failed to start PACT recording');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [user, demoMode]);

  const stopMeetingRecording = useCallback(async (audioBlob: Blob): Promise<any | undefined> => {
    if (demoMode) {
      console.log('🎯 useMemoryBridge: Demo mode - simulating meeting stop');
      setIsRecording(false);
      setCurrentMeeting(null);
      toast.success('Demo: PACT processing completed! Found 3 actions to review');
      return { actions_found: 3 };
    }

    if (!currentMeeting || !user) {
      toast.error('No active PACT recording to stop');
      return;
    }

    try {
      console.log('🔍 useMemoryBridge: Stopping PACT recording and processing audio...');
      setIsProcessing(true);
      setIsRecording(false);

      // Step 1: Save audio to Supabase Storage
      const fileName = `pact-recording-${currentMeeting.id}-${Date.now()}.wav`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, audioBlob);

      if (uploadError) {
        console.error('Error uploading audio:', uploadError);
        throw new Error('Failed to save audio recording');
      }

      console.log('✅ Audio uploaded successfully:', uploadData.path);

      // Step 2: Create voice recording entry
      const { data: voiceData, error: voiceError } = await supabase
        .from('voice_recordings')
        .insert({
          user_id: user.id,
          title: currentMeeting.meeting_title,
          category: 'memory_bridge',
          description: `PACT recording: ${currentMeeting.meeting_title}`,
          file_path: uploadData.path,
          file_size_bytes: audioBlob.size,
          duration_seconds: Math.floor(audioBlob.size / 16000), // Rough estimate
          access_level: 'private'
        })
        .select()
        .single();

      if (voiceError) {
        console.error('Error creating voice recording:', voiceError);
        throw new Error('Failed to create voice recording entry');
      }

      console.log('✅ Voice recording created:', voiceData.id);

      // Step 3: Update meeting recording with voice recording ID
      const { error: updateError } = await supabase
        .from('meeting_recordings')
        .update({ 
          recording_id: voiceData.id,
          ended_at: new Date().toISOString()
        })
        .eq('id', currentMeeting.id);

      if (updateError) {
        console.error('Error updating meeting:', updateError);
      }

      // Step 4: Convert audio blob to base64 and process
      const reader = new FileReader();
      const audioDataPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data:audio/webm;base64, prefix
        };
      });
      reader.readAsDataURL(audioBlob);
      
      const audioData = await audioDataPromise;

      console.log('🔍 Processing audio with OpenAI...');
      toast.info('Transcribing and analyzing for PACT items...');

      // Step 5: Process the audio through our edge function
      const { data, error } = await supabase.functions.invoke('process-meeting-audio', {
        body: {
          audioData,
          meetingId: currentMeeting.id,
          userId: user.id
        }
      });

      if (error) {
        console.error('Error processing audio:', error);
        throw new Error('Failed to process conversation. Please try again.');
      }

      console.log('✅ PACT processing result:', data);

      if (data?.success) {
        const count = data.actions_found || 0;
        if (count > 0) {
          toast.success(`🎉 Captured ${count} PACT item${count > 1 ? 's' : ''}! Check Review Actions.`);
        } else {
          toast.info('Recording saved, but no clear PACT items were detected in this conversation.');
        }
        
        // Refresh extracted actions
        fetchExtractedActions();
      } else {
        toast.error('Failed to analyze conversation content');
      }
      
      setCurrentMeeting(null);
      return data;

    } catch (error) {
      console.error('❌ Error processing PACT recording:', error);
      toast.error('Failed to process recording. Please try again.');
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
      setExtractedActions((actions || []) as ExtractedAction[]);
    } catch (error) {
      console.error('❌ useMemoryBridge: Unexpected error fetching extracted actions:', error);
      toast.error('Failed to fetch extracted actions');
    }
  }, [user, demoMode, setExtractedActions]);

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
      fetchExtractedActions();
      
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
      return (meetings || []) as unknown as MeetingRecording[];
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