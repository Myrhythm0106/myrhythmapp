import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useDemoData } from '@/hooks/useDemoData';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { 
  MeetingRecording, 
  ExtractedAction, 
  ConversationContext, 
  MeetingSetupData 
} from '@/types/memoryBridge';

export const useMemoryBridge = () => {
  const { user } = useAuth();
  const { demoMode } = useSubscription();
  const { demoExtractedActions } = useDemoData();
  const [meetingRecordings, setMeetingRecordings] = useState<MeetingRecording[]>([]);
  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([]);
  const [conversations, setConversations] = useState<ConversationContext[]>([]);
  const [activeMeeting, setActiveMeeting] = useState<MeetingRecording | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<MeetingRecording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPACTFlow, setShowPACTFlow] = useState(false);
  const [lastRecordingData, setLastRecordingData] = useState<{
    meetingId: string;
    audioData: string;
  } | null>(null);

  // Fetch all data when user changes
  useEffect(() => {
    if (user) {
      fetchMeetingRecordings();
      fetchExtractedActions();
      fetchConversations();
    }
  }, [user]);

  const fetchMeetingRecordings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('meeting_recordings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const typedRecordings = (data || []).map(record => ({
        ...record,
        participants: record.participants as any[], // Type cast Json to Participant[]
      })) as MeetingRecording[];
      setMeetingRecordings(typedRecordings);
      
      // Set active meeting if one exists
      const active = typedRecordings.find(meeting => meeting.is_active);
      setActiveMeeting(active || null);
    } catch (error) {
      console.error('Error fetching meeting recordings:', error);
      toast.error('Failed to fetch meeting recordings');
    }
  };

  const fetchExtractedActions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('extracted_actions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExtractedActions((data || []) as ExtractedAction[]);
    } catch (error) {
      console.error('Error fetching extracted actions:', error);
      toast.error('Failed to fetch extracted actions');
    }
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversation_contexts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations((data || []) as ConversationContext[]);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to fetch conversations');
    }
  };

  // New unified recording flow
  const startMeetingRecording = async (meetingData: MeetingSetupData, voiceRecordingId?: string | null): Promise<MeetingRecording | null> => {
    if (!user) {
      toast.error('Please log in to start a meeting');
      return null;
    }

    try {
      setLoading(true);
      setIsRecording(true);

      // End any existing active meeting first
      if (activeMeeting) {
        await endMeeting(activeMeeting.id);
      }

      const { data, error } = await supabase
        .from('meeting_recordings')
        .insert({
          user_id: user.id,
          recording_id: voiceRecordingId || crypto.randomUUID(),
          meeting_title: meetingData.title,
          participants: meetingData.participants as any,
          meeting_type: meetingData.meetingType,
          meeting_context: meetingData.context,
          location: meetingData.location,
          energy_level: meetingData.energyLevel,
          emotional_context: meetingData.emotionalContext,
          relationship_context: {},
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      const meeting = {
        ...data,
        participants: data.participants as any[]
      } as MeetingRecording;

      setActiveMeeting(meeting);
      setCurrentMeeting(meeting);
      await fetchMeetingRecordings();
      
      // Notify support circle of recording start
      await notifySupportCircle('recording_started', {
        meetingTitle: meetingData.title,
        participants: meetingData.participants
      });

      toast.success('Recording started - your support circle has been notified');
      return meeting;
    } catch (error) {
      console.error('Error starting meeting:', error);
      toast.error('Failed to start meeting');
      setIsRecording(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const stopMeetingRecording = async (audioBlob?: Blob): Promise<void> => {
    if (!currentMeeting) return;

    try {
      setIsProcessing(true);

      // Convert audio blob to base64 if provided
      let audioData = '';
      if (audioBlob) {
        const reader = new FileReader();
        audioData = await new Promise((resolve) => {
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]); // Remove data:audio/... prefix
          };
          reader.readAsDataURL(audioBlob);
        });
      }

      // End the meeting
      await endMeeting(currentMeeting.id);

      // Store recording data for PACT generation
      setLastRecordingData({
        meetingId: currentMeeting.id,
        audioData
      });

      // Show PACT generation flow
      setShowPACTFlow(true);
      setIsRecording(false);
      setCurrentMeeting(null);

      toast.success('Recording saved! Generate your PACT report to extract commitments.');
    } catch (error) {
      console.error('Error stopping meeting:', error);
      toast.error('Failed to process recording');
      setIsRecording(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const completePACTGeneration = async () => {
    setShowPACTFlow(false);
    setLastRecordingData(null);
    
    // Notify support circle of PACT completion
    await notifySupportCircle('pact_generated', {
      extractedActionsCount: extractedActions.length
    });

    toast.success('PACT report complete! Your support circle has been notified of new commitments.');
    await fetchExtractedActions();
  };

  const notifySupportCircle = async (eventType: string, data: any) => {
    if (!user) return;

    try {
      // Get support circle members
      const { data: members } = await supabase
        .from('support_circle_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .eq('can_receive_alerts', true);

      if (members && members.length > 0) {
        // Create accountability alert
        await supabase
          .from('accountability_alerts')
          .insert({
            user_id: user.id,
            alert_type: eventType,
            title: eventType === 'recording_started' ? 'Recording Started' : 'PACT Report Generated',
            message: eventType === 'recording_started' 
              ? `Recording started: ${data.meetingTitle}` 
              : `New PACT report with ${data.extractedActionsCount} action items`,
            severity: 'info',
            target_members: members.map(m => m.member_email || m.member_name)
          });
      }
    } catch (error) {
      console.error('Error notifying support circle:', error);
    }
  };

  const startMeeting = async (meetingData: MeetingSetupData): Promise<string | null> => {
    if (!user) {
      toast.error('Please log in to start a meeting');
      return null;
    }

    try {
      setLoading(true);

      // End any existing active meeting first
      if (activeMeeting) {
        await endMeeting(activeMeeting.id);
      }

      const { data, error } = await supabase
        .from('meeting_recordings')
        .insert({
          user_id: user.id,
          recording_id: crypto.randomUUID(),
          meeting_title: meetingData.title,
          participants: meetingData.participants as any, // Type cast for JSON
          meeting_type: meetingData.meetingType,
          meeting_context: meetingData.context,
          location: meetingData.location,
          energy_level: meetingData.energyLevel,
          emotional_context: meetingData.emotionalContext,
          relationship_context: {},
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setActiveMeeting({
        ...data,
        participants: data.participants as any[]
      } as MeetingRecording);
      await fetchMeetingRecordings();
      toast.success('Meeting started successfully');
      return data.id;
    } catch (error) {
      console.error('Error starting meeting:', error);
      toast.error('Failed to start meeting');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const endMeeting = async (meetingId: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('meeting_recordings')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', meetingId);

      if (error) throw error;

      setActiveMeeting(null);
      await fetchMeetingRecordings();
      toast.success('Meeting ended');
    } catch (error) {
      console.error('Error ending meeting:', error);
      toast.error('Failed to end meeting');
    } finally {
      setLoading(false);
    }
  };

  const processMeetingAudio = async (audioData: string, meetingId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('process-meeting-audio', {
        body: {
          audioData,
          meetingId,
          userId: user?.id
        }
      });

      if (error) throw error;

      toast.success('Audio processed successfully');
      await fetchExtractedActions();
      return data;
    } catch (error) {
      console.error('Error processing meeting audio:', error);
      toast.error('Failed to process audio');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = async (actionId: string, status: 'confirmed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('extracted_actions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', actionId);

      if (error) throw error;

      // Create action confirmation record
      await supabase
        .from('action_confirmations')
        .insert({
          user_id: user?.id,
          extracted_action_id: actionId,
          confirmation_status: status,
          confirmed_at: new Date().toISOString()
        });

      await fetchExtractedActions();
      toast.success(`Action ${status} successfully`);
    } catch (error) {
      console.error('Error confirming action:', error);
      toast.error('Failed to confirm action');
    }
  };

  const scheduleAction = async (actionId: string, scheduleData: any) => {
    if (!user) return;

    try {
      // First, get the action to use its details
      const action = extractedActions.find(a => a.id === actionId);
      if (!action) throw new Error('Action not found');

      // Create calendar event
      const { data: eventData, error: eventError } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: scheduleData.title,
          description: scheduleData.description,
          date: scheduleData.date,
          time: scheduleData.time,
          type: 'task',
          category: action.action_type
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Create daily action linked to this calendar event
      const { error: actionError } = await supabase
        .from('daily_actions')
        .insert({
          user_id: user.id,
          title: scheduleData.title,
          description: scheduleData.description,
          date: scheduleData.date,
          start_time: scheduleData.time,
          action_type: action.action_type === 'promise' ? 'promise_keeper' : 'regular',
          status: 'pending',
          calendar_event_id: eventData.id
        });

      if (actionError) throw actionError;

      // Update the extracted action to mark it as scheduled
      await supabase
        .from('extracted_actions')
        .update({ 
          status: 'confirmed',
          user_notes: `Scheduled for ${scheduleData.date} at ${scheduleData.time}`
        })
        .eq('id', actionId);

      await fetchExtractedActions();
      toast.success('Action scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling action:', error);
      toast.error('Failed to schedule action');
    }
  };

  return {
    // State - Use demo data if in demo mode
    meetingRecordings,
    extractedActions: demoMode ? demoExtractedActions : extractedActions,
    conversations,
    activeMeeting,
    currentMeeting,
    loading,
    isRecording,
    isProcessing,
    showPACTFlow,
    lastRecordingData,

    // Unified Recording Actions
    startMeetingRecording,
    stopMeetingRecording,
    completePACTGeneration,

    // Legacy Actions (for compatibility)
    startMeeting,
    endMeeting,
    processMeetingAudio,
    confirmAction,
    scheduleAction,

    // Refresh functions
    fetchMeetingRecordings,
    fetchExtractedActions,
    fetchConversations
  };
};