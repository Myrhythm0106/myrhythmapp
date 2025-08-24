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

    // Get the audio file URL
    const { data: urlData } = await supabase.storage
      .from('voice-recordings')
      .createSignedUrl(recording.file_path, 3600);

    if (!urlData?.signedUrl) throw new Error('Could not access recording file');

    // Download the audio file
    const audioResponse = await fetch(urlData.signedUrl);
    const audioBlob = await audioResponse.blob();

    // Convert to base64
    const reader = new FileReader();
    const audioDataPromise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data prefix
      };
    });
    reader.readAsDataURL(audioBlob);
    const audioData = await audioDataPromise;

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
        ended_at: new Date().toISOString()
      })
      .select()
      .single();

    if (meetingError) throw meetingError;

    // Process through edge function
    const { data, error: processError } = await supabase.functions.invoke('process-meeting-audio', {
      body: {
        audio: audioData,
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

    toast.success(`Processing complete! Found ${data.actionsExtracted} actions`);

    return {
      success: true,
      actionsCount: data.actionsExtracted,
      meetingId: meetingRecord.id
    };

  } catch (error) {
    console.error('Error processing saved recording:', error);
    toast.error('Failed to process recording');
    return { success: false };
  }
}