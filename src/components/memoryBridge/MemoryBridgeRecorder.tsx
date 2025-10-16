import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Pause, Play, Clock, Users, AlertTriangle, Brain } from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useSubscription } from '@/hooks/useSubscription';
import { useRecordingLimits } from '@/hooks/memoryBridge/useRecordingLimits';
import { useRealtimeTranscription } from '@/hooks/memoryBridge/useRealtimeTranscription';
import { useRealtimeACTs } from '@/hooks/memoryBridge/useRealtimeACTs';
import { DailyLimitReachedModal } from './DailyLimitReachedModal';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MemoryBridgeRecorderProps {
  open: boolean;
  onClose: () => void;
  meetingData: any;
  onComplete: () => void;
}

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
  const [processingStage, setProcessingStage] = useState<'idle' | 'transcribing' | 'extracting' | 'completed' | 'error'>('idle');

  // Get daily and per-recording limits
  const remainingDailyMinutes = getRemainingDailyTime();
  const dailyUsageMinutes = getDailyUsage();
  const hasReachedDailyLimit = !canRecordToday();
  
  // Dynamic max duration based on remaining daily time for free tier
  const maxDurationMinutes = tier === 'free' 
    ? Math.min(remainingDailyMinutes === -1 ? 30 : remainingDailyMinutes, 30)
    : (subscription?.plan_type === 'premium' ? 180 : 30);
  
  const maxDuration = maxDurationMinutes * 60; // Convert to seconds
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
    // Check daily limit before starting
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
      
      // Try to start realtime transcription, but don't block if it fails
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

  const handleSave = useCallback(async () => {
    if (!audioBlob || !meetingData) return;

    try {
      // Save the voice recording without processing
      const voiceRecording = await saveRecording(
        audioBlob,
        meetingData.meeting_title || meetingData.title,
        'meeting',
        `Meeting with ${meetingData.participants?.map((p: any) => p.name).join(', ') || 'participants'}`
      );

      if (voiceRecording) {
        toast.success('Recording saved successfully!');
        onComplete();
        onClose();
      }
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
    }
  }, [audioBlob, meetingData, saveRecording, onComplete, onClose]);

  const handleSaveAndProcess = useCallback(async (audioBlob?: Blob) => {
    const blobToProcess = audioBlob || audioBlob;
    if (!blobToProcess || !meetingData) return;

    try {
      toast.info('📼 Saving recording instantly...', { duration: 2000 });
      
      // First save the voice recording
      const voiceRecording = await saveRecording(
        blobToProcess,
        meetingData.meeting_title || meetingData.title,
        'meeting',
        `Meeting with ${meetingData.participants?.map((p: any) => p.name).join(', ') || 'participants'}`
      );

      if (voiceRecording) {
        // Start the meeting recording to get a meeting ID
        const meetingRecord = await startMeetingRecording({
          title: meetingData.meeting_title || meetingData.title || 'Memory Bridge Recording',
          participants: meetingData.participants || [],
          meetingType: 'informal'
        }, voiceRecording.id);

        if (meetingRecord) {
          toast.success('✅ Recording saved! Processing in background...');
          setProcessingStage('transcribing');
          
          // Trigger background processing using stored file (fast path)
          try {
            // Fire and forget - don't await
            supabase.functions.invoke('process-meeting-audio', {
              body: {
                filePath: voiceRecording.file_path,
                meetingId: meetingRecord.id,
                meetingData: {
                  title: meetingData.meeting_title || meetingData.title || 'Memory Bridge Recording',
                  type: 'informal',
                  participants: meetingData.participants || [],
                  context: meetingData.context || '',
                  recording_id: voiceRecording.id
                }
              }
            });

            toast.info('🎤 Transcribing audio in background...', { duration: 3000 });
          } catch (processingError) {
            console.warn('Processing queued for later:', processingError);
          }
          
          onComplete();
          onClose();
        }
      }
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording. Please try again.');
      setProcessingStage('error');
    }
  }, [meetingData, saveRecording, startMeetingRecording, onComplete, onClose]);

  const handleDiscard = useCallback(() => {
    setAudioBlob(null);
    stopTranscription();
    setShowLiveACTs(false);
    resetTranscript();
    clearACTs();
    onClose();
  }, [onClose, stopTranscription, resetTranscript, clearACTs]);

  const getProgressValue = () => {
    return (duration / maxDuration) * 100;
  };

  const getProgressColor = () => {
    if (!subscription) return 'hsl(var(--destructive))';
    
    const limit = subscription.plan_type === 'premium' ? 60 : 5;
    const minutes = duration / 60;
    
    if (minutes >= limit * 0.9) return 'hsl(var(--destructive))';
    if (minutes >= limit * 0.7) return 'hsl(var(--warning))';
    return 'hsl(var(--primary))';
  };

  // Extract ACTs every 10 seconds during transcription
  useEffect(() => {
    if (transcript && isTranscribing && transcript.length > 50) {
      const timeoutId = setTimeout(() => {
        extractACTs(transcript);
      }, 2000); // Debounce by 2 seconds
      
      return () => clearTimeout(timeoutId);
    }
  }, [transcript, isTranscribing, extractACTs]);

  // Real-time progress monitoring
  useEffect(() => {
    if (!currentMeeting?.id) return;

    const channel = supabase
      .channel(`meeting-progress-${currentMeeting.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'meeting_recordings',
          filter: `id=eq.${currentMeeting.id}`
        },
        (payload) => {
          const status = payload.new.processing_status;
          console.log('📊 Processing status update:', status);

          if (status === 'transcribing') {
            setProcessingStage('transcribing');
            toast.info('🎤 Transcribing audio...', { duration: 5000 });
          } else if (status === 'extracting_actions') {
            setProcessingStage('extracting');
            toast.info('🎯 Extracting actions...', { duration: 5000 });
          } else if (status === 'completed') {
            setProcessingStage('completed');
            toast.success(`✅ Processing complete! Found ${payload.new.actions_count || 0} actions!`);
          } else if (status === 'error') {
            setProcessingStage('error');
            toast.error('❌ Processing failed. Recording is saved.');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentMeeting?.id]);

  if (isProcessing) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Processing Meeting...</h3>
              <p className="text-muted-foreground">
                Transcribing audio and extracting ACTs
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Memory Bridge Recording
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="pt-6">
            {/* Meeting Info */}
            <div className="mb-6 space-y-2">
              <h4 className="font-medium">{meetingData?.meeting_title || meetingData?.title}</h4>
              {meetingData?.participants && meetingData.participants.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {meetingData.participants.map((p: any) => p.name).join(', ')}
                </div>
              )}
            </div>

            {/* Daily Usage Info (Free Tier Only) */}
            {tier === 'free' && dailyLimit !== -1 && (
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Daily Recording Time</span>
                  <Badge variant={remainingDailyMinutes <= 5 ? "destructive" : "secondary"}>
                    {remainingDailyMinutes} min remaining today
                  </Badge>
                </div>
                <Progress 
                  value={(dailyUsageMinutes / dailyLimit) * 100} 
                  className="h-1.5"
                />
                {remainingDailyMinutes <= 5 && remainingDailyMinutes > 0 && (
                  <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Running low on daily recording time
                  </p>
                )}
              </div>
            )}

            {/* Recording Controls */}
            <div className="space-y-4">
              {/* Duration and Progress */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-2xl font-mono">
                    {formatDuration(duration)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {formatDuration(maxDuration)}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <Progress 
                    value={getProgressValue()} 
                    className="h-2"
                  />
                  {isNearLimit && (
                    <div className="flex items-center justify-center gap-1 text-sm text-orange-600">
                      <AlertTriangle className="h-3 w-3" />
                      Approaching duration limit
                    </div>
                  )}
                </div>
              </div>

              {/* Control Buttons */}
              {!audioBlob && (
                <div className="flex justify-center gap-3">
                  {!isVoiceRecording ? (
                    <Button 
                      onClick={handleStart} 
                      size="lg" 
                      className="gap-2"
                      disabled={hasReachedDailyLimit}
                    >
                      <Mic className="h-4 w-4" />
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
                          <Pause className="h-4 w-4" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          onClick={handleResume}
                          variant="outline"
                          size="lg"
                          className="gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Continue
                        </Button>
                      )}
                      <Button
                        onClick={handleStop}
                        variant="destructive"
                        size="lg"
                        className="gap-2"
                      >
                        <Square className="h-4 w-4" />
                        Stop
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Recording Status */}
              {isVoiceRecording && (
                <div className="text-center">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                      <span>Recording...</span>
                      {isTranscribing && (
                        <div className="flex items-center gap-1 text-primary">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                          <span className="text-xs">Live ACTs</span>
                        </div>
                      )}
                    </div>
                    <div>
                      {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
              )}

              {/* Live SMART ACTs Display */}
              {showLiveACTs && (
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                      <h3 className="font-medium text-sm">Live SMART ACTs</h3>
                      {isExtracting && (
                        <div className="text-xs text-muted-foreground">(Processing...)</div>
                      )}
                    </div>
                    
                    {acts.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {acts.map((act, index) => (
                          <div key={index} className="bg-muted/50 rounded-lg p-2 text-sm">
                            <div className="font-medium text-primary">{act.action}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              <span className="mr-3">👤 {act.assignee}</span>
                              <span className="mr-3">📅 {act.deadline}</span>
                              <span className={`px-1 py-0.5 rounded text-xs ${
                                act.priority === 'high' ? 'bg-red-100 text-red-700' :
                                act.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {act.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic">
                        No actionable items detected yet...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Auto-processing message */}
              {audioBlob && !isProcessing && (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Brain className="h-4 w-4 animate-pulse text-primary" />
                    Processing your recording into ACTs...
                  </div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
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