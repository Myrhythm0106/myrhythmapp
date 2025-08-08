
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mic, Square, Save, Loader2, Brain, Target } from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { InControlExtractionDialog } from './InControlExtractionDialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  defaultCategory?: string;
  onSaved?: (recording: any) => void;
  onInControlExtracted?: (items: any[]) => void;
}

export function VoiceRecorder({ defaultCategory = 'general', onSaved, onInControlExtracted }: VoiceRecorderProps) {
  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    saveRecording
  } = useVoiceRecorder();

  const {
    extractedActions,
    startMeetingRecording,
    stopMeetingRecording
  } = useMemoryBridge();

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(defaultCategory);
  const [shareWithHealthcare, setShareWithHealthcare] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [savedRecording, setSavedRecording] = useState<any>(null);
  const [showExtractionDialog, setShowExtractionDialog] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStage, setExtractionStage] = useState<'transcribing' | 'analyzing' | 'extracting' | 'categorizing' | 'complete'>('transcribing');

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async () => {
    setAudioBlob(null);
    await startRecording();
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      setAudioBlob(blob);
    }
  };

  const handleSave = async () => {
    if (!audioBlob || !title.trim()) return;

    const result = await saveRecording(
      audioBlob,
      title.trim(),
      category,
      description.trim() || undefined,
      shareWithHealthcare
    );

    if (result) {
      setSavedRecording(result);
      onSaved?.(result);
      
      toast.success('Recording saved successfully!', {
        description: 'You can now extract InControl items from this recording.',
        action: {
          label: 'Extract Now',
          onClick: () => handleExtractInControl()
        }
      });
    }
  };

  const handleExtractInControl = async () => {
    if (!audioBlob || !savedRecording) return;

    setIsExtracting(true);
    setShowExtractionDialog(true);
    setExtractionStage('transcribing');

    try {
      // Create a meeting setup for extraction
      const setupData = {
        title: title || 'InControl Recording',
        participants: [{ name: 'Me', relationship: 'self' }],
        meetingType: 'informal' as const
      };

      // Start meeting recording
      const meetingRecord = await startMeetingRecording(setupData, savedRecording.id);
      
      if (meetingRecord) {
        setExtractionStage('analyzing');
        
        // Process the recording
        await stopMeetingRecording(audioBlob);
        
        setExtractionStage('complete');
        setIsExtracting(false);
        
        toast.success('InControl items extracted successfully!');
      }
    } catch (error) {
      console.error('Error extracting InControl items:', error);
      setIsExtracting(false);
      toast.error('Failed to extract InControl items. Please try again.');
    }
  };

  const handleConfirmExtraction = () => {
    setShowExtractionDialog(false);
    onInControlExtracted?.(extractedActions);
    
    // Reset form after successful extraction
    setAudioBlob(null);
    setTitle('');
    setDescription('');
    setShareWithHealthcare(false);
    setSavedRecording(null);
    
    toast.success('InControl items added to your log!', {
      description: `Added ${extractedActions.length} items to your InControl Log.`
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Recorder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex items-center justify-center">
          {!isRecording && !audioBlob && (
            <Button
              onClick={handleStartRecording}
              size="lg"
              className="rounded-full h-16 w-16"
            >
              <Mic className="h-6 w-6" />
            </Button>
          )}

          {isRecording && (
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={handleStopRecording}
                size="lg"
                variant="destructive"
                className={cn(
                  "rounded-full h-16 w-16 animate-pulse",
                  "bg-red-500 hover:bg-red-600"
                )}
              >
                <Square className="h-6 w-6" />
              </Button>
              <div className="text-sm text-muted-foreground">
                Recording: {formatDuration(recordingDuration)}
              </div>
            </div>
          )}

          {audioBlob && (
            <div className="flex flex-col items-center gap-2">
              <audio
                controls
                src={URL.createObjectURL(audioBlob)}
                className="w-full max-w-xs"
              />
              <Button
                onClick={handleStartRecording}
                variant="outline"
                size="sm"
              >
                <Mic className="h-4 w-4 mr-2" />
                Record Again
              </Button>
            </div>
          )}
        </div>

        {/* Recording Details Form */}
        {audioBlob && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for this recording"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value: string) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Notes</SelectItem>
                  <SelectItem value="symptoms">Symptom Log</SelectItem>
                  <SelectItem value="mood">Mood Notes</SelectItem>
                  <SelectItem value="medical">Medical Information</SelectItem>
                  <SelectItem value="calendar">Calendar Notes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional details..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="share-healthcare"
                checked={shareWithHealthcare}
                onCheckedChange={setShareWithHealthcare}
              />
              <Label htmlFor="share-healthcare" className="text-sm">
                Share with healthcare professionals in my support circle
              </Label>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleSave}
                disabled={!title.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Recording
                  </>
                )}
              </Button>
              
              {savedRecording && (
                <Button
                  onClick={handleExtractInControl}
                  disabled={isExtracting}
                  className="w-full bg-[hsl(var(--brain-health))] hover:bg-[hsl(var(--brain-health))]/90"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Extract InControl Items
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        <InControlExtractionDialog
          open={showExtractionDialog}
          onOpenChange={setShowExtractionDialog}
          isProcessing={isExtracting}
          extractedItems={extractedActions}
          onConfirm={handleConfirmExtraction}
          processingStage={extractionStage}
        />
      </CardContent>
    </Card>
  );
}
