import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ensureSession } from '@/utils/ensureSession';

export type MicPermission = 'granted' | 'denied' | 'prompt' | 'unknown';

/**
 * A page inside an iframe can only use the microphone when the embedding
 * frame grants it (allow="microphone"). Chrome refuses getUserMedia outright
 * in that case, which is the classic "I tapped record and nothing happened".
 */
export function detectMicBlocker(): { blocked: boolean; reason?: 'frame' | 'insecure' | 'unsupported' } {
  if (typeof window === 'undefined') return { blocked: true, reason: 'unsupported' };
  if (!window.isSecureContext) return { blocked: true, reason: 'insecure' };
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    return { blocked: true, reason: 'unsupported' };
  }

  const inFrame = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  if (inFrame) {
    const fp = (document as unknown as {
      featurePolicy?: { allowsFeature: (f: string) => boolean };
      permissionsPolicy?: { allowsFeature: (f: string) => boolean };
    });
    const policy = fp.featurePolicy ?? fp.permissionsPolicy;
    if (policy && typeof policy.allowsFeature === 'function') {
      try {
        if (!policy.allowsFeature('microphone')) return { blocked: true, reason: 'frame' };
      } catch {
        /* fall through — let getUserMedia decide */
      }
    }
  }

  return { blocked: false };
}


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
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [micPermission, setMicPermission] = useState<MicPermission>('unknown');
  const [micBlockReason, setMicBlockReason] = useState<'frame' | 'insecure' | 'unsupported' | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mimeTypeRef = useRef<string>('audio/webm');

  const refreshMicStatus = useCallback(async () => {
    const blocker = detectMicBlocker();
    setMicBlockReason(blocker.blocked ? blocker.reason ?? 'unsupported' : null);
    if (blocker.blocked) return;
    try {
      const status = await navigator.permissions?.query({ name: 'microphone' as PermissionName });
      if (status) {
        setMicPermission(status.state as MicPermission);
        status.onchange = () => setMicPermission(status.state as MicPermission);
        return;
      }
    } catch {
      /* Permissions API unavailable (Safari) — leave as unknown. */
    }
    setMicPermission('unknown');
  }, []);

  useEffect(() => {
    void refreshMicStatus();
  }, [refreshMicStatus]);

  const startRecording = useCallback(async (): Promise<boolean> => {
    // Fail loudly and specifically — a silent "nothing happened" is the worst
    // possible outcome on a capture button.
    if (typeof window === 'undefined') return false;

    const blocker = detectMicBlocker();
    if (blocker.blocked) {
      setMicBlockReason(blocker.reason ?? 'unsupported');
      console.warn('startRecording: blocked before getUserMedia', blocker.reason);
      if (blocker.reason === 'frame') {
        toast.error('The browser is blocking the microphone inside this preview frame. Open the app in its own tab to record.');
      } else if (blocker.reason === 'insecure') {
        toast.error('Recording needs a secure (https) connection. Open the app over https and try again.');
      } else {
        toast.error("This browser can't record audio. Please use Chrome, or Safari on iPhone.");
      }
      return false;
    }
    setMicBlockReason(null);
    setIsStarting(true);
    try {
      return await beginCapture();
    } finally {
      setIsStarting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beginCapture = useCallback(async (): Promise<boolean> => {


    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (error) {
      const name = (error as DOMException)?.name || '';
      console.error('startRecording: getUserMedia failed', name, error);
      if (name === 'NotAllowedError' || name === 'SecurityError') {
        setMicPermission('denied');
        toast.error('Microphone access is blocked. Allow the microphone for this site in your browser settings, then tap record again.');

      } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
        toast.error('No microphone was found on this device.');
      } else if (name === 'NotReadableError') {
        toast.error('Another app is using the microphone. Close it (calls, voice memos) and try again.');
      } else {
        toast.error('Could not start the microphone. Please try again.');
      }
      return false;
    }

    try {
      const track = stream.getAudioTracks()[0];
      if (!track || track.readyState !== 'live') {
        stream.getTracks().forEach(t => t.stop());
        toast.error('The microphone did not start. Please try again.');
        return false;
      }
      if (track.muted) {
        toast.warning('Your microphone appears muted — unmute it or the recording will be silent.');
      }

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
      setMediaStream(stream);
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

      // If the OS or another app grabs the mic mid-capture, say so.
      track.onended = () => {
        console.warn('startRecording: audio track ended unexpectedly');
        toast.error('The microphone was disconnected. Stop and save what was captured.');
      };

      mediaRecorder.start(1000); // Collect data every 1000ms
      console.log('startRecording: recording started', { mime: effectiveMime, state: mediaRecorder.state });
      setIsRecording(true);
      setMicPermission('granted');

      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      return true;
    } catch (error) {
      console.error('startRecording: MediaRecorder setup failed', error);
      stream.getTracks().forEach(t => t.stop());
      toast.error('Could not start recording on this device. Please try again.');
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
        setMediaStream(null);

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
    shareWithHealthcare: boolean = false,
    overrideUserId?: string
  ): Promise<VoiceRecording | null> => {
    // Never trust stale React auth state — resolve (and silently refresh) the
    // real session, otherwise a long-open tab makes Save do nothing at all.
    const userId = overrideUserId ?? user?.id ?? (await ensureSession());
    if (!userId) {
      console.warn('saveRecording: blocked — no authenticated session');
      toast.error('Your session timed out — your recording is safe.', {
        description: 'Sign in again and tap Save & extract actions.',
      });
      return null;
    }

    try {
      setIsProcessing(true);

      const contentType = audioBlob.type || mimeTypeRef.current || 'audio/webm';
      const extension = extensionForMimeType(contentType);
      const fileName = `${userId}/${Date.now()}.${extension}`;
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
          user_id: userId,
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
        .eq('user_id', userId)
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
      await deleteVoiceRecording(id, user.id);
      await fetchRecordings();
      toast.success('Recording deleted successfully');
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete recording');
      throw error;
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
    recordedBytes,
    recordingMimeType,
    mediaStream,
    isStarting,
    micPermission,
    micBlockReason,
    refreshMicStatus,

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