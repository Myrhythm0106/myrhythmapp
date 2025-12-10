import React, { useState, useEffect, useRef } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { CompletionCelebration } from '@/components/launch/CompletionCelebration';
import { Mic, Square, Play, Pause, Save, Users, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { formatDistanceToNow } from 'date-fns';

type RecordingState = 'idle' | 'recording' | 'paused' | 'reviewing';

export default function LaunchMemoryBridge() {
  const [state, setState] = useState<RecordingState>('idle');
  const [showCelebration, setShowCelebration] = useState(false);
  const [notifySupport, setNotifySupport] = useState(true);
  const [recordingTitle, setRecordingTitle] = useState('');
  const audioBlobRef = useRef<Blob | null>(null);

  const {
    isRecording,
    isPaused,
    isProcessing,
    recordings,
    duration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    saveRecording,
    fetchRecordings,
    formatDuration
  } = useVoiceRecorder();

  // Fetch recordings on mount
  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  // Sync hook state with component state
  useEffect(() => {
    if (isRecording && !isPaused) {
      setState('recording');
    } else if (isRecording && isPaused) {
      setState('paused');
    }
  }, [isRecording, isPaused]);

  const handleStartRecording = async () => {
    const success = await startRecording();
    if (success) {
      setState('recording');
      setRecordingTitle(`Recording ${new Date().toLocaleTimeString()}`);
    }
  };

  const handlePauseRecording = () => {
    pauseRecording();
    setState('paused');
  };

  const handleResumeRecording = () => {
    resumeRecording();
    setState('recording');
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      audioBlobRef.current = blob;
      setState('reviewing');
    }
  };

  const handleSave = async () => {
    if (!audioBlobRef.current) return;
    
    const saved = await saveRecording(
      audioBlobRef.current,
      recordingTitle || `Recording ${new Date().toLocaleTimeString()}`,
      'memory-bridge',
      undefined,
      notifySupport
    );

    if (saved) {
      setShowCelebration(true);
      audioBlobRef.current = null;
    }
  };

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    setState('idle');
    setRecordingTitle('');
  };

  const formatRecordingDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return dateStr;
    }
  };

  return (
    <LaunchLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Memory Bridge</h1>
        <p className="text-muted-foreground">Record conversations, we'll extract the actions</p>
      </div>

      {/* Recording Interface */}
      <LaunchCard variant="featured" className="mb-6 text-center py-10">
        {state === 'idle' && (
          <>
            <button
              onClick={handleStartRecording}
              className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-brand-emerald-500 to-brand-teal-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow active:scale-95"
            >
              <Mic className="h-10 w-10 text-white" />
            </button>
            <p className="text-lg font-semibold text-foreground mb-1">Tap to Record</p>
            <p className="text-sm text-muted-foreground">We'll listen and find the action items</p>
          </>
        )}

        {(state === 'recording' || state === 'paused') && (
          <>
            <div className={cn(
              "w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg",
              state === 'recording' ? "bg-red-500 animate-pulse" : "bg-amber-500"
            )}>
              {state === 'recording' ? (
                <div className="w-8 h-8 bg-white rounded-sm" />
              ) : (
                <Pause className="h-10 w-10 text-white" />
              )}
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{formatDuration(duration)}</p>
            <p className={cn(
              "text-sm font-medium mb-4",
              state === 'recording' ? "text-red-600" : "text-amber-600"
            )}>
              {state === 'recording' ? 'Recording...' : 'Paused'}
            </p>
            
            <div className="flex items-center justify-center gap-3">
              {state === 'recording' ? (
                <LaunchButton onClick={handlePauseRecording} variant="outline">
                  <Pause className="h-5 w-5" />
                  Pause
                </LaunchButton>
              ) : (
                <LaunchButton onClick={handleResumeRecording} variant="outline">
                  <Play className="h-5 w-5" />
                  Continue
                </LaunchButton>
              )}
              <LaunchButton onClick={handleStopRecording} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                <Square className="h-5 w-5" />
                Stop
              </LaunchButton>
            </div>
          </>
        )}

        {state === 'reviewing' && (
          <>
            <div className="w-24 h-24 mx-auto mb-4 bg-brand-emerald-100 rounded-full flex items-center justify-center">
              <Play className="h-10 w-10 text-brand-emerald-600 ml-1" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">Recording Complete!</p>
            <p className="text-sm text-muted-foreground mb-4">Duration: {formatDuration(duration)}</p>
            
            {/* Title Input */}
            <input
              type="text"
              value={recordingTitle}
              onChange={(e) => setRecordingTitle(e.target.value)}
              placeholder="Name this recording..."
              className="w-full max-w-xs mx-auto mb-4 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-emerald-500"
            />
            
            {/* Notify Support Circle Toggle */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setNotifySupport(!notifySupport)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  notifySupport
                    ? "bg-brand-emerald-100 text-brand-emerald-700"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Users className="h-4 w-4" />
                Notify Support Circle
              </button>
            </div>

            <LaunchButton onClick={handleSave} className="w-full max-w-xs" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save & Extract Actions
                </>
              )}
            </LaunchButton>
          </>
        )}
      </LaunchCard>

      {/* Recent Recordings */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">Recent Recordings</h2>
        <button className="text-sm text-brand-emerald-600 font-medium">View all</button>
      </div>

      <div className="space-y-3 mb-24">
        {recordings.length === 0 ? (
          <LaunchCard variant="glass" className="p-6 text-center">
            <p className="text-muted-foreground">No recordings yet. Start your first one!</p>
          </LaunchCard>
        ) : (
          recordings.slice(0, 5).map((recording) => (
            <LaunchCard key={recording.id} variant="glass" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-emerald-100 flex items-center justify-center">
                    <Mic className="h-5 w-5 text-brand-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{recording.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRecordingDate(recording.created_at)}
                      {recording.duration_seconds && (
                        <span className="ml-2">• {formatDuration(recording.duration_seconds)}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </LaunchCard>
          ))
        )}
      </div>

      {/* Celebration Modal */}
      <CompletionCelebration
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        actionTitle="Memory Bridge recording"
        onNotifySupport={notifySupport ? () => console.log('Notifying support') : undefined}
        streakCount={3}
      />
    </LaunchLayout>
  );
}
