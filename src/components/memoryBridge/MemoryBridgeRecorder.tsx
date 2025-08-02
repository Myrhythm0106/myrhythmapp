import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MeetingSetupDialog } from './MeetingSetupDialog';
import { QuickRecordButton } from './QuickRecordButton';
import { AmbientModeToggle } from './AmbientModeToggle';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
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
    stopMeetingRecording 
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
      console.log('Starting PACT recording with setup:', setupData);
      
      // Start voice recording first
      await startVoiceRecording();
      
      // Start the meeting recording (without voice recording ID initially)
      const meetingRecord = await startMeetingRecording(setupData, null);
      
      if (meetingRecord) {
        const startTime = new Date();
        setRecordingStartTime(startTime);
        
        // Start duration counter
        intervalRef.current = setInterval(() => {
          const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
          setCurrentDuration(duration);
        }, 1000);
        
        toast.success('PACT recording started! Speak naturally about your conversation.');
      }
    } catch (error) {
      console.error('Error starting meeting:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleStopMeeting = async () => {
    try {
      console.log('Stopping PACT recording...');
      
      // Clear the duration timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Stop voice recording and get the audio blob
      const audioBlob = await stopVoiceRecording();
      if (!audioBlob) {
        toast.error('Failed to capture audio recording');
        return;
      }

      console.log('Audio captured, processing PACT items...');

      // Stop meeting recording and process the audio
      await stopMeetingRecording(audioBlob);
      
      // Reset state
      setRecordingStartTime(null);
      setCurrentDuration(0);
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
    <Card className="w-full max-w-4xl mx-auto border-2 border-memory-emerald/20 shadow-elegant bg-gradient-trust">
      <CardHeader className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-memory shadow-glow mb-4">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-memory-emerald to-brain-health bg-clip-text text-transparent">
          Memory Bridge Studio
        </CardTitle>
        <p className="text-xl font-semibold text-muted-foreground">
          Your AI-Powered Promise Keeper & Trust Builder
        </p>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Transform conversations into kept promises. Build unshakeable trust and independence through AI-powered memory assistance.
        </p>
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

        {/* Recording Options */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <QuickRecordButton />
            <MeetingSetupDialog 
              onStartMeeting={handleStartMeeting}
              isLoading={isProcessing}
            />
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-full px-4 py-2">
              <Zap className="h-4 w-4 text-primary" />
              Quick Record for immediate conversations • Setup for planned meetings
            </div>
          </div>
        </div>

        {/* Ambient Mode */}
        <div className="border-t pt-6">
          <AmbientModeToggle />
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-lg p-4 border border-primary/10">
          <p className="mb-2 font-medium text-primary">Transform Your Life:</p>
          <div className="space-y-1">
            <p>• Never let family down again</p>
            <p>• Remember every medical detail</p>
            <p>• Build unshakeable trust</p>
            <p>• Gain independence & confidence</p>
            <p>• Perfect for rehabilitation & memory support</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}