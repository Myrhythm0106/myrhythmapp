import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  Square, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Brain,
  Zap,
  Pause,
  Play
} from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useSubscription } from '@/hooks/useSubscription';
import { useRealtimeACTs } from '@/hooks/memoryBridge/useRealtimeACTs';
import { VoiceCoach } from './VoiceCoach';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuickCaptureRecorderProps {
  onComplete?: (data: { meetingId: string; actionsCount: number }) => void;
  onCancel?: () => void;
}

type RecordingState = 'ready' | 'recording' | 'processing' | 'complete';

export function QuickCaptureRecorder({ onComplete, onCancel }: QuickCaptureRecorderProps) {
  const { 
    isRecording: isVoiceRecording, 
    isPaused,
    duration, 
    startRecording, 
    pauseRecording,
    resumeRecording,
    stopRecording, 
    saveRecording, 
    formatDuration 
  } = useVoiceRecorder();
  
  const { startMeetingRecording } = useMemoryBridge();
  const { subscription } = useSubscription();
  
  const [recordingState, setRecordingState] = useState<RecordingState>('ready');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [processingMessage, setProcessingMessage] = useState('');
  const [tapCount, setTapCount] = useState(0);
  const [finalResults, setFinalResults] = useState<{ meetingId: string; actionsCount: number } | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentMeetingId, setCurrentMeetingId] = useState<string>('');
  
  const { extractACTs } = useRealtimeACTs(currentMeetingId);

  // Get subscription limits - remove 2-hour limit for premium, extend for all users
  const maxDurationMinutes = subscription?.plan_type === 'premium' ? 240 : 30; // 4 hours premium, 30 min free
  const maxDuration = maxDurationMinutes * 60;
  const isNearLimit = duration > maxDuration * 0.8;
  const isOverLimit = duration >= maxDuration;

  // Handle the 3-tap flow - simplified start
  const handleFirstTap = useCallback(async () => {
    console.log('👆 Tap 1: Starting recording...');
    setTapCount(1);
    setRecordingState('recording');
    
    try {
      // Just start recording - no meeting creation yet
      await startRecording();
      toast.success('Recording started! 🎤');
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingState('ready');
      setTapCount(0);
      toast.error('Failed to start recording');
    }
  }, [startRecording]);

  const processRecordingAutomatically = useCallback(async (audioBlob: Blob) => {
    try {
      setProcessingMessage('Saving recording...');
      
      // Save the voice recording first
      const voiceRecording = await saveRecording(
        audioBlob,
        `Quick Capture - ${new Date().toLocaleString()}`,
        'meeting',
        'Quick captured conversation'
      );

      if (!voiceRecording) {
        throw new Error('Failed to save recording');
      }

      setProcessingMessage('Creating meeting record...');

      // Now create meeting record with real recording ID
      const meetingRecord = await startMeetingRecording({
        title: `Quick Capture - ${new Date().toLocaleString()}`,
        participants: [],
        meetingType: 'informal'
      }, voiceRecording.id);

      if (!meetingRecord) {
        throw new Error('Failed to create meeting record');
      }

      // Update meeting to inactive state
      await supabase
        .from('meeting_recordings')
        .update({ 
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', meetingRecord.id);

      setProcessingMessage('Transcribing & extracting ACTs...');

      // Process with edge function
      const { data, error } = await supabase.functions.invoke('process-meeting-audio', {
        body: {
          filePath: voiceRecording.file_path,
          meetingId: meetingRecord.id,
          meetingData: {
            title: `Quick Capture - ${new Date().toLocaleString()}`,
            type: 'informal',
            participants: [],
            context: 'Quick captured conversation',
            recording_id: voiceRecording.id
          }
        }
      });

      if (error) {
        console.error('Processing error:', error);
        throw new Error(`Processing failed: ${error.message}`);
      }

      console.log('✅ Processing complete:', data);
      
      const actionsCount = data?.actionsCount || 0;
      const finalMeetingId = meetingRecord.id;
      setCurrentMeetingId(finalMeetingId);
      setFinalResults({ meetingId: finalMeetingId, actionsCount });
      setRecordingState('complete');
      setProcessingMessage('');
      
      toast.success(`Processing complete! Found ${actionsCount} SMART ACTs 🎯`);

    } catch (error) {
      console.error('Error processing recording:', error);
      setRecordingState('ready');
      setTapCount(0);
      toast.error('Failed to process recording');
    }
  }, [saveRecording, startMeetingRecording]);

  const handleSecondTap = useCallback(async () => {
    console.log('👆 Tap 2: Stopping recording...');
    setTapCount(2);
    setRecordingState('processing');
    setProcessingMessage('Stopping recording...');

    const blob = await stopRecording();
    if (blob) {
      setAudioBlob(blob);
      toast.success('Recording complete! Processing...');
      await processRecordingAutomatically(blob);
    } else {
      setRecordingState('ready');
      setTapCount(0);
      toast.error('Failed to stop recording');
    }
  }, [stopRecording, processRecordingAutomatically]);

  const handleThirdTap = useCallback(() => {
    console.log('👆 Tap 3: Viewing results...');
    setTapCount(3);
    
    if (finalResults) {
      onComplete?.(finalResults);
      toast.success('Quick Capture complete! 🎉');
    }
  }, [finalResults, onComplete]);

  const handleCancel = useCallback(() => {
    setRecordingState('ready');
    setTapCount(0);
    setAudioBlob(null);
    setFinalResults(null);
    setProcessingMessage('');
    onCancel?.();
  }, [onCancel]);

  const getButtonText = () => {
    if (recordingState === 'ready') {
      return 'Start Quick Capture';
    }
    if (recordingState === 'recording') {
      return isPaused ? 'Resume Recording' : 'Pause Recording';
    }
    if (recordingState === 'processing') {
      return 'Processing...';
    }
    if (recordingState === 'complete') {
      return 'View Results';
    }
    return 'Start Quick Capture';
  };

  const getButtonIcon = () => {
    if (recordingState === 'ready') {
      return <Mic className="h-5 w-5" />;
    }
    if (recordingState === 'recording') {
      return isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />;
    }
    if (recordingState === 'processing') {
      return <Brain className="h-5 w-5 animate-pulse" />;
    }
    if (recordingState === 'complete') {
      return <CheckCircle2 className="h-5 w-5" />;
    }
    return <Mic className="h-5 w-5" />;
  };

  const handleMainAction = () => {
    if (recordingState === 'ready') {
      handleFirstTap();
    } else if (recordingState === 'recording') {
      if (isPaused) {
        resumeRecording();
        toast.success('Recording resumed! 🎤');
      } else {
        pauseRecording();
        toast.success('Recording paused ⏸️');
      }
    } else if (recordingState === 'complete') {
      handleThirdTap();
    }
  };

  const handleStopRecording = () => {
    handleSecondTap();
  };

  const getProgressValue = () => {
    if (recordingState === 'recording') {
      return (duration / maxDuration) * 100;
    }
    if (recordingState === 'processing') {
      return 50; // Show partial progress during processing
    }
    if (recordingState === 'complete') {
      return 100;
    }
    return 0;
  };

  // Auto-stop when limit reached - moved after all callback definitions
  useEffect(() => {
    if (isOverLimit && isVoiceRecording) {
      handleSecondTap();
      toast.error('Recording stopped: Duration limit reached');
    }
  }, [isOverLimit, isVoiceRecording, handleSecondTap]);

  return (
    <Card className="border-2 border-memory-emerald-200 bg-gradient-to-br from-white via-memory-emerald-50/50 to-brain-health-50/30">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Voice Coach - shown during ready or recording states */}
          {(recordingState === 'ready' || recordingState === 'recording') && (
            <VoiceCoach
              isRecording={recordingState === 'recording'}
              transcript={currentTranscript}
              onInsertPhrase={(phrase) => {
                setCurrentTranscript(prev => prev + (prev ? ' ' : '') + phrase);
                // Trigger real-time extraction if we have a meeting
                if (currentMeetingId && phrase.trim()) {
                  extractACTs(phrase);
                }
              }}
            />
          )}

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-memory-emerald-600" />
              <h3 className="text-lg font-semibold text-brain-health-900">Quick Capture</h3>
            </div>
            <p className="text-sm text-brain-health-600">
              Start → {isPaused ? 'Resume' : 'Pause'} → Stop → Results
            </p>
          </div>

          {/* Tap Progress Indicators */}
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((tap) => (
              <div key={tap} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  tapCount >= tap 
                    ? 'bg-memory-emerald-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {tap}
                </div>
                <div className="text-xs mt-1 text-center">
                  {tap === 1 && 'Start'}
                  {tap === 2 && 'Stop'}
                  {tap === 3 && 'Results'}
                </div>
              </div>
            ))}
          </div>

          {/* Recording Status */}
          {recordingState === 'recording' && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  isPaused ? 'bg-orange-500' : 'bg-red-500 animate-pulse'
                }`} />
                <Clock className="h-4 w-4" />
                <span className="text-lg font-mono text-brain-health-900">
                  {formatDuration(duration)}
                </span>
                <span className="text-sm text-brain-health-600">
                  / {formatDuration(maxDuration)}
                </span>
                {isPaused && (
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Paused
                  </Badge>
                )}
              </div>
              
              <Progress 
                value={getProgressValue()} 
                className="h-2"
              />
              
              {isNearLimit && (
                <div className="flex items-center justify-center gap-1 text-sm text-orange-600">
                  <AlertTriangle className="h-3 w-3" />
                  Approaching limit ({maxDurationMinutes} min)
                </div>
              )}
            </div>
          )}

          {/* Processing Status */}
          {recordingState === 'processing' && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-memory-emerald-600 mx-auto"></div>
              <div>
                <p className="text-brain-health-900 font-medium">Processing your recording...</p>
                <p className="text-sm text-brain-health-600">{processingMessage}</p>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          )}

          {/* Complete Status */}
          {recordingState === 'complete' && finalResults && (
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-medium">Processing Complete!</span>
              </div>
              <div className="space-y-2">
                <Badge className="bg-memory-emerald-100 text-memory-emerald-800 px-3 py-1">
                  {finalResults.actionsCount} SMART ACTs Found
                </Badge>
                <p className="text-sm text-brain-health-600">
                  Tap below to view your extracted actions
                </p>
              </div>
            </div>
          )}

          {/* Main Action Button */}
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={handleMainAction}
              disabled={recordingState === 'processing'}
              size="lg"
              className={`px-8 py-4 text-lg gap-2 ${
                recordingState === 'recording' && !isPaused
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700'
              } text-white`}
            >
              {getButtonIcon()}
              {getButtonText()}
            </Button>

            {/* Stop Button - appears during recording or pause */}
            {recordingState === 'recording' && (
              <Button
                onClick={handleStopRecording}
                variant="outline"
                size="lg"
                className="px-6 py-3 gap-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Square className="h-4 w-4" />
                Stop Recording
              </Button>
            )}
          </div>

          {/* Cancel Button */}
          {recordingState !== 'ready' && recordingState !== 'complete' && (
            <div className="text-center">
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="text-brain-health-600 hover:text-brain-health-700"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}