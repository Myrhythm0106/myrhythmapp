
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export interface VoiceRecording {
  id: string;
  title: string;
  description?: string;
  category: string; // Changed from union type to string to match database
  file_path: string; // Added missing property
  duration_seconds?: number;
  transcription?: string;
  created_at: string;
  access_level: 'private' | 'healthcare';
  legal_retention_required: boolean;
}

export function useVoiceRecorder() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const tracks = mediaRecorderRef.current?.stream.getTracks();
        tracks?.forEach(track => track.stop());
        setIsRecording(false);
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
    });
  }, [isRecording]);

  const saveRecording = useCallback(async (
    audioBlob: Blob,
    title: string,
    category: string, // Changed from union type to string
    description?: string,
    shareWithHealthcare: boolean = false
  ) => {
    if (!user) {
      toast.error('Please sign in to save recordings');
      return;
    }

    setIsProcessing(true);
    try {
      const recordingId = uuidv4();
      const fileName = `${user.id}/${recordingId}.wav`;
      
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
          user_id: user.id,
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

      toast.success('Recording saved successfully');
      await fetchRecordings(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  const fetchRecordings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('voice_recordings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecordings(data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load recordings');
    }
  }, [user]);

  const deleteRecording = useCallback(async (recordingId: string) => {
    if (!user) return;

    try {
      // Get the recording to find the file path
      const { data: recording, error: fetchError } = await supabase
        .from('voice_recordings')
        .select('file_path, legal_retention_required')
        .eq('id', recordingId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      if (recording.legal_retention_required) {
        toast.error('This recording cannot be deleted due to legal retention requirements');
        return;
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
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      toast.success('Recording deleted');
      await fetchRecordings(); // Refresh the list
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Failed to delete recording');
    }
  }, [user, fetchRecordings]);

  const getRecordingUrl = useCallback(async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('voice-recordings')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting recording URL:', error);
      toast.error('Failed to load recording');
      return null;
    }
  }, []);

  return {
    isRecording,
    isProcessing,
    recordings,
    startRecording,
    stopRecording,
    saveRecording,
    fetchRecordings,
    deleteRecording,
    getRecordingUrl
  };
}
