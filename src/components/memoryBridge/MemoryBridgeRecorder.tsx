import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MeetingSetupDialog } from './MeetingSetupDialog';
import { QuickRecordButton } from './QuickRecordButton';
import { AmbientModeToggle } from './AmbientModeToggle';
import { useMemoryBridge } from '@/hooks/useMemoryBridge';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { Heart, Users, Clock, StopCircle, Activity, Zap, Settings } from 'lucide-react';
import { MeetingSetupData } from '@/types/memoryBridge';
import { toast } from 'sonner';

export function MemoryBridgeRecorder() {
  const { 
    isRecording, 
    isProcessing, 
    currentMeeting, 
    startMeetingRecording, 
    stopMeetingRecording,
    showPACTFlow,
    lastRecordingData,
    completePACTGeneration
  } = useMemoryBridge();
  
  const { 
    startRecording: startVoiceRecording, 
    stopRecording: stopVoiceRecording,
    saveRecording 
  } = useVoiceRecorder();
  
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  const [currentDuration, setCurrentDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartMeeting = async (setupData: MeetingSetupData) => {
    try {
      console.log('Starting unified PACT recording with setup:', setupData);
      
      // Start voice recording first
      await startVoiceRecording();
      
      // Start the meeting recording
      const meetingRecord = await startMeetingRecording(setupData, null);
      
      if (meetingRecord) {
        const startTime = new Date();
        setRecordingStartTime(startTime);
        
        // Start duration counter
        intervalRef.current = setInterval(() => {
          const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
          setCurrentDuration(duration);
        }, 1000);
        
        toast.success('Recording started! Your support circle has been notified.');
      }
    } catch (error) {
      console.error('Error starting meeting:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleStopMeeting = async () => {
    try {
      console.log('Stopping unified PACT recording...');
      
      // Clear the duration timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Stop voice recording and get the audio blob
      const audioBlob = await stopVoiceRecording();
      
      // Stop meeting recording with audio data
      await stopMeetingRecording(audioBlob);
      
      // Reset state
      setRecordingStartTime(null);
      setCurrentDuration(0);
      
      toast.success('Recording saved! Ready to generate PACT report.');
    } catch (error) {
      console.error('Error stopping PACT recording:', error);
      toast.error('Failed to process recording. Please try again.');
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isRecording && currentMeeting) {
    return (
      <Card className="w-full max-w-4xl mx-auto border-2 border-memory-emerald/30 shadow-glow bg-gradient-trust">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-glow"></div>
            <span className="bg-gradient-to-r from-memory-emerald to-brain-health bg-clip-text text-transparent">
              Recording: {currentMeeting.meeting_title}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Recording Status */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full px-8 py-4 border-2 border-red-300 dark:border-red-700 shadow-glow">
              <div className="flex items-center gap-4">
                <Activity className="h-6 w-6 text-red-500 animate-pulse" />
                <span className="text-2xl font-mono font-bold text-red-600 dark:text-red-400">
                  {formatDuration(currentDuration)}
                </span>
                <div className="flex gap-1">
                  <div className="w-2 h-6 bg-red-500 animate-pulse rounded"></div>
                  <div className="w-2 h-4 bg-red-400 animate-pulse rounded"></div>
                  <div className="w-2 h-8 bg-red-500 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Participants:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentMeeting.participants.map((participant, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {participant.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span>Type:</span>
              </div>
              <Badge variant="secondary">
                {currentMeeting.meeting_type}
              </Badge>
            </div>
          </div>

          {/* Context */}
          {currentMeeting.meeting_context && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Context:</p>
              <p className="text-sm bg-muted/50 rounded-lg p-3">
                {currentMeeting.meeting_context}
              </p>
            </div>
          )}

          {/* Stop Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleStopMeeting}
              disabled={isProcessing}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 text-lg"
            >
              <StopCircle className="h-5 w-5 mr-2" />
              {isProcessing ? 'Processing...' : 'Stop & Process Meeting'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-memory-emerald/30 shadow-glow bg-gradient-trust">
      <CardHeader className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-memory shadow-glow mb-4 animate-pulse">
          <Heart className="h-12 w-12 text-white" />
        </div>
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-memory-emerald to-brain-health bg-clip-text text-transparent">
          Memory Bridge
        </CardTitle>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-muted-foreground">
            Never Forget. Never Let Anyone Down.
          </p>
          <p className="text-xl text-muted-foreground">
            Your Personal Promise Keeper & Confidence Builder
          </p>
        </div>
        <div className="bg-gradient-to-r from-memory-emerald/10 to-brain-health/10 rounded-lg p-6 border border-memory-emerald/20">
          <p className="text-lg font-medium text-memory-emerald mb-2">✨ Transform Your Life Today</p>
          <p className="text-base text-muted-foreground">
            Remember every commitment, build unshakeable trust, and gain the confidence to live independently.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">PACT Tracking</h3>
            <p className="text-xs text-muted-foreground">
              Promises, Actions, Commitments & Takeaways
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Trust Building</h3>
            <p className="text-xs text-muted-foreground">
              Strengthen relationships through reliability
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Confidence Builder</h3>
            <p className="text-xs text-muted-foreground">
              Your reliable second brain
            </p>
          </div>
        </div>

        {/* Giant Start Button - Senior Friendly */}
        <div className="space-y-8">
          <div className="flex justify-center">
            <Button
              onClick={() => handleStartMeeting({
                title: 'Conversation Recording',
                participants: [{ name: 'Me', relationship: 'self' }],
                meetingType: 'informal'
              })}
              disabled={isProcessing}
              className="h-24 text-2xl px-16 bg-gradient-to-r from-memory-emerald to-brain-health hover:scale-105 transition-all shadow-glow rounded-2xl"
            >
              <Activity className="w-8 h-8 mr-4" />
              {isProcessing ? 'Starting...' : 'Start Recording'}
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">
              One tap to capture all your promises and commitments
            </p>
            <div className="flex justify-center">
              <MeetingSetupDialog 
                onStartMeeting={handleStartMeeting}
                isLoading={isProcessing}
              />
            </div>
          </div>
        </div>

        {/* Ambient Mode */}
        <div className="border-t pt-6">
          <AmbientModeToggle />
        </div>

        {/* Confidence Building Messages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gradient-to-r from-memory-emerald/10 to-memory-emerald/5 rounded-xl border border-memory-emerald/20">
            <h3 className="text-xl font-bold text-memory-emerald mb-3">💪 Build Trust Daily</h3>
            <div className="space-y-2 text-base text-muted-foreground">
              <p>✓ Never forget a promise</p>
              <p>✓ Remember medical appointments</p>
              <p>✓ Keep family commitments</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-brain-health/10 to-brain-health/5 rounded-xl border border-brain-health/20">
            <h3 className="text-xl font-bold text-brain-health mb-3">🧠 Gain Confidence</h3>
            <div className="space-y-2 text-base text-muted-foreground">
              <p>✓ Live independently</p>
              <p>✓ Feel empowered daily</p>
              <p>✓ Strengthen relationships</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}