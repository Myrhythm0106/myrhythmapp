import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function processSavedRecording(
  recordingId: string,
  userId: string
): Promise<{ success: boolean; actionsCount?: number; meetingId?: string; hasTranscript?: boolean }> {
  try {
    console.log('processSavedRecording: Starting processing for recording ID:', recordingId);
    
    // Get the recording details
    const { data: recording, error: recordingError } = await supabase
      .from('voice_recordings')
      .select('*')
      .eq('id', recordingId)
      .eq('user_id', userId)
      .single();
      
    console.log('processSavedRecording: Recording query result:', { recording, error: recordingError });

    if (recordingError) {
      console.error('processSavedRecording: Error fetching recording:', recordingError);
      throw recordingError;
    }
    if (!recording) {
      console.error('processSavedRecording: Recording not found');
      throw new Error('Recording not found');
    }

    // Create meeting recording record
    console.log('processSavedRecording: Creating meeting record...');
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
      
    console.log('processSavedRecording: Meeting record result:', { meetingRecord, error: meetingError });

    if (meetingError) {
      console.error('processSavedRecording: Error creating meeting record:', meetingError);
      throw meetingError;
    }

    // Start background processing with file path (no large payloads)
    console.log('processSavedRecording: Invoking process-meeting-audio function...');
    console.log('processSavedRecording: Function params:', {
      filePath: recording.file_path,
      meetingId: meetingRecord.id,
      userId: userId,
      hasFilePath: !!recording.file_path
    });
    
    const { data, error: processError } = await supabase.functions.invoke('process-meeting-audio', {
      body: {
        filePath: recording.file_path,
        meetingId: meetingRecord.id,
        userId: userId, // Explicitly include userId
        meetingData: {
          title: recording.title,
          type: 'informal',
          participants: [],
          context: recording.description,
          recording_id: recordingId
        }
      }
    });
    
    console.log('processSavedRecording: Edge function response:', { data, error: processError });

    if (processError) {
      console.error('processSavedRecording: Edge function error:', processError);
      
      // Update meeting record with error status
      await supabase
        .from('meeting_recordings')
        .update({ 
          processing_status: 'error',
          processing_error: processError.message || 'Processing failed'
        })
        .eq('id', meetingRecord.id);
      
      throw processError;
    }

    console.log('processSavedRecording: Processing initiated successfully');
    
    // Show immediate feedback for background processing
    toast.success('Processing started! We\'ll extract ACTs in the background.');

    // Poll for completion
    const result = await pollForCompletion(meetingRecord.id);
    
    console.log('processSavedRecording: Final result:', result);
    
    return {
      success: result.success,
      actionsCount: result.actionsCount,
      meetingId: meetingRecord.id,
      hasTranscript: result.hasTranscript || false
    };

  } catch (error) {
    console.error('processSavedRecording: Error processing saved recording:', error);
    toast.error(`Failed to process recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false };
  }
}

// Poll for processing completion
async function pollForCompletion(meetingId: string): Promise<{ success: boolean; actionsCount?: number; hasTranscript?: boolean }> {
  const maxAttempts = 60; // 2 minutes max
  let attempts = 0;
  
  // Check for completion every 2 seconds, up to 2 minutes
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if actions have been extracted
    const { data: actions } = await supabase
      .from('extracted_actions')
      .select('id')
      .eq('meeting_recording_id', meetingId);

    // Check meeting status
    const { data: meeting } = await supabase
      .from('meeting_recordings')
      .select('processing_status, processing_error, transcript')
      .eq('id', meetingId)
      .single();

    if (meeting?.processing_status === 'completed') {
      const actionsCount = actions?.length || 0;
      const hasTranscript = !!meeting.transcript;
      
      if (actionsCount > 0) {
        toast.success(`Processing complete! ${actionsCount} actions extracted.`);
      } else if (hasTranscript) {
        toast.success("Transcript saved successfully! No actionable items found.");
      } else {
        toast.success("Processing complete!");
      }
      
      return { success: true, actionsCount, hasTranscript };
    }
    
    if (meeting?.processing_status === 'failed') {
      const hasTranscript = !!meeting.transcript;
      
      if (meeting.processing_error?.includes('OpenAI API key') || meeting.processing_error?.includes('not configured')) {
        if (hasTranscript) {
          toast.success("Transcript saved successfully! Action extraction unavailable due to API configuration.");
        } else {
          toast.error("Processing failed due to API configuration issues.");
        }
      } else if (meeting.processing_error?.includes('quota')) {
        if (hasTranscript) {
          toast.success("Transcript saved! Action extraction failed due to API quota limits.");
        } else {
          toast.error("Processing failed due to API quota limits. Please try again later.");
        }
      } else {
        if (hasTranscript) {
          toast.success("Transcript saved! Action extraction encountered an error.");
        } else {
          toast.error("Processing failed. Please try again.");
        }
      }
      
      return { success: hasTranscript, actionsCount: 0, hasTranscript };
    }
    
    attempts++;
  }
  
  toast.error("Processing is taking longer than expected. Check back later.");
  return { success: false, actionsCount: 0, hasTranscript: false };
}