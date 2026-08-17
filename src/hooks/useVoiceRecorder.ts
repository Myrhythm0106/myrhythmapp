import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
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

const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4;codecs=mp4a.40.2',
  'audio/mp4',
  'audio/ogg;codecs=opus',
];

export function pickRecordingMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return MIME_CANDIDATES.find(type => MediaRecorder.isTypeSupported(type));
}

export function extensionForMimeType(mimeType?: string): string {
  const base = (mimeType || '').split(';')[0].trim();
  switch (base) {
    case 'audio/mp4':
      return 'm4a';
    case 'audio/mpeg':
      return 'mp3';
    case 'audio/ogg':
      return 'ogg';
    case 'audio/wav':
    case 'audio/x-wav':
      return 'wav';
    case 'audio/webm':
      return 'webm';
    default:
      return 'webm';
  }
}

export function useVoiceRecorder() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [duration, setDuration] = useState(0);
  const [recordedBytes, setRecordedBytes] = useState(0);
  const [recordingMimeType, setRecordingMimeType] = useState<string>('audio/webm');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mimeTypeRef = useRef<string>('audio/webm');

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const mimeType = pickRecordingMimeType();
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 64000 })
        : new MediaRecorder(stream);

      // The recorder is the source of truth for the actual container used
      // (iOS Safari can't do WebM and silently records MP4).
      const effectiveMime = mediaRecorder.mimeType || mimeType || 'audio/webm';
      mimeTypeRef.current = effectiveMime;
      setRecordingMimeType(effectiveMime);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setDuration(0);
      setRecordedBytes(0);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          setRecordedBytes(prev => prev + event.data.size);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast.error('The microphone stopped unexpectedly. Please try recording again.');
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
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });
        
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

        if (audioBlob.size === 0) {
          console.error('stopRecording: captured 0 bytes of audio');
          toast.error('That recording came through empty — check your microphone and try again.');
          resolve(null);
          return;
        }
        
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

      const contentType = audioBlob.type || mimeTypeRef.current || 'audio/webm';
      const extension = extensionForMimeType(contentType);
      const fileName = `${user.id}/${Date.now()}.${extension}`;
      const durationMinutes = Math.ceil(duration / 60);
      
      // Upload to storage — content type must match the real bytes, otherwise
      // transcription rejects the file (iOS records MP4, not WebM).
      const { error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, audioBlob, { contentType, upsert: false });

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

      // Update daily usage tracking
      const today = new Date().toISOString().split('T')[0];
      const currentPeriod = new Date();
      const periodStart = new Date(currentPeriod.getFullYear(), currentPeriod.getMonth(), 1);
      
      // Get or create usage tracking record
      const { data: usageData } = await supabase
        .from('recording_usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('period_start', periodStart.toISOString().split('T')[0])
        .maybeSingle();

      if (usageData) {
        // Update existing record
        const newDailyDuration = (usageData.last_recording_date === today) 
          ? (usageData.daily_duration_minutes || 0) + durationMinutes
          : durationMinutes; // Reset if new day

        await supabase
          .from('recording_usage_tracking')
          .update({
            daily_duration_minutes: newDailyDuration,
            last_recording_date: today,
            recording_duration_minutes: (usageData.recording_duration_minutes || 0) + durationMinutes,
            recording_count: (usageData.recording_count || 0) + 1
          })
          .eq('id', usageData.id);
      }

      await fetchRecordings();
      toast.success('Recording saved successfully!');
      
      return recording;
    } catch (error) {
      console.error('Error saving recording:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Couldn't save the recording: ${message}`);
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