import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TranscriptionResult {
  message_type: string;
  text: string;
  created: string;
  confidence: number;
}

export const useRealtimeTranscription = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const connect = useCallback(async () => {
    try {
      // Get token from our edge function
      const { data, error } = await supabase.functions.invoke('assemblyai-token');
      
      if (error || !data?.token) {
        throw new Error('Failed to get AssemblyAI token');
      }

      // Connect to AssemblyAI WebSocket
      const socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${data.token}`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('Connected to AssemblyAI');
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data) as TranscriptionResult;
        
        if (data.message_type === 'FinalTranscript') {
          setTranscript(prev => prev + ' ' + data.text);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Transcription connection error');
        setIsConnected(false);
      };

      socket.onclose = () => {
        console.log('Disconnected from AssemblyAI');
        setIsConnected(false);
        setIsTranscribing(false);
      };

    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect to transcription service');
    }
  }, []);

  const startTranscription = useCallback(async () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      await connect();
      // Wait a bit for connection to establish
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      streamRef.current = stream;

      // Create MediaRecorder to capture audio
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
          // Convert to the format AssemblyAI expects
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            
            socketRef.current?.send(JSON.stringify({
              audio_data: base64
            }));
          };
          reader.readAsArrayBuffer(event.data);
        }
      };

      // Start recording in small chunks for real-time processing
      mediaRecorder.start(250); // Send data every 250ms
      setIsTranscribing(true);
      
    } catch (error) {
      console.error('Error starting transcription:', error);
      toast.error('Failed to start transcription');
    }
  }, [connect]);

  const stopTranscription = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (socketRef.current) {
      socketRef.current.close();
    }

    setIsTranscribing(false);
    setIsConnected(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isConnected,
    transcript,
    isTranscribing,
    connect,
    startTranscription,
    stopTranscription,
    resetTranscript
  };
};