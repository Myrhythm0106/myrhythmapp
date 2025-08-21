import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VoiceRecording {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_path: string;
  duration_seconds?: number;
  transcription?: string;
  access_level: string;
  created_at: string;
}

export function useVoiceRecorder() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setDuration(0);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000); // Collect data every 1000ms
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
      return false;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  }, [isRecording, isPaused]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Clean up
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        setIsRecording(false);
        setIsPaused(false);
        
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  const saveRecording = useCallback(async (
    audioBlob: Blob,
    title: string,
    category: string = 'general',
    description?: string,
    shareWithHealthcare: boolean = false
  ): Promise<VoiceRecording | null> => {
    if (!user) return null;

    try {
      setIsProcessing(true);
      
      const fileName = `${user.id}/${Date.now()}.webm`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      // Create database record
      const { data: recording, error: dbError } = await supabase
        .from('voice_recordings')
        .insert({
          user_id: user.id,
          title,
          description,
          category,
          file_path: fileName,
          file_size_bytes: audioBlob.size,
          duration_seconds: duration,
          access_level: shareWithHealthcare ? 'healthcare' : 'private'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      await fetchRecordings();
      toast.success('Recording saved successfully!');
      
      return recording;
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [user, duration]);

  const fetchRecordings = useCallback(async (): Promise<void> => {
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
    }
  }, [user]);

  const deleteRecording = useCallback(async (id: string): Promise<void> => {
    if (!user) return;

    try {
      // Get recording info
      const { data: recording, error: fetchError } = await supabase
        .from('voice_recordings')
        .select('file_path')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('voice-recordings')
        .remove([recording.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('voice_recordings')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      await fetchRecordings();
      toast.success('Recording deleted successfully');
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Failed to delete recording');
    }
  }, [user, fetchRecordings]);

  const getRecordingUrl = useCallback(async (filePath: string): Promise<string | null> => {
    try {
      const { data } = await supabase.storage
        .from('voice-recordings')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error getting recording URL:', error);
      return null;
    }
  }, []);

  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    isRecording,
    isPaused,
    isProcessing,
    recordings,
    duration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    saveRecording,
    fetchRecordings,
    deleteRecording,
    getRecordingUrl,
    formatDuration
  };
}