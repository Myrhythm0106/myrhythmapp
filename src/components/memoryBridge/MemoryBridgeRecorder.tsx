import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Pause, Play, Clock, Users, AlertTriangle } from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

interface MemoryBridgeRecorderProps {
  open: boolean;
  onClose: () => void;
  meetingData: any;
  onComplete: () => void;
}

export function MemoryBridgeRecorder({ 
  open, 
  onClose, 
  meetingData, 
  onComplete 
}: MemoryBridgeRecorderProps) {
  const { 
    isRecording, 
    isPaused, 
    duration, 
    startRecording, 
    pauseRecording, 
    resumeRecording, 
    stopRecording,
    saveRecording,
    formatDuration 
  } = useVoiceRecorder();
  
  const { startMeetingRecording, stopMeetingRecording, isProcessing } = useMemoryBridge();
  const { getLimits } = useSubscription();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  const limits = getLimits();
  const maxDuration = limits.recordingDurationMinutes * 60; // Convert to seconds
  const isNearLimit = duration > maxDuration * 0.8; // 80% of limit
  const isOverLimit = duration >= maxDuration;

  useEffect(() => {
    if (isNearLimit && !showLimitWarning) {
      setShowLimitWarning(true);
      toast.warning(`Approaching ${limits.recordingDurationMinutes} minute limit`);
    }
  }, [isNearLimit, showLimitWarning, limits.recordingDurationMinutes]);

  useEffect(() => {
    if (isOverLimit && isRecording) {
      handleStop();
      toast.error('Recording stopped: Duration limit reached');
    }
  }, [isOverLimit, isRecording]);

  const handleStart = async () => {
    const success = await startRecording();
    if (!success) {
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const handlePause = () => {
    pauseRecording();
  };

  const handleResume = () => {
    resumeRecording();
  };

  const handleStop = async () => {
    const blob = await stopRecording();
    if (blob) {
      setAudioBlob(blob);
    }
  };

  const handleSave = async () => {
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
  };

  const handleSaveAndProcess = async () => {
    if (!audioBlob || !meetingData) return;

    try {
      // First save the voice recording
      const voiceRecording = await saveRecording(
        audioBlob,
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
          // Process the meeting and extract actions
          await stopMeetingRecording(audioBlob);
          onComplete();
          onClose();
        }
      }
    } catch (error) {
      console.error('Error processing recording:', error);
      toast.error('Failed to process recording');
    }
  };

  const handleDiscard = () => {
    setAudioBlob(null);
    onClose();
  };

  const getProgressValue = () => {
    if (maxDuration === -1) return 0; // Unlimited
    return (duration / maxDuration) * 100;
  };

  const getProgressColor = () => {
    if (isOverLimit) return 'bg-destructive';
    if (isNearLimit) return 'bg-orange-500';
    return 'bg-primary';
  };

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
      <DialogContent className="sm:max-w-[500px]">
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

            {/* Recording Controls */}
            <div className="space-y-4">
              {/* Duration and Progress */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-2xl font-mono">
                    {formatDuration(duration)}
                  </span>
                  {maxDuration !== -1 && (
                    <span className="text-sm text-muted-foreground">
                      / {formatDuration(maxDuration)}
                    </span>
                  )}
                </div>
                
                {maxDuration !== -1 && (
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
                )}
              </div>

              {/* Control Buttons */}
              {!audioBlob && (
                <div className="flex justify-center gap-3">
                  {!isRecording ? (
                    <Button onClick={handleStart} size="lg" className="gap-2">
                      <Mic className="h-4 w-4" />
                      Start Recording
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

              {/* Recording Complete Actions */}
              {audioBlob && (
                <div className="space-y-4">
                  {/* Audio Preview */}
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Recording complete! Preview and choose your next step.
                    </p>
                    <audio 
                      controls 
                      src={URL.createObjectURL(audioBlob)}
                      className="w-full max-w-xs mx-auto"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleDiscard} variant="outline" className="flex-1">
                      Discard
                    </Button>
                    <Button onClick={handleSave} variant="secondary" className="flex-1">
                      Save
                    </Button>
                    <Button onClick={handleSaveAndProcess} className="flex-1">
                      Save & Process
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {isPaused ? 'Paused' : 'Recording...'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}