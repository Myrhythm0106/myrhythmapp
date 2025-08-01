import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MeetingSetupDialog } from './MeetingSetupDialog';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { Heart, Users, Clock, StopCircle, Activity } from 'lucide-react';
import { MeetingSetupData } from '@/types/memoryBridge';

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
      // Start voice recording first
      await startVoiceRecording();
      
      // Create a temporary voice recording entry
      const tempBlob = new Blob(['temp'], { type: 'audio/wav' });
      const voiceData = await saveRecording(
        tempBlob, 
        setupData.title, 
        'memory_bridge',
        `Memory Bridge recording for: ${setupData.title}`,
        false
      );

      if (voiceData) {
        // Start the meeting recording with the voice recording ID
        const meetingRecord = await startMeetingRecording(setupData, voiceData.id);
        
        if (meetingRecord) {
          setRecordingStartTime(new Date());
          
          // Start duration counter
          intervalRef.current = setInterval(() => {
            if (recordingStartTime) {
              const duration = Math.floor((Date.now() - recordingStartTime.getTime()) / 1000);
              setCurrentDuration(duration);
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error starting meeting:', error);
    }
  };

  const handleStopMeeting = async () => {
    try {
      // Stop the timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Stop voice recording and get the audio blob
      const audioBlob = await stopVoiceRecording();
      
      if (audioBlob && currentMeeting) {
        // Process through Memory Bridge
        await stopMeetingRecording(audioBlob);
      }
      
      setRecordingStartTime(null);
      setCurrentDuration(0);
    } catch (error) {
      console.error('Error stopping meeting:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isRecording && currentMeeting) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-primary/20 shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            Recording: {currentMeeting.meeting_title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Status */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full px-6 py-3 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-red-500 animate-pulse" />
                <span className="text-lg font-mono text-red-600 dark:text-red-400">
                  {formatDuration(currentDuration)}
                </span>
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Heart className="h-6 w-6 text-primary" />
          Memory Bridge
        </CardTitle>
        <p className="text-muted-foreground">
          Capture conversations and never miss what matters to your relationships
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Preserve Intent</h3>
            <p className="text-xs text-muted-foreground">
              Capture the 'why' behind commitments
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Relationship Context</h3>
            <p className="text-xs text-muted-foreground">
              Understand family dynamics
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Memory Safety</h3>
            <p className="text-xs text-muted-foreground">
              Never forget what you promised
            </p>
          </div>
        </div>

        {/* Start Recording */}
        <div className="flex justify-center">
          <MeetingSetupDialog 
            onStartMeeting={handleStartMeeting}
            isLoading={isProcessing}
          />
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
          <p className="mb-2 font-medium">Perfect for:</p>
          <div className="space-y-1">
            <p>• Family conversations & planning</p>
            <p>• Medical appointments</p>
            <p>• Important discussions with loved ones</p>
            <p>• Any conversation where commitments are made</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}