import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Check, AlertCircle } from 'lucide-react';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { toast } from 'sonner';

/**
 * Ultra-simplified watch interface for instant PACT recording
 * Designed for 2-tap access when phone isn't available
 */
export function WatchQuickRecord() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  
  const { startMeetingRecording, stopMeetingRecording, isProcessing } = useMemoryBridge();
  const { startRecording, stopRecording } = useVoiceRecorder();

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
    };
  }, [recordingTimer]);

  const handleStartQuickRecord = async () => {
    try {
      console.log('🎙️ Watch: Starting instant PACT recording');
      
      // Start voice recording
      await startRecording();
      
      // Start meeting recording with minimal setup
      await startMeetingRecording({
        title: `Watch Recording ${new Date().toLocaleTimeString()}`,
        participants: [{ name: 'Me', relationship: 'self' }],
        meetingType: 'informal',
        context: 'Recorded via watch for instant PACT capture'
      }, null);

      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      const timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      setRecordingTimer(timer);

      // Haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }

      toast.success('🎙️ Recording started!');
    } catch (error) {
      console.error('❌ Watch recording error:', error);
      toast.error('Recording failed. Check permissions.');
    }
  };

  const handleStopRecord = async () => {
    try {
      console.log('🛑 Watch: Stopping PACT recording');
      
      // Clear timer
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }

      // Stop voice recording and get blob
      const audioBlob = await stopRecording();
      if (!audioBlob) {
        throw new Error('Failed to capture audio');
      }

      // Process the recording
      await stopMeetingRecording(audioBlob);
      
      setIsRecording(false);
      setRecordingDuration(0);

      // Success haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }

      toast.success('🎯 PACT captured! Check your phone for results.');
    } catch (error) {
      console.error('❌ Error stopping watch recording:', error);
      toast.error('Failed to save recording');
      setIsRecording(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Watch UI - Extra large touch targets, minimal text
  return (
    <div className="min-h-screen bg-black text-white p-2 flex flex-col items-center justify-center">
      <Card className="w-full max-w-[200px] bg-gray-900 border-gray-700">
        <CardContent className="p-4 text-center space-y-4">
          {/* App identifier */}
          <div className="text-xs text-gray-400 font-mono">MyRhythm</div>
          
          {!isRecording ? (
            <>
              {/* Start Recording - Giant button */}
              <Button
                onClick={handleStartQuickRecord}
                disabled={isProcessing}
                className="w-full h-20 text-lg bg-red-600 hover:bg-red-700 border-2 border-red-500"
              >
                <Mic className="w-8 h-8" />
              </Button>
              <div className="text-xs text-gray-300">
                Tap to capture
                <br />
                conversation
              </div>
            </>
          ) : (
            <>
              {/* Recording indicator */}
              <div className="space-y-2">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mx-auto"></div>
                <div className="text-lg font-mono font-bold text-red-400">
                  {formatDuration(recordingDuration)}
                </div>
              </div>
              
              {/* Stop button */}
              <Button
                onClick={handleStopRecord}
                disabled={isProcessing}
                className="w-full h-16 bg-gray-700 hover:bg-gray-600 border-2 border-gray-500"
              >
                <Square className="w-6 h-6" />
              </Button>
              <div className="text-xs text-gray-300">
                Tap to stop &amp; process
              </div>
            </>
          )}

          {/* Status indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-xs text-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Processing...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick help */}
      <div className="mt-4 text-xs text-gray-500 text-center max-w-[180px]">
        Instantly capture promises, actions, commitments &amp; takeaways
      </div>
    </div>
  );
}