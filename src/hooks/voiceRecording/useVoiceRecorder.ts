
import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { VoiceRecording } from '@/types/voiceRecording';
import {
  uploadVoiceRecording,
  fetchUserRecordings,
  deleteVoiceRecording,
  getRecordingSignedUrl
} from '@/utils/voiceRecording';

export function useVoiceRecorder() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      setIsPaused(false);
      setRecordingDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      toast.info('Recording paused');
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      toast.info('Recording resumed');
    }
  }, [isRecording, isPaused]);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null);
        return;
      }

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const tracks = mediaRecorderRef.current?.stream.getTracks();
        tracks?.forEach(track => track.stop());
        setIsRecording(false);
        setIsPaused(false);
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
    });
  }, [isRecording]);

  const saveRecording = useCallback(async (
    audioBlob: Blob,
    title: string,
    category: string,
    description?: string,
    shareWithHealthcare: boolean = false
  ) => {
    if (!user) {
      toast.error('Please sign in to save recordings');
      return;
    }

    setIsProcessing(true);
    try {
      const data = await uploadVoiceRecording(
        audioBlob,
        title,
        category,
        user.id,
        description,
        shareWithHealthcare
      );

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
      const data = await fetchUserRecordings(user.id);
      setRecordings(data);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load recordings');
    }
  }, [user]);

  const deleteRecording = useCallback(async (recordingId: string) => {
    if (!user) return;

    try {
      await deleteVoiceRecording(recordingId, user.id);
      toast.success('Recording deleted');
      await fetchRecordings(); // Refresh the list
    } catch (error) {
      console.error('Error deleting recording:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete recording');
      }
    }
  }, [user, fetchRecordings]);

  const getRecordingUrl = useCallback(async (filePath: string) => {
    try {
      return await getRecordingSignedUrl(filePath);
    } catch (error) {
      console.error('Error getting recording URL:', error);
      toast.error('Failed to load recording');
      return null;
    }
  }, []);

  return {
    isRecording,
    isPaused,
    isProcessing,
    recordings,
    recordingDuration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    saveRecording,
    fetchRecordings,
    deleteRecording,
    getRecordingUrl
  };
}
