import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ProcessingProgress } from '@/types/processing';

export async function processSavedRecording(
  recordingId: string,
  userId: string,
  audioDuration: number = 0,
  onProgressUpdate?: (progress: ProcessingProgress) => void
): Promise<{ success: boolean; actionsCount?: number; meetingId?: string; hasTranscript?: boolean }> {
  const startTime = Date.now();
  const estimatedTotalTime = audioDuration > 0 ? Math.ceil(audioDuration * 0.5) : 60; // 50% of audio duration or 60s default
  
  try {
    console.log('processSavedRecording: Starting processing for recording ID:', recordingId);
    console.log('processSavedRecording: Audio duration:', audioDuration, 'Estimated time:', estimatedTotalTime);
    
    // Stage 1: Uploading (5%)
    onProgressUpdate?.({
      stage: 'uploading',
      progress: 5,
      elapsedTime: 0,
      estimatedRemaining: estimatedTotalTime,
      message: 'Preparing your recording...'
    });
    
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

    // Stage 2: Transcribing (10% - will update during polling)
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    onProgressUpdate?.({
      stage: 'transcribing',
      progress: 10,
      elapsedTime: elapsed,
      estimatedRemaining: Math.max(0, estimatedTotalTime - elapsed),
      message: 'Starting transcription...'
    });
    
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
    
    // Poll for completion with progress updates
    const result = await pollForCompletion(meetingRecord.id, startTime, estimatedTotalTime, onProgressUpdate);
    
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
async function pollForCompletion(
  meetingId: string, 
  startTime: number, 
  estimatedTotalTime: number,
  onProgressUpdate?: (progress: ProcessingProgress) => void
): Promise<{ success: boolean; actionsCount?: number; hasTranscript?: boolean }> {
  const maxAttempts = 60; // 2 minutes max
  let attempts = 0;
  
  // Check for completion every 2 seconds, up to 2 minutes
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    
    // Calculate progress: transcription is 10-80% of total process
    // Progress increases based on time elapsed vs estimated time
    const transcriptionProgress = Math.min(80, 10 + (elapsed / estimatedTotalTime) * 70);
    
    onProgressUpdate?.({
      stage: 'transcribing',
      progress: Math.floor(transcriptionProgress),
      elapsedTime: elapsed,
      estimatedRemaining: Math.max(0, estimatedTotalTime - elapsed),
      message: 'Transcribing your audio...'
    });
    
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
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      
      // Stage 4: Complete (100%)
      onProgressUpdate?.({
        stage: 'complete',
        progress: 100,
        elapsedTime: elapsed,
        estimatedRemaining: 0,
        message: `Found ${actionsCount} SMART ACTs!`
      });
      
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
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      
      onProgressUpdate?.({
        stage: 'failed',
        progress: 0,
        elapsedTime: elapsed,
        estimatedRemaining: 0,
        message: meeting.processing_error || 'Processing failed'
      });
      
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