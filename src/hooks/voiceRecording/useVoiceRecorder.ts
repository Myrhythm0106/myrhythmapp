
import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { VoiceRecording } from '@/types/voiceRecording';
import {
  uploadVoiceRecording,
  fetchUserRecordings,
  deleteVoiceRecording,
  getRecordingSignedUrl
} from '@/utils/voiceRecording';
import { supabase } from '@/integrations/supabase/client';

export function useVoiceRecorder() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    console.log('🎤 Starting recording process...');
    
    // ✅ Pre-flight session check
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      toast.error('Your session has expired. Please sign in again to start recording.');
      return false;
    }
    
    // Check if session is about to expire (less than 10 minutes left)
    const expiresAt = session.expires_at || 0;
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = expiresAt - now;
    
    if (timeLeft < 600) { // Less than 10 minutes
      console.log('🔄 Session expiring soon, refreshing...');
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        toast.error('Failed to refresh session. Please sign in again.');
        return false;
      }
      toast.success('Session refreshed - ready to record! 🔄');
    }
    
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this browser');
      }

      console.log('🔍 Requesting microphone access...');
      
      // Check existing permissions first
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          console.log('🔒 Microphone permission status:', permission.state);
          
          if (permission.state === 'denied') {
            throw new Error('Microphone access denied. Please enable microphone permissions in your browser settings.');
          }
        } catch (permError) {
          console.log('⚠️ Could not check permissions:', permError);
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log('✅ Microphone access granted, setting up MediaRecorder...');
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : undefined;
      console.log('🎵 Using MIME type:', mimeType || 'default');
      
      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('📊 Audio chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
      };

      mediaRecorder.start();
      console.log('🎬 MediaRecorder started');
      
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      startTimeRef.current = Date.now();
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current && !isPaused) {
          setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 100);

      toast.success('Recording started successfully! 🎤');
      console.log('✅ Recording started successfully');
      return true;
    } catch (error) {
      console.error('❌ Error starting recording:', error);
      
      // Detailed error handling
      let errorMessage = 'Failed to start recording';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Microphone is already in use by another application.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Microphone constraints could not be satisfied.';
        } else if (error.name === 'SecurityError') {
          errorMessage = 'Recording blocked due to security restrictions.';
        } else {
          errorMessage = `Recording error: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
      console.log('💡 Troubleshooting tips:');
      console.log('1. Click the microphone icon in your browser address bar');
      console.log('2. Ensure microphone permissions are set to "Allow"');
      console.log('3. Try refreshing the page');
      console.log('4. Check if another application is using your microphone');
      
      return false;
    }
  }, [isPaused]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimeRef.current = Date.now() - duration * 1000;
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current && !isPaused) {
          setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 100);
    }
  }, [isRecording, isPaused, duration]);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null);
        return;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const tracks = mediaRecorderRef.current?.stream.getTracks();
        tracks?.forEach(track => track.stop());
        setIsRecording(false);
        setIsPaused(false);
        setDuration(0);
        startTimeRef.current = null;
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
      console.error('❌ No user found - cannot save recording');
      toast.error('Please sign in to save recordings');
      return null;
    }

    console.log('💾 Saving recording for user:', user.id);
    setIsProcessing(true);
    
    try {
      // Verify user session is still valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('❌ Session validation failed - saving locally:', sessionError);
        
        // ✅ Save recording locally to prevent data loss
        try {
          const { openDB } = await import('idb');
          
          // Store metadata in localStorage
          const localRecording = {
            title,
            category,
            description,
            shareWithHealthcare,
            timestamp: Date.now(),
            size: audioBlob.size
          };
          localStorage.setItem('pending-recording-meta', JSON.stringify(localRecording));
          
          // Store blob in IndexedDB (larger storage limit)
          const db = await openDB('myrhythm-voice-recordings', 1, {
            upgrade(db) {
              if (!db.objectStoreNames.contains('pending')) {
                db.createObjectStore('pending', { keyPath: 'timestamp' });
              }
            }
          });
          
          await db.put('pending', { 
            timestamp: Date.now(), 
            blob: audioBlob, 
            ...localRecording 
          });
          
          toast.warning('Session expired - recording saved locally. Sign in to upload it.', {
            action: {
              label: 'Sign In Now',
              onClick: () => window.location.href = '/auth'
            },
            duration: 10000
          });
          
          return null;
        } catch (storageError) {
          console.error('Failed to save locally:', storageError);
          toast.error('Session expired and failed to save locally. Recording may be lost.');
          return null;
        }
      }

      console.log('✅ Session valid, uploading recording...');
      
      const data = await uploadVoiceRecording(
        audioBlob,
        title,
        category,
        user.id,
        description,
        shareWithHealthcare
      );

      console.log('✅ Recording saved successfully:', data);
      toast.success('Recording saved successfully');
      await fetchRecordings(); // Refresh the list
      return data;
    } catch (error) {
      console.error('❌ Error saving recording:', error);
      
      // Check if it's an RLS policy error
      if (error instanceof Error) {
        if (error.message.includes('row-level security') || error.message.includes('RLS')) {
          console.error('🔒 RLS Policy Error - user_id mismatch detected');
          toast.error('Authentication error. Please try signing out and back in.');
        } else {
          toast.error(`Failed to save recording: ${error.message}`);
        }
      } else {
        toast.error('Failed to save recording');
      }
      
      return null;
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

  const formatDuration = useCallback((seconds: number) => {
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
