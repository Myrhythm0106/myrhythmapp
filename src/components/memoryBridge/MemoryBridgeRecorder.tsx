import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Pause, Play, Clock, Users, AlertTriangle, Brain, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useSubscription } from '@/hooks/useSubscription';
import { useRecordingLimits } from '@/hooks/memoryBridge/useRecordingLimits';
import { useRealtimeTranscription } from '@/hooks/memoryBridge/useRealtimeTranscription';
import { useRealtimeACTs } from '@/hooks/memoryBridge/useRealtimeACTs';
import { DailyLimitReachedModal } from './DailyLimitReachedModal';
import { EnhancedProcessingProgress, ProcessingStage } from './EnhancedProcessingProgress';
import { RecordingCelebration } from './RecordingCelebration';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface MemoryBridgeRecorderProps {
  open: boolean;
  onClose: () => void;
  meetingData: any;
  onComplete: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const MemoryBridgeRecorder = ({ open, onClose, meetingData, onComplete }: MemoryBridgeRecorderProps) => {
  const { startMeetingRecording, stopMeetingRecording, isRecording, isProcessing, currentMeeting } = useMemoryBridge();
  const { isRecording: isVoiceRecording, isPaused, duration, startRecording, pauseRecording, resumeRecording, stopRecording, saveRecording, formatDuration } = useVoiceRecorder();
  const { subscription, tier } = useSubscription();
  const { 
    canRecordToday, 
    getRemainingDailyTime, 
    getDailyUsage,
    getHoursUntilReset,
    getMinutesUntilReset,
    dailyLimit 
  } = useRecordingLimits();
  const { transcript, isTranscribing, startTranscription, stopTranscription, resetTranscript } = useRealtimeTranscription();
  const { acts, isExtracting, extractACTs, clearACTs } = useRealtimeACTs(currentMeeting?.id);
  
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [showDailyLimitModal, setShowDailyLimitModal] = useState(false);
  const [showLiveACTs, setShowLiveACTs] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [lastMeetingId, setLastMeetingId] = useState<string | null>(null);
  const [lastVoiceRecordingPath, setLastVoiceRecordingPath] = useState<string | null>(null);
  const [actionsCount, setActionsCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Get daily and per-recording limits
  const remainingDailyMinutes = getRemainingDailyTime();
  const dailyUsageMinutes = getDailyUsage();
  const hasReachedDailyLimit = !canRecordToday();
  
  // Dynamic max duration based on remaining daily time for free tier
  const maxDurationMinutes = tier === 'free' 
    ? Math.min(remainingDailyMinutes === -1 ? 30 : remainingDailyMinutes, 30)
    : (subscription?.plan_type === 'premium' ? 180 : 30);
  
  const maxDuration = maxDurationMinutes * 60;
  const isNearLimit = duration > maxDuration * 0.8;
  const isOverLimit = duration >= maxDuration;

  // Show warning when approaching limit
  useEffect(() => {
    if (isNearLimit && !showLimitWarning) {
      setShowLimitWarning(true);
      toast.warning(`Approaching ${maxDurationMinutes} minute limit`);
    }
  }, [isNearLimit, showLimitWarning, maxDurationMinutes]);

  // Auto-stop when limit reached
  useEffect(() => {
    if (isOverLimit && isVoiceRecording) {
      handleStop();
      toast.error('Recording stopped: Duration limit reached');
    }
  }, [isOverLimit, isVoiceRecording]);

  const handleStart = useCallback(async () => {
    if (hasReachedDailyLimit) {
      setShowDailyLimitModal(true);
      return;
    }
    
    if (remainingDailyMinutes === 0) {
      setShowDailyLimitModal(true);
      return;
    }
    
    const success = await startRecording();
    if (success) {
      console.log('Voice recording started successfully');
      setProcessingStage('idle');
      setProcessingError(null);
      setRetryCount(0);
      
      try {
        await startTranscription();
        setShowLiveACTs(true);
      } catch (error) {
        console.warn('Live transcription unavailable, will process after recording');
      }
      
      resetTranscript();
      clearACTs();
    }
  }, [startRecording, startTranscription, resetTranscript, clearACTs, hasReachedDailyLimit, remainingDailyMinutes]);

  const handlePause = useCallback(() => {
    pauseRecording();
  }, [pauseRecording]);

  const handleResume = useCallback(() => {
    resumeRecording();
  }, [resumeRecording]);

  const handleStop = useCallback(async () => {
    const audioBlob = await stopRecording();
    stopTranscription();
    setAudioBlob(audioBlob);
    if (audioBlob) {
      await handleSaveAndProcess(audioBlob);
    }
  }, [stopRecording, stopTranscription]);

  // Process with retry logic
  const triggerProcessing = useCallback(async (filePath: string, meetingId: string, attempt: number = 1): Promise<boolean> => {
    try {
      console.log(`🔄 Processing attempt ${attempt}/${MAX_RETRIES} for meeting ${meetingId}`);
      
      const { data, error } = await supabase.functions.invoke('process-meeting-audio', {
        body: {
          filePath: filePath,
          meetingId: meetingId,
          meetingData: {
            title: meetingData.meeting_title || meetingData.title || 'Memory Bridge Recording',
            type: 'informal',
            participants: meetingData.participants || [],
            context: meetingData.context || ''
          }
        }
      });

      if (error) {
        throw new Error(error.message || 'Processing failed');
      }

      console.log('✅ Processing initiated successfully:', data);
      return true;
    } catch (error: any) {
      console.error(`❌ Processing attempt ${attempt} failed:`, error);
      
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Retrying in ${RETRY_DELAY_MS}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
        return triggerProcessing(filePath, meetingId, attempt + 1);
      }
      
      throw error;
    }
  }, [meetingData]);

  const handleSaveAndProcess = useCallback(async (audioBlob?: Blob) => {
    const blobToProcess = audioBlob;
    if (!blobToProcess || !meetingData) return;

    try {
      setProcessingStage('saving');
      toast.info('📼 Saving your recording...', { duration: 2000 });
      
      // Save the voice recording
      const voiceRecording = await saveRecording(
        blobToProcess,
        meetingData.meeting_title || meetingData.title,
        'meeting',
        `Meeting with ${meetingData.participants?.map((p: any) => p.name).join(', ') || 'participants'}`
      );

      if (!voiceRecording) {
        throw new Error('Failed to save voice recording');
      }

      // Start the meeting recording
      const meetingRecord = await startMeetingRecording({
        title: meetingData.meeting_title || meetingData.title || 'Memory Bridge Recording',
        participants: meetingData.participants || [],
        meetingType: 'informal'
      }, voiceRecording.id);

      if (!meetingRecord) {
        throw new Error('Failed to create meeting record');
      }

      setLastMeetingId(meetingRecord.id);
      setLastVoiceRecordingPath(voiceRecording.file_path);
      
      toast.success('✅ Recording saved!', { duration: 2000 });
      setProcessingStage('transcribing');
      
      // Trigger processing with proper error handling and retry
      try {
        await triggerProcessing(voiceRecording.file_path, meetingRecord.id);
        toast.info('🎤 Transcribing your conversation...', { duration: 5000 });
      } catch (processingError: any) {
        console.error('❌ All processing attempts failed:', processingError);
        setProcessingStage('error');
        setProcessingError(processingError.message || 'Processing failed after multiple attempts');
        toast.error('Processing failed. You can retry below.', {
          description: 'Your recording is saved safely.',
          duration: 8000
        });
        return;
      }
      
    } catch (error: any) {
      console.error('Error saving recording:', error);
      setProcessingStage('error');
      setProcessingError(error.message || 'Failed to save recording');
      toast.error('Failed to save recording. Please try again.');
    }
  }, [meetingData, saveRecording, startMeetingRecording, triggerProcessing]);

  const handleRetryProcessing = useCallback(async () => {
    if (!lastVoiceRecordingPath || !lastMeetingId) {
      toast.error('No recording to retry');
      return;
    }

    setProcessingStage('transcribing');
    setProcessingError(null);
    setRetryCount(prev => prev + 1);

    try {
      await triggerProcessing(lastVoiceRecordingPath, lastMeetingId);
      toast.info('🔄 Retrying processing...', { duration: 3000 });
    } catch (error: any) {
      setProcessingStage('error');
      setProcessingError(error.message || 'Retry failed');
      toast.error('Retry failed. Please try again later.');
    }
  }, [lastVoiceRecordingPath, lastMeetingId, triggerProcessing]);

  const handleDiscard = useCallback(() => {
    setAudioBlob(null);
    stopTranscription();
    setShowLiveACTs(false);
    resetTranscript();
    clearACTs();
    setProcessingStage('idle');
    setProcessingError(null);
    onClose();
  }, [onClose, stopTranscription, resetTranscript, clearACTs]);

  const getProgressValue = () => {
    return (duration / maxDuration) * 100;
  };

  // Extract ACTs every 10 seconds during transcription
  useEffect(() => {
    if (transcript && isTranscribing && transcript.length > 50) {
      const timeoutId = setTimeout(() => {
        extractACTs(transcript);
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [transcript, isTranscribing, extractACTs]);

  // Handle completion logic
  const handleProcessingComplete = useCallback(async (meetingId: string) => {
    setProcessingStage('completed');
    
    // Fetch actions count
    const { count } = await supabase
      .from('extracted_actions')
      .select('id', { count: 'exact' })
      .eq('meeting_recording_id', meetingId);
    
    const foundCount = count || 0;
    setActionsCount(foundCount);
    setShowCelebration(true);
    onComplete();
  }, [onComplete]);

  // Real-time progress monitoring with polling fallback
  useEffect(() => {
    if (!lastMeetingId) return;
    
    let pollInterval: NodeJS.Timeout | null = null;
    let hasCompleted = false;

    // Polling function as backup
    const pollStatus = async () => {
      if (hasCompleted) return;
      
      const { data, error } = await supabase
        .from('meeting_recordings')
        .select('processing_status, processing_error')
        .eq('id', lastMeetingId)
        .maybeSingle();
      
      if (error || !data) return;
      
      console.log('🔄 Poll status:', data.processing_status);
      
      if (data.processing_status === 'transcribing') {
        setProcessingStage('transcribing');
      } else if (data.processing_status === 'extracting_actions') {
        setProcessingStage('extracting');
      } else if (data.processing_status === 'completed') {
        hasCompleted = true;
        if (pollInterval) clearInterval(pollInterval);
        await handleProcessingComplete(lastMeetingId);
      } else if (data.processing_status === 'error') {
        hasCompleted = true;
        if (pollInterval) clearInterval(pollInterval);
        setProcessingStage('error');
        setProcessingError(data.processing_error || 'Processing failed');
      }
    };

    // Start polling every 3 seconds as backup
    pollStatus(); // Check immediately
    pollInterval = setInterval(pollStatus, 3000);

    // Also set up realtime subscription
    const channel = supabase
      .channel(`meeting-progress-${lastMeetingId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'meeting_recordings',
          filter: `id=eq.${lastMeetingId}`
        },
        async (payload) => {
          if (hasCompleted) return;
          
          const status = payload.new.processing_status;
          console.log('📊 Realtime status update:', status);

          if (status === 'transcribing') {
            setProcessingStage('transcribing');
          } else if (status === 'extracting_actions') {
            setProcessingStage('extracting');
          } else if (status === 'completed') {
            hasCompleted = true;
            if (pollInterval) clearInterval(pollInterval);
            await handleProcessingComplete(lastMeetingId);
          } else if (status === 'error') {
            hasCompleted = true;
            if (pollInterval) clearInterval(pollInterval);
            setProcessingStage('error');
            setProcessingError(payload.new.processing_error || 'Processing failed');
          }
        }
      )
      .subscribe();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [lastMeetingId, handleProcessingComplete]);

  // Processing View
  if (processingStage !== 'idle' && !isVoiceRecording) {
    return (
      <>
        <Dialog open={open} onOpenChange={processingStage === 'error' ? onClose : undefined}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Processing Your Recording
              </DialogTitle>
            </DialogHeader>
            
            <EnhancedProcessingProgress
              stage={processingStage}
              actionsCount={actionsCount}
              errorMessage={processingError || undefined}
              onRetry={processingStage === 'error' ? handleRetryProcessing : undefined}
            />
            
            {processingStage === 'error' && (
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button onClick={handleRetryProcessing} className="flex-1 gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retry ({retryCount}/{MAX_RETRIES})
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        <RecordingCelebration
          show={showCelebration}
          actionsCount={actionsCount}
          onViewActions={() => {
            setShowCelebration(false);
            onClose();
          }}
          onRecordAnother={() => {
            setShowCelebration(false);
            setProcessingStage('idle');
            setAudioBlob(null);
          }}
          onDismiss={() => {
            setShowCelebration(false);
            onClose();
          }}
        />
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Memory Bridge Recording
          </DialogTitle>
        </DialogHeader>

        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            {/* Meeting Info */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 space-y-2"
            >
              <h4 className="font-semibold text-lg">{meetingData?.meeting_title || meetingData?.title}</h4>
              {meetingData?.participants && meetingData.participants.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {meetingData.participants.map((p: any) => p.name).join(', ')}
                </div>
              )}
            </motion.div>

            {/* Daily Usage Info (Free Tier Only) */}
            {tier === 'free' && dailyLimit !== -1 && (
              <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Daily Recording Time</span>
                  <Badge variant={remainingDailyMinutes <= 5 ? "destructive" : "secondary"}>
                    {remainingDailyMinutes} min remaining
                  </Badge>
                </div>
                <Progress 
                  value={(dailyUsageMinutes / dailyLimit) * 100} 
                  className="h-2"
                />
              </div>
            )}

            {/* Recording Controls */}
            <div className="space-y-6">
              {/* Duration Display */}
              <motion.div 
                animate={isVoiceRecording ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 1, repeat: isVoiceRecording ? Infinity : 0 }}
                className="text-center space-y-2"
              >
                <div className="flex items-center justify-center gap-3">
                  {isVoiceRecording && (
                    <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                  <span className="text-4xl font-mono font-bold">
                    {formatDuration(duration)}
                  </span>
                  <span className="text-lg text-muted-foreground">
                    / {formatDuration(maxDuration)}
                  </span>
                </div>
                
                <Progress value={getProgressValue()} className="h-2" />
                
                {isNearLimit && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-1 text-sm text-orange-600"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Approaching limit
                  </motion.div>
                )}
              </motion.div>

              {/* Control Buttons */}
              {!audioBlob && (
                <div className="flex justify-center gap-3">
                  {!isVoiceRecording ? (
                    <Button 
                      onClick={handleStart} 
                      size="lg" 
                      className="gap-2 bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 text-lg px-8 py-6"
                      disabled={hasReachedDailyLimit}
                    >
                      <Mic className="h-5 w-5" />
                      {hasReachedDailyLimit ? 'Daily Limit Reached' : 'Start Recording'}
                    </Button>
                  ) : (
                    <>
                      {!isPaused ? (
                        <Button
                          onClick={handlePause}
                          variant="outline"
                          size="lg"
                          className="gap-2"
                        >
                          <Pause className="h-5 w-5" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          onClick={handleResume}
                          variant="outline"
                          size="lg"
                          className="gap-2"
                        >
                          <Play className="h-5 w-5" />
                          Continue
                        </Button>
                      )}
                      <Button
                        onClick={handleStop}
                        size="lg"
                        className="gap-2 bg-gradient-to-r from-green-600 to-primary"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Done Recording
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Recording Status */}
              {isVoiceRecording && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20"
                >
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-red-600 font-medium">
                      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                      Recording in progress...
                    </div>
                    {isTranscribing && (
                      <div className="flex items-center gap-1 text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs">Live transcription active</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Live SMART ACTs Display */}
              {showLiveACTs && acts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t pt-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-4 w-4 text-primary" />
                    <h3 className="font-medium text-sm">Live Actions Detected</h3>
                    <Badge variant="secondary">{acts.length}</Badge>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {acts.map((act, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-primary/5 rounded-lg p-3 text-sm border border-primary/10"
                      >
                        <div className="font-medium text-primary">{act.action}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>👤 {act.assignee}</span>
                          <span>📅 {act.deadline}</span>
                          <Badge variant={
                            act.priority === 'high' ? 'destructive' :
                            act.priority === 'medium' ? 'default' : 'secondary'
                          } className="text-xs">
                            {act.priority}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Limit Modal */}
        <DailyLimitReachedModal
          open={showDailyLimitModal}
          onClose={() => setShowDailyLimitModal(false)}
          hoursUntilReset={getHoursUntilReset()}
          minutesUntilReset={getMinutesUntilReset()}
        />
      </DialogContent>
    </Dialog>
  );
};

export { MemoryBridgeRecorder };
