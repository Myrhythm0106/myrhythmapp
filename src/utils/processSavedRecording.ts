import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function processSavedRecording(
  recordingId: string,
  userId: string
): Promise<{ success: boolean; actionsCount?: number; meetingId?: string }> {
  try {
    // Get the recording details
    const { data: recording, error: recordingError } = await supabase
      .from('voice_recordings')
      .select('*')
      .eq('id', recordingId)
      .eq('user_id', userId)
      .single();

    if (recordingError) throw recordingError;
    if (!recording) throw new Error('Recording not found');

    // Create meeting recording record
    const { data: meetingRecord, error: meetingError } = await supabase
      .from('meeting_recordings')
      .insert({
        user_id: userId,
        recording_id: recordingId,
        meeting_title: recording.title,
        meeting_type: 'informal',
        participants: [],
        is_active: false,
        started_at: recording.created_at,
        ended_at: new Date().toISOString(),
        processing_status: 'pending'
      })
      .select()
      .single();

    if (meetingError) throw meetingError;

    // Start background processing with file path (no large payloads)
    const { data, error: processError } = await supabase.functions.invoke('process-meeting-audio', {
      body: {
        filePath: recording.file_path,
        meetingId: meetingRecord.id,
        meetingData: {
          title: recording.title,
          type: 'informal',
          participants: [],
          context: recording.description,
          recording_id: recordingId
        }
      }
    });

    if (processError) throw processError;

    // Show immediate feedback for background processing
    toast.success('Processing started! We\'ll extract ACTs in the background.');

    // Start polling for completion
    const result = await pollForCompletion(meetingRecord.id);
    
    return {
      success: result.success,
      actionsCount: result.actionsCount,
      meetingId: meetingRecord.id
    };

  } catch (error) {
    console.error('Error processing saved recording:', error);
    toast.error('Failed to process recording');
    return { success: false };
  }
}

// Poll for processing completion
async function pollForCompletion(meetingId: string): Promise<{ success: boolean; actionsCount?: number }> {
  const maxAttempts = 60; // 2 minutes max
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      // Check if actions have been extracted
      const { data: actions, error: actionsError } = await supabase
        .from('extracted_actions')
        .select('id')
        .eq('meeting_recording_id', meetingId);

      if (actionsError) throw actionsError;

      // Check processing status
      const { data: meeting, error: meetingError } = await supabase
        .from('meeting_recordings')
        .select('processing_status, processing_error')
        .eq('id', meetingId)
        .single();

      if (meetingError) throw meetingError;

      if (meeting.processing_status === 'failed') {
        const errorMsg = meeting.processing_error || 'Unknown error';
        if (errorMsg.includes('insufficient_quota') || errorMsg.includes('quota')) {
          toast.error('AI quota exceeded. Please try again later or contact support.');
        } else {
          toast.error(`Processing failed: ${errorMsg}`);
        }
        return { success: false };
      }

      if (actions && actions.length > 0) {
        toast.success(`ACTs ready! Found ${actions.length} actionable items.`);
        return { success: true, actionsCount: actions.length };
      }

      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
      
    } catch (error) {
      console.error('Polling error:', error);
      break;
    }
  }

  toast.error('Processing is taking longer than expected. Please check back later.');
  return { success: false };
}