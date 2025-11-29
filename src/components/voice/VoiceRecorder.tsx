
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mic, Square, Save, Loader2, Sparkles } from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  defaultCategory?: string;
  onSaved?: (recording: any) => void;
}

export function VoiceRecorder({ defaultCategory = 'general', onSaved }: VoiceRecorderProps) {
  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    saveRecording
  } = useVoiceRecorder();

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(defaultCategory);
  const [shareWithHealthcare, setShareWithHealthcare] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [lastSavedRecording, setLastSavedRecording] = useState<any>(null);

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
    setLastSavedRecording(null);
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
      setLastSavedRecording(result);
      // Reset form
      setAudioBlob(null);
      setTitle('');
      setDescription('');
      setShareWithHealthcare(false);
      onSaved?.(result);
    }
  };

  const handleProcessWithAI = async () => {
    if (!lastSavedRecording?.id) {
      toast.error('Please save a recording first');
      return;
    }

    setIsProcessingAI(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to use AI processing');
        return;
      }

      const response = await supabase.functions.invoke('process-voice-recording', {
        body: { 
          recording_id: lastSavedRecording.id,
          transcription: lastSavedRecording.transcription 
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { summary, extracted_acts_count } = response.data;
      
      toast.success(
        `AI processed! Found ${extracted_acts_count} action items.`,
        { description: summary?.substring(0, 100) + '...' }
      );

      setLastSavedRecording(null);
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('Failed to process with AI. Please try again.');
    } finally {
      setIsProcessingAI(false);
    }
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
          {!isRecording && !audioBlob && !lastSavedRecording && (
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

          {/* Show AI processing option after save */}
          {lastSavedRecording && !audioBlob && (
            <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <div className="text-center">
                <p className="font-medium text-green-600">Recording saved! ✓</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Process with AI to extract action items and insights
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleProcessWithAI}
                  disabled={isProcessingAI}
                  className="gap-2"
                >
                  {isProcessingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Process with AI
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLastSavedRecording(null);
                  }}
                >
                  Skip
                </Button>
              </div>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
