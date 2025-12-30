import React, { useState, useEffect, useRef } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { CompletionCelebration } from '@/components/launch/CompletionCelebration';
import { Mic, Square, Play, Pause, Save, Users, Clock, Loader2, Brain, Eye, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { processSavedRecording } from '@/utils/processSavedRecording';
import { ActionsViewer } from '@/components/memoryBridge/ActionsViewer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type RecordingState = 'idle' | 'recording' | 'paused' | 'reviewing';

interface VoiceRecording {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_path: string;
  duration_seconds?: number;
  transcription?: string;
  access_level: string;
  created_at: string;
}

export default function LaunchMemoryBridge() {
  const { user } = useAuth();
  const [state, setState] = useState<RecordingState>('idle');
  const [showCelebration, setShowCelebration] = useState(false);
  const [notifySupport, setNotifySupport] = useState(true);
  const [recordingTitle, setRecordingTitle] = useState('');
  const audioBlobRef = useRef<Blob | null>(null);

  // Playback and actions state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processedRecordings, setProcessedRecordings] = useState<Set<string>>(new Set());
  const [actionsCountMap, setActionsCountMap] = useState<Record<string, number>>({});
  const [viewingActions, setViewingActions] = useState<{ recordingId: string; title: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    getRecordingUrl,
    formatDuration
  } = useVoiceRecorder();

  // Fetch recordings and check which ones have been processed
  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  // Check for processed recordings when recordings change
  useEffect(() => {
    if (!user || recordings.length === 0) return;

    const checkProcessedRecordings = async () => {
      const { data: meetings } = await supabase
        .from('meeting_recordings')
        .select('recording_id, id')
        .eq('user_id', user.id)
        .in('recording_id', recordings.map(r => r.id));

      if (!meetings || meetings.length === 0) return;

      const meetingMap = new Map(meetings.map(m => [m.recording_id, m.id]));
      const processedIds = new Set<string>();
      const countsMap: Record<string, number> = {};

      // Get actions count for each meeting
      for (const [recordingId, meetingId] of meetingMap) {
        if (!recordingId) continue;
        
        const { data: actions } = await supabase
          .from('extracted_actions')
          .select('id')
          .eq('meeting_recording_id', meetingId);

        if (actions && actions.length > 0) {
          processedIds.add(recordingId);
          countsMap[recordingId] = actions.length;
        }
      }

      setProcessedRecordings(processedIds);
      setActionsCountMap(countsMap);
    };

    checkProcessedRecordings();
  }, [user, recordings]);

  // Sync hook state with component state
  useEffect(() => {
    if (isRecording && !isPaused) {
      setState('recording');
    } else if (isRecording && isPaused) {
      setState('paused');
    }
  }, [isRecording, isPaused]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  const handlePlayRecording = async (recording: VoiceRecording) => {
    // If already playing this recording, stop it
    if (playingId === recording.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const url = await getRecordingUrl(recording.file_path);
    if (url) {
      const audio = new Audio(url);
      audioRef.current = audio;
      setPlayingId(recording.id);

      audio.onended = () => {
        setPlayingId(null);
        audioRef.current = null;
      };

      audio.onerror = () => {
        toast.error('Failed to play recording');
        setPlayingId(null);
        audioRef.current = null;
      };

      audio.play();
    } else {
      toast.error('Could not load recording');
    }
  };

  const handleProcessRecording = async (recording: VoiceRecording) => {
    if (!user) return;

    setProcessingId(recording.id);
    
    const result = await processSavedRecording(
      recording.id,
      user.id,
      recording.duration_seconds || 0
    );

    if (result.success) {
      setProcessedRecordings(prev => new Set([...prev, recording.id]));
      setActionsCountMap(prev => ({ ...prev, [recording.id]: result.actionsCount || 0 }));
      
      if (result.actionsCount && result.actionsCount > 0) {
        toast.success(`Found ${result.actionsCount} actions!`);
      }
    }
    
    setProcessingId(null);
  };

  const handleViewActions = (recording: VoiceRecording) => {
    setViewingActions({
      recordingId: recording.id,
      title: recording.title
    });
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
          recordings.slice(0, 5).map((recording) => {
            const isProcessed = processedRecordings.has(recording.id);
            const isCurrentlyProcessing = processingId === recording.id;
            const isPlaying = playingId === recording.id;
            const actionsCount = actionsCountMap[recording.id] || 0;

            return (
              <LaunchCard key={recording.id} variant="glass" className="p-4">
                <div className="flex flex-col gap-3">
                  {/* Header row */}
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

                    {/* Processed badge */}
                    {isProcessed && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-brand-emerald-100 text-brand-emerald-700 text-xs font-medium">
                        <CheckCircle className="h-3 w-3" />
                        Actions Ready
                      </div>
                    )}
                  </div>

                  {/* Action buttons row */}
                  <div className="flex items-center gap-2">
                    {/* Play button */}
                    <button
                      onClick={() => handlePlayRecording(recording)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        isPlaying
                          ? "bg-brand-emerald-500 text-white"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      )}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="h-4 w-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4" />
                          Play
                        </>
                      )}
                    </button>

                    {/* Process or View Actions button */}
                    {isProcessed ? (
                      <button
                        onClick={() => handleViewActions(recording)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-emerald-500 text-white hover:bg-brand-emerald-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View {actionsCount} Action{actionsCount !== 1 ? 's' : ''}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleProcessRecording(recording)}
                        disabled={isCurrentlyProcessing}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                          isCurrentlyProcessing
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500 text-white hover:opacity-90"
                        )}
                      >
                        {isCurrentlyProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4" />
                            Discover Actions
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </LaunchCard>
            );
          })
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

      {/* Actions Viewer Modal */}
      {viewingActions && (
        <ActionsViewer
          recordingId={viewingActions.recordingId}
          meetingTitle={viewingActions.title}
          isOpen={!!viewingActions}
          onClose={() => setViewingActions(null)}
        />
      )}
    </LaunchLayout>
  );
}
