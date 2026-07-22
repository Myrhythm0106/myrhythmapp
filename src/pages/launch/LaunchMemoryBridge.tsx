import React, { useState, useEffect, useRef } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchHeroBand } from '@/components/launch/LaunchHeroBand';
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
import { PostExtractionDialog } from '@/components/memoryBridge/PostExtractionDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { convertActionToCalendarEvent } from '@/utils/calendarIntegration';
import { NextStepsItem } from '@/types/memoryBridge';
import { OutputActions } from '@/components/shared/OutputActions';
import { LoopInPicker, AdhocLoopIn } from '@/components/shared/LoopInPicker';


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
  const [loopCircleIds, setLoopCircleIds] = useState<string[]>([]);
  const [loopAdhoc, setLoopAdhoc] = useState<AdhocLoopIn[]>([]);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processedRecordings, setProcessedRecordings] = useState<Set<string>>(new Set());
  const [actionsCountMap, setActionsCountMap] = useState<Record<string, number>>({});
  const [viewingActions, setViewingActions] = useState<{ recordingId: string; title: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // New states for streamlined flow
  const [showPostExtractionDialog, setShowPostExtractionDialog] = useState(false);
  const [lastExtractionResult, setLastExtractionResult] = useState<{ 
    meetingId: string; 
    recordingId: string; 
    actionsCount: number; 
    title: string 
  } | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

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
    if (!audioBlobRef.current || !user) return;

    setIsExtracting(true);
    const title = recordingTitle || `Recording ${new Date().toLocaleTimeString()}`;

    try {
      const saved = await saveRecording(
        audioBlobRef.current,
        title,
        'memory-bridge',
        undefined,
        notifySupport
      );

      if (!saved) {
        // saveRecording already surfaced a toast
        return;
      }

      audioBlobRef.current = null;

      // Automatically start extraction
      const result = await processSavedRecording(
        saved.id,
        user.id,
        duration
      );

      if (result.success && result.actionsCount && result.actionsCount > 0) {
        // Apply loop-ins to all newly extracted actions
        if (result.meetingId && (loopCircleIds.length > 0 || loopAdhoc.length > 0)) {
          const { error: loopErr } = await supabase
            .from('extracted_actions')
            .update({
              assigned_watchers: loopCircleIds,
              adhoc_loop_ins: loopAdhoc as any,
            })
            .eq('meeting_recording_id', result.meetingId);
          if (loopErr) console.warn('Failed to apply loop-ins to actions', loopErr);
        }

        setLastExtractionResult({
          meetingId: result.meetingId!,
          recordingId: saved.id,
          actionsCount: result.actionsCount,
          title
        });
        setShowPostExtractionDialog(true);
        setProcessedRecordings(prev => new Set([...prev, saved.id]));
        setActionsCountMap(prev => ({ ...prev, [saved.id]: result.actionsCount! }));
        setLoopCircleIds([]);
        setLoopAdhoc([]);
      } else if (result.success) {
        // Success but no actions
        setShowCelebration(true);
        toast.info('Recording saved! No actionable items found.');
      }
      // On failure, processSavedRecording already shows a toast — nothing else to do.

      fetchRecordings();
      setState('idle');
      setRecordingTitle('');
    } catch (err) {
      console.error('handleSave: unexpected error', err);
      toast.error(
        `Could not save recording: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setIsExtracting(false);
    }
  };


  const handleAcceptAndScheduleAll = async (
    notifyCircle: boolean,
    actionIds?: string[],
  ) => {
    if (!lastExtractionResult || !user) return;

    try {
      // Fetch actions for this meeting, filtered to the user's selection if provided
      let query = supabase
        .from('extracted_actions')
        .select('*')
        .eq('meeting_recording_id', lastExtractionResult.meetingId);
      if (actionIds && actionIds.length > 0) {
        query = query.in('id', actionIds);
      }
      const { data: actions, error } = await query;

      if (error) throw error;

      let scheduled = 0;
      for (const action of actions || []) {
        try {
          const eventId = await convertActionToCalendarEvent(
            action as unknown as NextStepsItem,
            user.id,
            [],
            action.proposed_date,
            action.proposed_time
          );

          if (eventId) {
            await supabase
              .from('extracted_actions')
              .update({
                status: 'scheduled',
                calendar_event_id: eventId,
                support_circle_notified: notifyCircle
              })
              .eq('id', action.id);
            scheduled++;
          }
        } catch (err) {
          console.error('Failed to schedule action:', err);
        }
      }

      if (scheduled === 0) {
        toast.info('No actions were scheduled.');
      } else {
        const total = actionIds?.length ?? (actions?.length || 0);
        toast.success(
          scheduled === total
            ? `Scheduled ${scheduled} ${scheduled === 1 ? 'action' : 'actions'} to your calendar!`
            : `Scheduled ${scheduled} of ${total} selected actions.`,
        );
      }
      setShowPostExtractionDialog(false);
      setShowCelebration(true);

    } catch (error) {
      console.error('Error scheduling all actions:', error);
      toast.error('Failed to schedule actions');
    }
  };

  const handleReviewIndividually = () => {
    if (lastExtractionResult) {
      setViewingActions({
        recordingId: lastExtractionResult.recordingId,
        title: lastExtractionResult.title
      });
    }
    setShowPostExtractionDialog(false);
  };

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    setState('idle');
    setRecordingTitle('');
    setLastExtractionResult(null);
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
      <LaunchHeroBand
        eyebrow="Capture"
        title="Memory Bridge"
        subtitle="Record conversations, we'll extract the actions — so nothing important is left to recall under pressure."
        align="center"
      />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24">
        {/* Recording Interface */}
        <LaunchCard className="relative overflow-hidden bg-launch-ivory border-launch-gold/30 mb-6 text-center py-10 px-6">

          {/* Subtle topographic decoration */}
          <div className="absolute top-4 right-4 w-24 h-24 opacity-10 text-launch-gold">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              <circle cx="80" cy="20" r="6" fill="currentColor" />
              <circle cx="60" cy="40" r="4" fill="currentColor" />
              <path d="M80,20 Q70,30 60,40" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-4 w-20 h-20 opacity-10 text-launch-gold">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              <circle cx="20" cy="80" r="5" fill="currentColor" />
              <circle cx="40" cy="60" r="3" fill="currentColor" />
              <path d="M20,80 Q30,70 40,60" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="relative z-10">
            {state === 'idle' && (
              <>
                {/* Microphone button */}
                <div className="relative w-28 h-28 mx-auto mb-4">
                  {/* Animated outer ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-launch-ember via-launch-gold to-launch-moss rounded-full animate-spin opacity-60 blur-sm" style={{ animationDuration: '8s' }} />
                  {/* Pulsing glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-launch-ember to-launch-ember/80 rounded-full animate-pulse opacity-40" />
                  {/* Inner */}
                  <button
                    onClick={handleStartRecording}
                    className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
                  >
                    <div className="bg-gradient-to-br from-launch-ember to-launch-ember/80 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-launch-ember/30">
                      <Mic className="h-8 w-8 text-white" />
                    </div>
                  </button>
                </div>
                <p className="text-lg font-semibold text-launch-ink mb-1">Tap to Record</p>
                <p className="text-sm text-launch-ink/70">We'll listen and find the action items</p>
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
                      <div className="absolute inset-0 bg-launch-ember rounded-full animate-ping opacity-30" />
                      <div className="absolute inset-0 bg-launch-ember rounded-full animate-pulse opacity-50" />
                    </>
                  )}
                  <div className={cn(
                    "absolute inset-0 rounded-full flex items-center justify-center shadow-2xl transition-all",
                    state === 'recording' ? "bg-gradient-to-br from-launch-ember to-launch-ember/80" : "bg-gradient-to-br from-launch-gold to-launch-gold/80"
                  )}>
                    {state === 'recording' ? (
                      <div className="w-10 h-10 bg-white rounded-lg shadow-inner" />
                    ) : (
                      <Pause className="h-12 w-12 text-white" />
                    )}
                  </div>
                </div>
                <p className="text-3xl font-bold text-launch-ink mb-1 font-display">{formatDuration(duration)}</p>
                <Badge className={cn(
                  "mb-4",
                  state === 'recording'
                    ? "bg-launch-ember/10 text-launch-ember border-launch-ember/30"
                    : "bg-launch-gold/10 text-launch-gold border-launch-gold/30"
                )}>
                  {state === 'recording' ? '● Recording...' : '❚❚ Paused'}
                </Badge>

                <div className="flex items-center justify-center gap-3">
                  {state === 'recording' ? (
                    <LaunchButton onClick={handlePauseRecording} variant="outline" className="border-launch-gold/30 text-launch-ink hover:bg-launch-gold/10">
                      <Pause className="h-5 w-5" />
                      Pause
                    </LaunchButton>
                  ) : (
                    <LaunchButton onClick={handleResumeRecording} variant="outline" className="border-launch-gold/30 text-launch-ink hover:bg-launch-gold/10">
                      <Play className="h-5 w-5" />
                      Continue
                    </LaunchButton>
                  )}
                  <LaunchButton onClick={handleStopRecording} variant="outline" className="border-launch-ember/30 text-launch-ember hover:bg-launch-ember/5">
                    <Square className="h-5 w-5" />
                    Stop
                  </LaunchButton>
                </div>
              </>
            )}

            {state === 'reviewing' && (
              <>
                <div className="w-28 h-28 mx-auto mb-4 bg-launch-moss/10 rounded-full flex items-center justify-center border border-launch-moss/20">
                  <Play className="h-12 w-12 text-launch-moss ml-1" />
                </div>
                <p className="text-lg font-semibold text-launch-ink mb-2">Recording Complete!</p>
                <Badge className="mb-4 bg-launch-gold/10 text-launch-gold border-launch-gold/30">{formatDuration(duration)}</Badge>

                <input
                  type="text"
                  value={recordingTitle}
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  placeholder="Name this recording..."
                  className="w-full max-w-xs mx-auto mb-4 px-4 py-3 rounded-xl border border-launch-gold/30 bg-white text-launch-ink placeholder:text-launch-ink/40 focus:outline-none focus:ring-2 focus:ring-launch-gold/50 shadow-sm block"
                />

                <div className="flex items-center justify-center gap-3 mb-6">
                  <button
                    onClick={() => setNotifySupport(!notifySupport)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                      notifySupport
                        ? "bg-launch-moss/10 text-launch-moss border border-launch-moss/30"
                        : "bg-white text-launch-ink/70 border border-launch-gold/30"
                    )}
                  >
                    <Users className="h-4 w-4" />
                    Notify Support Circle
                  </button>
                </div>

                <div className="max-w-xs mx-auto mb-4 text-left">
                  <p className="text-xs font-medium text-launch-ink/60 mb-1.5 text-center">
                    Loop someone in on the actions from this recording
                  </p>
                  <div className="flex justify-center">
                    <LoopInPicker
                      circleMemberIds={loopCircleIds}
                      adhocLoopIns={loopAdhoc}
                      onChange={(next) => {
                        setLoopCircleIds(next.circleMemberIds);
                        setLoopAdhoc(next.adhocLoopIns);
                      }}
                      triggerLabel="Loop someone in"
                    />
                  </div>
                </div>

                <LaunchButton onClick={handleSave} className="w-full max-w-xs bg-launch-ember hover:bg-launch-ember/90 text-white" disabled={isProcessing || isExtracting}>
                  {isProcessing || isExtracting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {isExtracting ? 'Extracting Actions...' : 'Saving...'}
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
        </LaunchCard>


        {/* Recent Recordings */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-launch-ink">Recent Recordings</h2>
          <button className="text-sm text-launch-ember font-medium hover:text-launch-ember/80 transition-colors">View all</button>
        </div>

        <div className="space-y-3 mb-24">
          {recordings.length === 0 ? (
            <LaunchCard className="bg-launch-ivory border-launch-gold/30 p-6 text-center">
              <p className="text-launch-ink/70">No recordings yet. Start your first one!</p>
            </LaunchCard>
          ) : (

            recordings.slice(0, 5).map((recording) => {
              const isProcessed = processedRecordings.has(recording.id);
              const isCurrentlyProcessing = processingId === recording.id;
              const isPlaying = playingId === recording.id;
              const actionsCount = actionsCountMap[recording.id] || 0;

              return (
                <LaunchCard
                  key={recording.id}
                  className="relative overflow-hidden bg-launch-ivory border-launch-gold/30 p-4"
                >
                  {/* Left accent bar */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
                    isProcessed
                      ? "bg-launch-moss"
                      : "bg-launch-ember"
                  )} />

                  <div className="relative z-10 flex flex-col gap-3 pl-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center",
                          isProcessed
                            ? "bg-launch-moss/10"
                            : "bg-launch-ember/10"
                        )}>
                          <Mic className={cn(
                            "h-5 w-5",
                            isProcessed ? "text-launch-moss" : "text-launch-ember"
                          )} />
                        </div>
                        <div>
                          <p className="font-semibold text-launch-ink">{recording.title}</p>
                          <p className="text-xs text-launch-ink/60 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRecordingDate(recording.created_at)}
                            {recording.duration_seconds && (
                              <span className="ml-2">• {formatDuration(recording.duration_seconds)}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {isProcessed && (
                        <Badge className="bg-launch-moss/10 text-launch-moss border-launch-moss/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Actions Ready
                        </Badge>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handlePlayRecording(recording)}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                          isPlaying
                            ? "bg-launch-ember text-white"
                            : "bg-white border border-launch-gold/30 text-launch-ink hover:bg-launch-gold/5"
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
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-launch-moss text-white hover:bg-launch-moss/90 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                          View {actionsCount} Action{actionsCount !== 1 ? 's' : ''}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleProcessRecording(recording)}
                          disabled={isCurrentlyProcessing}
                          className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                            isCurrentlyProcessing
                              ? "bg-launch-ink/10 text-launch-ink/50 cursor-not-allowed"
                              : "bg-launch-ember text-white hover:bg-launch-ember/90"
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

                    {/* Output toolbar: Copy / Email / Download — cognitive-load-safe takeaway */}
                    <OutputActions
                      text={[
                        `Recording: ${recording.title}`,
                        `Saved: ${formatRecordingDate(recording.created_at)}`,
                        recording.duration_seconds ? `Length: ${formatDuration(recording.duration_seconds)}` : '',
                        actionsCount > 0 ? `Actions found: ${actionsCount}` : '',
                        recording.transcription ? `\nTranscript:\n${recording.transcription}` : '',
                        '\n— Sent from MyRhythm (Founding Edition · v0.1)',
                      ].filter(Boolean).join('\n')}
                      subject={`MyRhythm — ${recording.title}`}
                      size="compact"
                      className="pt-1"
                    />
                  </div>
                </LaunchCard>
              );

            })
          )}
        </div>
      </div>

      {/* Post-Extraction Dialog - Accept All or Review */}
      <PostExtractionDialog
        isOpen={showPostExtractionDialog}
        onClose={() => setShowPostExtractionDialog(false)}
        actionsCount={lastExtractionResult?.actionsCount || 0}
        meetingTitle={lastExtractionResult?.title || ''}
        meetingId={lastExtractionResult?.meetingId}
        onAcceptAndScheduleAll={handleAcceptAndScheduleAll}
        onReviewIndividually={handleReviewIndividually}
      />

      {/* Celebration Modal */}
      <CompletionCelebration
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        actionTitle={lastExtractionResult ? `${lastExtractionResult.actionsCount} actions scheduled` : "Memory Bridge recording"}
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
