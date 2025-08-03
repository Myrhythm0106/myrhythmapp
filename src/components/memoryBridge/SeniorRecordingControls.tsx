import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { 
  Mic, 
  Pause, 
  Play, 
  Square, 
  Save,
  Clock,
  MicOff 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SeniorRecordingControlsProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onSavedRecording?: (recording: any) => void;
}

export function SeniorRecordingControls({ 
  onRecordingComplete, 
  onSavedRecording 
}: SeniorRecordingControlsProps) {
  const {
    isRecording,
    isPaused,
    isProcessing,
    recordingDuration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    saveRecording
  } = useVoiceRecorder();

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [isQuickSaving, setIsQuickSaving] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    setAudioBlob(null);
    await startRecording();
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      setAudioBlob(blob);
      onRecordingComplete(blob);
      // Generate default name based on current time
      const now = new Date();
      const defaultName = `Recording ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setRecordingName(defaultName);
    }
  };

  const handleQuickSave = async () => {
    if (!audioBlob) return;
    
    setIsQuickSaving(true);
    try {
      const result = await saveRecording(
        audioBlob,
        recordingName || `Quick Save ${new Date().toLocaleString()}`,
        'pact',
        'Quick saved recording from Memory Bridge'
      );
      
      if (result) {
        onSavedRecording?.(result);
        setAudioBlob(null);
        setRecordingName('');
        toast.success('Recording saved! You can find it in "My Recordings"');
      }
    } catch (error) {
      toast.error('Failed to save recording');
    } finally {
      setIsQuickSaving(false);
    }
  };

  const handleSaveWithDetails = async () => {
    if (!audioBlob || !recordingName.trim()) return;
    
    try {
      const result = await saveRecording(
        audioBlob,
        recordingName.trim(),
        'pact',
        'Recording with P.A.C.T. extraction from Memory Bridge'
      );
      
      if (result) {
        onSavedRecording?.(result);
        setShowSaveDialog(false);
        setAudioBlob(null);
        setRecordingName('');
        toast.success('Recording saved with your custom name!');
      }
    } catch (error) {
      toast.error('Failed to save recording');
    }
  };

  // Recording state indicator
  const getRecordingStatus = () => {
    if (!isRecording && !audioBlob) return { text: "Ready to record", color: "text-blue-600" };
    if (isPaused) return { text: "Recording paused", color: "text-amber-600" };
    if (isRecording) return { text: "Recording...", color: "text-red-600" };
    if (audioBlob) return { text: "Recording complete", color: "text-green-600" };
    return { text: "Ready", color: "text-gray-600" };
  };

  const status = getRecordingStatus();

  return (
    <div className="space-y-6">
      {/* Status Display */}
      <div className="text-center space-y-2">
        <div className={cn("text-2xl font-semibold", status.color)}>
          {status.text}
        </div>
        {isRecording && (
          <div className="flex items-center justify-center gap-2 text-xl">
            <Clock className="h-6 w-6" />
            {formatDuration(recordingDuration)}
          </div>
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center gap-4">
        {!isRecording && !audioBlob && (
          <Button
            onClick={handleStartRecording}
            size="lg"
            className="h-20 w-20 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Mic className="h-8 w-8" />
          </Button>
        )}

        {isRecording && !isPaused && (
          <>
            <Button
              onClick={pauseRecording}
              size="lg"
              variant="outline"
              className="h-16 w-16 rounded-full border-2 border-amber-500 text-amber-600 hover:bg-amber-50"
            >
              <Pause className="h-6 w-6" />
            </Button>
            <Button
              onClick={handleStopRecording}
              size="lg"
              variant="destructive"
              className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700"
            >
              <Square className="h-6 w-6" />
            </Button>
          </>
        )}

        {isRecording && isPaused && (
          <>
            <Button
              onClick={resumeRecording}
              size="lg"
              className="h-16 w-16 rounded-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="h-6 w-6" />
            </Button>
            <Button
              onClick={handleStopRecording}
              size="lg"
              variant="destructive"
              className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700"
            >
              <Square className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Control Labels */}
      {isRecording && (
        <div className="flex justify-center gap-8 text-lg text-center">
          <div className="space-y-1">
            {!isPaused ? (
              <>
                <div className="text-amber-600 font-medium">Pause</div>
                <div className="text-xs text-gray-500">Take a break</div>
              </>
            ) : (
              <>
                <div className="text-green-600 font-medium">Continue</div>
                <div className="text-xs text-gray-500">Keep recording</div>
              </>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-red-600 font-medium">Stop</div>
            <div className="text-xs text-gray-500">Finish recording</div>
          </div>
        </div>
      )}

      {/* Audio Playback & Save Options */}
      {audioBlob && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                Recording Complete!
              </h3>
              <audio
                controls
                src={URL.createObjectURL(audioBlob)}
                className="w-full max-w-md mx-auto"
              />
            </div>

            {/* Save Options */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleQuickSave}
                disabled={isQuickSaving || isProcessing}
                className="flex-1 max-w-xs h-12 text-lg bg-blue-600 hover:bg-blue-700"
              >
                <Save className="mr-2 h-5 w-5" />
                {isQuickSaving ? 'Saving...' : 'Quick Save'}
              </Button>
              
              <Button
                onClick={() => setShowSaveDialog(true)}
                variant="outline"
                className="flex-1 max-w-xs h-12 text-lg border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Name & Save
              </Button>
              
              <Button
                onClick={handleStartRecording}
                variant="outline"
                className="flex-1 max-w-xs h-12 text-lg"
              >
                <Mic className="mr-2 h-5 w-5" />
                Record Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Name Your Recording</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                value={recordingName}
                onChange={(e) => setRecordingName(e.target.value)}
                placeholder="Enter a name for this recording"
                className="text-lg h-12"
                maxLength={100}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSaveWithDetails}
                disabled={!recordingName.trim() || isProcessing}
                className="flex-1 h-11"
              >
                <Save className="mr-2 h-4 w-4" />
                {isProcessing ? 'Saving...' : 'Save Recording'}
              </Button>
              <Button
                onClick={() => setShowSaveDialog(false)}
                variant="outline"
                className="flex-1 h-11"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}