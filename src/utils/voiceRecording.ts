
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { VoiceRecording } from '@/types/voiceRecording';

export const uploadVoiceRecording = async (
  audioBlob: Blob,
  title: string,
  category: string,
  userId: string,
  description?: string,
  shareWithHealthcare: boolean = false
) => {
  const recordingId = uuidv4();
  const fileName = `${userId}/${recordingId}.wav`;
  
  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('voice-recordings')
    .upload(fileName, audioBlob);

  if (uploadError) throw uploadError;

  // Save metadata to database
  const { data, error: dbError } = await supabase
    .from('voice_recordings')
    .insert({
      id: recordingId,
      user_id: userId,
      title,
      description,
      category,
      file_path: fileName,
      file_size_bytes: audioBlob.size,
      access_level: shareWithHealthcare ? 'healthcare' : 'private',
      legal_retention_required: category === 'medical'
    })
    .select()
    .single();

  if (dbError) throw dbError;
  return data;
};

export const fetchUserRecordings = async (userId: string): Promise<VoiceRecording[]> => {
  const { data, error } = await supabase
    .from('voice_recordings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Type cast the database response to match our interface
  const typedRecordings: VoiceRecording[] = (data || []).map(record => ({
    ...record,
    access_level: record.access_level as 'private' | 'healthcare'
  }));
  
  return typedRecordings;
};

export const deleteVoiceRecording = async (recordingId: string, userId: string) => {
  // Get the recording to find the file path
  const { data: recording, error: fetchError } = await supabase
    .from('voice_recordings')
    .select('file_path, legal_retention_required')
    .eq('id', recordingId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;

  if (recording.legal_retention_required) {
    throw new Error('This recording cannot be deleted due to legal retention requirements');
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('voice-recordings')
    .remove([recording.file_path]);

  if (storageError) throw storageError;

  // Delete from database
  const { error: dbError } = await supabase
    .from('voice_recordings')
    .delete()
    .eq('id', recordingId)
    .eq('user_id', userId);

  if (dbError) throw dbError;
};

export const getRecordingSignedUrl = async (filePath: string): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from('voice-recordings')
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
};
