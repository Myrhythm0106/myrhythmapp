import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Upload, FileAudio, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatTime } from '@/utils/audioHelpers';
import type { ProcessingProgress as ProcessingProgressType } from '@/types/processing';

interface ProcessingProgressProps {
  audioDuration: number; // in seconds
  progress: ProcessingProgressType;
}

export function ProcessingProgress({ audioDuration, progress }: ProcessingProgressProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second for elapsed time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStageIcon = (stage: ProcessingProgressType['stage']) => {
    switch (stage) {
      case 'uploading':
        return <Upload className="h-4 w-4" />;
      case 'transcribing':
        return <FileAudio className="h-4 w-4" />;
      case 'extracting':
        return <Sparkles className="h-4 w-4" />;
      case 'complete':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStageColor = (stage: ProcessingProgressType['stage'], isActive: boolean) => {
    if (!isActive) return 'text-muted-foreground';
    
    switch (stage) {
      case 'uploading':
        return 'text-blue-600';
      case 'transcribing':
        return 'text-purple-600';
      case 'extracting':
        return 'text-memory-emerald-600';
      case 'complete':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
    }
  };

  const getStageName = (stage: ProcessingProgressType['stage']) => {
    switch (stage) {
      case 'uploading':
        return 'Uploading';
      case 'transcribing':
        return 'Transcribing';
      case 'extracting':
        return 'Extracting ACTs';
      case 'complete':
        return 'Complete';
      case 'failed':
        return 'Failed';
    }
  };

  const isStageComplete = (checkStage: ProcessingProgressType['stage']) => {
    const stages: ProcessingProgressType['stage'][] = ['uploading', 'transcribing', 'extracting', 'complete'];
    const currentIndex = stages.indexOf(progress.stage);
    const checkIndex = stages.indexOf(checkStage);
    return checkIndex < currentIndex || progress.stage === 'complete';
  };

  const isStageActive = (checkStage: ProcessingProgressType['stage']) => {
    return progress.stage === checkStage;
  };

  return (
    <Card className="border-2 border-memory-emerald-200 bg-gradient-to-br from-white via-memory-emerald-50/30 to-brain-health-50/20">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-brain-health-900 mb-1">
              🎙️ Processing Your Recording
            </h3>
            <p className="text-sm text-brain-health-600">
              Audio Duration: {formatTime(audioDuration)}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress.progress} 
              className="h-3"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-brain-health-600">{progress.progress}% complete</span>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(progress.estimatedRemaining)} remaining
              </Badge>
            </div>
          </div>

          {/* Current Stage Info */}
          <div className="bg-memory-emerald-50 border border-memory-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`${getStageColor(progress.stage, true)}`}>
                {getStageIcon(progress.stage)}
              </div>
              <span className="font-medium text-brain-health-900">
                {getStageName(progress.stage)}...
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brain-health-600">
              <Clock className="h-3 w-3" />
              <span>Elapsed: {formatTime(progress.elapsedTime)}</span>
            </div>
            {progress.message && (
              <p className="text-sm text-brain-health-600 mt-2">{progress.message}</p>
            )}
          </div>

          {/* Stage Progress List */}
          <div className="space-y-3">
            {/* Upload Stage */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                isStageComplete('uploading') 
                  ? 'bg-green-100 text-green-600' 
                  : isStageActive('uploading')
                  ? 'bg-blue-100 text-blue-600 animate-pulse'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {isStageComplete('uploading') ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </div>
              <span className={`text-sm ${
                isStageComplete('uploading') 
                  ? 'text-green-600 font-medium' 
                  : isStageActive('uploading')
                  ? 'text-blue-600 font-medium'
                  : 'text-muted-foreground'
              }`}>
                Upload recording
              </span>
            </div>

            {/* Transcribe Stage */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                isStageComplete('transcribing') 
                  ? 'bg-green-100 text-green-600' 
                  : isStageActive('transcribing')
                  ? 'bg-purple-100 text-purple-600 animate-pulse'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {isStageComplete('transcribing') ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <FileAudio className="h-4 w-4" />
                )}
              </div>
              <span className={`text-sm ${
                isStageComplete('transcribing') 
                  ? 'text-green-600 font-medium' 
                  : isStageActive('transcribing')
                  ? 'text-purple-600 font-medium'
                  : 'text-muted-foreground'
              }`}>
                Transcribe audio (takes ~{Math.ceil(audioDuration * 0.4 / 60)}m for {formatTime(audioDuration)} audio)
              </span>
            </div>

            {/* Extract Stage */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                isStageComplete('extracting') 
                  ? 'bg-green-100 text-green-600' 
                  : isStageActive('extracting')
                  ? 'bg-memory-emerald-100 text-memory-emerald-600 animate-pulse'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {isStageComplete('extracting') ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>
              <span className={`text-sm ${
                isStageComplete('extracting') 
                  ? 'text-green-600 font-medium' 
                  : isStageActive('extracting')
                  ? 'text-memory-emerald-600 font-medium'
                  : 'text-muted-foreground'
              }`}>
                Extract SMART ACTs
              </span>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 text-center">
              💡 Longer recordings take proportionally more time to process
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
