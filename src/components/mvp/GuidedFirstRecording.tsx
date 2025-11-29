import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Loader2, Sparkles, Volume2 } from 'lucide-react';
import { PersonaType, getPersonaLanguage } from '@/utils/personaLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GuidedFirstRecordingProps {
  persona: PersonaType;
  onActionExtracted: (action: {
    id: string;
    action_text: string;
    proposed_date?: string;
    proposed_time?: string;
    priority_level?: number;
  }) => void;
}

type RecordingState = 'idle' | 'countdown' | 'recording' | 'processing' | 'complete';

export function GuidedFirstRecording({ persona, onActionExtracted }: GuidedFirstRecordingProps) {
  const { user } = useAuth();
  const [state, setState] = useState<RecordingState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const recordingTimerRef = useRef<NodeJS.Timeout>();

  const personaLang = getPersonaLanguage(persona);

  // Countdown effect
  useEffect(() => {
    if (state === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (state === 'countdown' && countdown === 0) {
      startActualRecording();
    }
  }, [state, countdown]);

  // Recording duration timer
  useEffect(() => {
    if (state === 'recording') {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(d => {
          if (d >= 60) {
            stopRecording();
            return d;
          }
          return d + 1;
        });
      }, 1000);
      return () => {
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      };
    }
  }, [state]);

  // Audio level visualization
  const updateAudioLevel = () => {
    if (analyserRef.current && state === 'recording') {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(average / 255);
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    setState('countdown');
  };

  const startActualRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio analysis
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        await processRecording();
      };

      mediaRecorder.start(100);
      setState('recording');
      setRecordingDuration(0);
      updateAudioLevel();
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
      setState('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.stop();
      setState('processing');
    }
  };

  const processRecording = async () => {
    if (!user?.id || audioChunksRef.current.length === 0) {
      toast.error('No recording to process');
      setState('idle');
      return;
    }

    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Create meeting recording first
      const { data: meeting, error: meetingError } = await supabase
        .from('meeting_recordings')
        .insert({
          user_id: user.id,
          meeting_title: 'First Recording',
          meeting_type: 'personal',
          is_active: false,
          processing_status: 'processing'
        })
        .select()
        .single();

      if (meetingError) throw meetingError;

      // Upload to storage
      const fileName = `${user.id}/${meeting.id}/audio.webm`;
      const { error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      // Process with edge function
      const { data: processResult, error: processError } = await supabase.functions.invoke(
        'process-meeting-audio',
        {
          body: {
            meetingRecordingId: meeting.id,
            audioPath: fileName
          }
        }
      );

      if (processError) throw processError;

      // Fetch extracted actions
      const { data: actions, error: actionsError } = await supabase
        .from('extracted_actions')
        .select('*')
        .eq('meeting_recording_id', meeting.id)
        .order('priority_level', { ascending: true })
        .limit(1);

      if (actionsError) throw actionsError;

      if (actions && actions.length > 0) {
        onActionExtracted({
          id: actions[0].id,
          action_text: actions[0].action_text,
          proposed_date: actions[0].proposed_date || undefined,
          proposed_time: actions[0].proposed_time || undefined,
          priority_level: actions[0].priority_level || undefined
        });
      } else {
        // Create a mock action if none extracted (for demo purposes)
        const { data: mockAction, error: mockError } = await supabase
          .from('extracted_actions')
          .insert({
            user_id: user.id,
            meeting_recording_id: meeting.id,
            action_text: 'Follow up on your recorded commitment',
            action_type: 'commitment',
            status: 'pending',
            priority_level: 2
          })
          .select()
          .single();

        if (!mockError && mockAction) {
          onActionExtracted({
            id: mockAction.id,
            action_text: mockAction.action_text,
            priority_level: mockAction.priority_level || undefined
          });
        } else {
          toast.error('Could not extract actions. Try speaking more clearly.');
          setState('idle');
        }
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process recording. Please try again.');
      setState('idle');
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {state === 'idle' && 'Try Your First Recording'}
            {state === 'countdown' && 'Get Ready...'}
            {state === 'recording' && 'Recording...'}
            {state === 'processing' && 'Processing Your Voice...'}
          </h2>
          
          {state === 'idle' && (
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Say something like:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-foreground italic">
                  "{personaLang.examplePrompt}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recording Visualization */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            {state === 'countdown' && (
              <motion.div
                key="countdown"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <span className="text-6xl font-bold text-primary">{countdown}</span>
              </motion.div>
            )}

            {state === 'recording' && (
              <motion.div
                key="recording"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                {/* Audio level rings */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-destructive/30"
                    animate={{
                      scale: 1 + audioLevel * (i + 1) * 0.3,
                      opacity: 1 - audioLevel * (i * 0.2)
                    }}
                    style={{
                      width: 128,
                      height: 128
                    }}
                  />
                ))}
                
                <div className="w-32 h-32 rounded-full bg-destructive flex items-center justify-center relative z-10">
                  <Volume2 className="h-12 w-12 text-white animate-pulse" />
                </div>
                
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-muted-foreground">
                  {recordingDuration}s / 60s
                </div>
              </motion.div>
            )}

            {state === 'processing' && (
              <motion.div
                key="processing"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </motion.div>
            )}

            {state === 'idle' && (
              <motion.div
                key="idle"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={startCountdown}
              >
                <Mic className="h-12 w-12 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {state === 'idle' && (
            <Button
              size="lg"
              onClick={startCountdown}
              className="gap-2"
            >
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          )}

          {state === 'recording' && (
            <Button
              size="lg"
              variant="destructive"
              onClick={stopRecording}
              className="gap-2"
            >
              <Square className="h-5 w-5" />
              Stop Recording
            </Button>
          )}

          {state === 'processing' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span>Extracting your commitments...</span>
            </div>
          )}
        </div>

        {state === 'idle' && (
          <p className="text-center text-sm text-muted-foreground">
            We'll extract your {personaLang.actions.toLowerCase()} and help you schedule them
          </p>
        )}
      </CardContent>
    </Card>
  );
}
