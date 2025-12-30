import React, { useState, useEffect, useRef } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
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
import { EnhancedBackgroundEffects } from '@/components/ui/EnhancedBackgroundEffects';
import { Badge } from '@/components/ui/badge';

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

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

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

  useEffect(() => {
    if (isRecording && !isPaused) {
      setState('recording');
    } else if (isRecording && isPaused) {
      setState('paused');
    }
  }, [isRecording, isPaused]);

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
    if (playingId === recording.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }

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
      {/* Premium background */}
      <div className="fixed inset-0 -z-10">
        <EnhancedBackgroundEffects />
      </div>

      <div className="relative z-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Memory Bridge</h1>
          <p className="text-muted-foreground">Record conversations, we'll extract the actions</p>
        </div>

        {/* Premium Recording Interface */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl mb-6 text-center py-10 px-6">
          {/* Glass reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
          
          {/* Neural pathway decorations */}
          <div className="absolute top-4 right-4 w-24 h-24 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="80" cy="20" r="8" fill="currentColor" className="text-neural-purple-500" />
              <circle cx="60" cy="40" r="5" fill="currentColor" className="text-brand-orange-500" />
              <path d="M80,20 Q70,30 60,40" stroke="currentColor" strokeWidth="2" className="text-neural-purple-400" fill="none" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-4 w-20 h-20 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="20" cy="80" r="6" fill="currentColor" className="text-clarity-teal-500" />
              <circle cx="40" cy="60" r="4" fill="currentColor" className="text-memory-emerald-500" />
              <path d="M20,80 Q30,70 40,60" stroke="currentColor" strokeWidth="2" className="text-clarity-teal-400" fill="none" />
            </svg>
          </div>

          <div className="relative z-10">
            {state === 'idle' && (
              <>
                {/* Luxurious microphone button */}
                <div className="relative w-28 h-28 mx-auto mb-4">
                  {/* Animated outer ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-orange-500 via-clarity-teal-500 to-neural-purple-500 rounded-full animate-spin opacity-60 blur-sm" style={{ animationDuration: '8s' }} />
                  {/* Pulsing glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-orange-400 to-brand-orange-600 rounded-full animate-pulse opacity-40" />
                  {/* Glass morphism inner */}
                  <button
                    onClick={handleStartRecording}
                    className="absolute inset-2 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
                  >
                    <div className="bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-brand-orange-500/40">
                      <Mic className="h-8 w-8 text-white" />
                    </div>
                  </button>
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">Tap to Record</p>
                <p className="text-sm text-muted-foreground">We'll listen and find the action items</p>
              </>
            )}

            {(state === 'recording' || state === 'paused') && (
              <>
                <div className={cn(
                  "relative w-28 h-28 mx-auto mb-4"
                )}>
                  {/* Recording pulse effect */}
                  {state === 'recording' && (
                    <>
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30" />
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-50" />
                    </>
                  )}
                  <div className={cn(
                    "absolute inset-0 rounded-full flex items-center justify-center shadow-2xl transition-all",
                    state === 'recording' ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-amber-500 to-amber-600"
                  )}>
                    {state === 'recording' ? (
                      <div className="w-10 h-10 bg-white rounded-lg shadow-inner" />
                    ) : (
                      <Pause className="h-12 w-12 text-white" />
                    )}
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{formatDuration(duration)}</p>
                <Badge className={cn(
                  "mb-4",
                  state === 'recording' 
                    ? "bg-red-100 text-red-700 border-red-200" 
                    : "bg-amber-100 text-amber-700 border-amber-200"
                )}>
                  {state === 'recording' ? '● Recording...' : '❚❚ Paused'}
                </Badge>
                
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
                <div className="w-28 h-28 mx-auto mb-4 bg-gradient-to-br from-memory-emerald-100 to-clarity-teal-100 rounded-full flex items-center justify-center shadow-xl border border-memory-emerald-200/50">
                  <Play className="h-12 w-12 text-memory-emerald-600 ml-1" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">Recording Complete!</p>
                <Badge className="mb-4 bg-muted">{formatDuration(duration)}</Badge>
                
                <input
                  type="text"
                  value={recordingTitle}
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  placeholder="Name this recording..."
                  className="w-full max-w-xs mx-auto mb-4 px-4 py-3 rounded-xl border border-white/40 bg-white/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange-500 shadow-lg"
                />
                
                <div className="flex items-center justify-center gap-3 mb-6">
                  <button
                    onClick={() => setNotifySupport(!notifySupport)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md",
                      notifySupport
                        ? "bg-gradient-to-r from-memory-emerald-100 to-clarity-teal-100 text-memory-emerald-700 border border-memory-emerald-200"
                        : "bg-white/80 text-muted-foreground border border-white/40"
                    )}
                  >
                    <Users className="h-4 w-4" />
                    Notify Support Circle
                  </button>
                </div>

                <LaunchButton onClick={handleSave} className="w-full max-w-xs bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 shadow-lg shadow-brand-orange-500/30" disabled={isProcessing}>
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
          </div>
        </div>

        {/* Recent Recordings */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Recent Recordings</h2>
          <button className="text-sm text-brand-orange-600 font-medium hover:text-brand-orange-700 transition-colors">View all</button>
        </div>

        <div className="space-y-3 mb-24">
          {recordings.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl p-6 text-center">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
              <p className="relative z-10 text-muted-foreground">No recordings yet. Start your first one!</p>
            </div>
          ) : (
            recordings.slice(0, 5).map((recording) => {
              const isProcessed = processedRecordings.has(recording.id);
              const isCurrentlyProcessing = processingId === recording.id;
              const isPlaying = playingId === recording.id;
              const actionsCount = actionsCountMap[recording.id] || 0;

              return (
                <div 
                  key={recording.id} 
                  className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
                >
                  {/* Glass reflection */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
                  
                  {/* Left accent bar */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
                    isProcessed 
                      ? "bg-gradient-to-b from-memory-emerald-500 to-clarity-teal-500" 
                      : "bg-gradient-to-b from-brand-orange-500 to-brand-orange-600"
                  )} />
                  
                  <div className="relative z-10 flex flex-col gap-3 pl-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center shadow-lg",
                          isProcessed
                            ? "bg-gradient-to-br from-memory-emerald-100 to-clarity-teal-100"
                            : "bg-gradient-to-br from-brand-orange-100 to-brand-orange-50"
                        )}>
                          <Mic className={cn(
                            "h-5 w-5",
                            isProcessed ? "text-memory-emerald-600" : "text-brand-orange-600"
                          )} />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{recording.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRecordingDate(recording.created_at)}
                            {recording.duration_seconds && (
                              <span className="ml-2">• {formatDuration(recording.duration_seconds)}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {isProcessed && (
                        <Badge className="bg-gradient-to-r from-memory-emerald-100 to-clarity-teal-100 text-memory-emerald-700 border border-memory-emerald-200 shadow-md">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Actions Ready
                        </Badge>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayRecording(recording)}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md",
                          isPlaying
                            ? "bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 text-white"
                            : "bg-white/90 hover:bg-white border border-white/60 text-foreground hover:shadow-lg"
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

                      {isProcessed ? (
                        <button
                          onClick={() => handleViewActions(recording)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 text-white hover:from-memory-emerald-600 hover:to-clarity-teal-600 transition-all shadow-lg shadow-memory-emerald-500/30"
                        >
                          <Eye className="h-4 w-4" />
                          View {actionsCount} Action{actionsCount !== 1 ? 's' : ''}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleProcessRecording(recording)}
                          disabled={isCurrentlyProcessing}
                          className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg",
                            isCurrentlyProcessing
                              ? "bg-muted text-muted-foreground cursor-not-allowed"
                              : "bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 text-white hover:from-brand-orange-600 hover:to-brand-orange-700 shadow-brand-orange-500/30"
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
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Celebration Modal */}
      <CompletionCelebration
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        actionTitle="Memory Bridge recording"
        onNotifySupport={notifySupport ? () => console.log('Notifying support') : undefined}
        streakCount={3}
      />

      {/* Actions Viewer */}
      {viewingActions && (
        <ActionsViewer
          recordingId={viewingActions.recordingId}
          meetingTitle={viewingActions.title}
          isOpen={true}
          onClose={() => setViewingActions(null)}
        />
      )}
    </LaunchLayout>
  );
}
