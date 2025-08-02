import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { Mic, MicOff, Activity, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { MeetingSetupData } from '@/types/memoryBridge';

export function QuickRecordButton() {
  const { 
    isRecording, 
    isProcessing, 
    currentMeeting, 
    startMeetingRecording, 
    stopMeetingRecording 
  } = useMemoryBridge();
  
  const { 
    startRecording: startVoiceRecording, 
    stopRecording: stopVoiceRecording
  } = useVoiceRecorder();
  
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  const [currentDuration, setCurrentDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleQuickStart = async () => {
    try {
      console.log('Starting quick PACT recording...');
      
      // Start voice recording first
      await startVoiceRecording();
      
      // Create minimal setup data for quick recording
      const quickSetupData: MeetingSetupData = {
        title: `Quick Recording - ${new Date().toLocaleTimeString()}`,
        participants: [{ name: 'Me', relationship: 'self' }],
        meetingType: 'unplanned',
        context: 'Quick capture - will add context after recording',
        location: '',
        emotionalContext: '',
        energyLevel: 5
      };
      
      // Start the meeting recording
      const meetingRecord = await startMeetingRecording(quickSetupData, null);
      
      if (meetingRecord) {
        const startTime = new Date();
        setRecordingStartTime(startTime);
        
        // Start duration counter
        intervalRef.current = setInterval(() => {
          const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
          setCurrentDuration(duration);
        }, 1000);
        
        toast.success('Quick PACT recording started! Speak naturally - add context later.');
      }
    } catch (error) {
      console.error('Error starting quick recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleQuickStop = async () => {
    try {
      console.log('Stopping quick PACT recording...');
      
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
      
      toast.success('Recording complete! Check Review Actions to add context and confirm items.');
    } catch (error) {
      console.error('Error stopping quick recording:', error);
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
      <Card className="border-primary/20 shadow-elegant">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-sm">Quick Recording</p>
                <p className="text-xs text-muted-foreground">
                  {formatDuration(currentDuration)}
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleQuickStop}
              disabled={isProcessing}
              size="sm"
              variant="destructive"
              className="h-8 w-8 p-0"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded p-2">
            <Activity className="h-3 w-3 inline mr-1" />
            Speaking naturally... AI is listening for commitments, promises, and action items.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={handleQuickStart}
      disabled={isProcessing}
      className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <Mic className="h-4 w-4 mr-2" />
      Quick Record
    </Button>
  );
}