import React, { useState, useEffect, useRef } from 'react';
import { recordAction, SURFACES } from '@/lib/evidence/track';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchHeroBand } from '@/components/launch/LaunchHeroBand';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { CompletionCelebration } from '@/components/launch/CompletionCelebration';
import { Mic, Square, Play, Pause, Save, Users, Clock, Loader2, Brain, Eye, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ensureSession, touchSession } from '@/utils/ensureSession';

import { formatDistanceToNow } from 'date-fns';
import { processSavedRecording } from '@/utils/processSavedRecording';
import { ActionsViewer } from '@/components/memoryBridge/ActionsViewer';
import { ReviewStep } from '@/components/memoryBridge/review/ReviewStep';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { scheduleExtractedActions, MeetingScheduleSummary, ActionOverride } from '@/components/memoryBridge/capture-brief/model/scheduleFromMeeting';
import { CommitSummarySheet } from '@/components/memoryBridge/CommitSummarySheet';
import { OutputActions } from '@/components/shared/OutputActions';
import { LoopInPicker, AdhocLoopIn } from '@/components/shared/LoopInPicker';
import { DocumentImportCard, DocumentImportResult } from '@/components/memoryBridge/DocumentImportCard';
import {
  savePendingRecording,
  loadPendingRecording,
  clearPendingRecording,
} from '@/utils/pendingRecording';
import { useMicLevel } from '@/hooks/useMicLevel';
import { MicLevelMeter } from '@/components/memoryBridge/MicLevelMeter';
import { RecordingEggTimer } from '@/components/memoryBridge/RecordingEggTimer';
import { useRecordingAllowance } from '@/hooks/useRecordingAllowance';
import { NEXT_TIER, RECORDING_LIMITS, formatClock, formatMinutes } from '@/config/recordingLimits';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}





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
  const navigate = useNavigate();

  const [state, setState] = useState<RecordingState>('idle');
  const [showCelebration, setShowCelebration] = useState(false);
  const [notifySupport, setNotifySupport] = useState(true);
  const [recordingTitle, setRecordingTitle] = useState('');
  const audioBlobRef = useRef<Blob | null>(null);
  const [restoredDuration, setRestoredDuration] = useState<number | null>(null);

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
    title: string;
    sourceFilePath?: string;
    sourceFileName?: string;
  } | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [commitSummary, setCommitSummary] = useState<MeetingScheduleSummary | null>(null);

  const {
    isRecording,
    isPaused,
    isProcessing,
    recordings,
    duration,
    recordedBytes,
    mediaStream,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    saveRecording,
    fetchRecordings,
    getRecordingUrl,
    formatDuration
  } = useVoiceRecorder();

  const micLevel = useMicLevel(mediaStream, isRecording && !isPaused);
  const allowance = useRecordingAllowance();
  const sessionCapSeconds = allowance.limits.perRecordingMinutes * 60;
  const remainingSessionSeconds = Math.max(0, sessionCapSeconds - duration);
  const outOfAllowance = allowance.remainingMinutes <= 0;
  const nextTierKey = NEXT_TIER[allowance.tier];

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  // Restore a recording that was captured but never saved (page reload,
  // phone backgrounding the tab, auth refresh).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pending = await loadPendingRecording();
      if (cancelled || !pending) return;
      if (audioBlobRef.current) return;
      audioBlobRef.current = pending.blob;
      setRestoredDuration(pending.duration);
      setRecordingTitle(prev => prev || pending.title);
      setState(prev => (prev === 'idle' ? 'reviewing' : prev));
      toast.info('We recovered your last recording — it\'s ready to save.');
    })();
    return () => { cancelled = true; };
  }, []);

  // Keep the session alive: a capture can run for hours, and a backgrounded
  // tab must not come back with an expired token.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') void touchSession();
    };
    document.addEventListener('visibilitychange', onVisible);
    void touchSession();
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  useEffect(() => {
    if (!isRecording) return;
    const id = window.setInterval(() => { void touchSession(); }, 10 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [isRecording]);


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
    if (outOfAllowance) {
      toast.error(
        nextTierKey
          ? `You've used your recording time for this ${allowance.period}. ${RECORDING_LIMITS[nextTierKey].label} gives you ${formatMinutes(RECORDING_LIMITS[nextTierKey].monthlyMinutes)} a month.`
          : `You've used your recording time for this ${allowance.period}.`
      );
      return;
    }
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
    if (!blob || blob.size === 0) {
      // stopRecording already explained the empty capture.
      setState('idle');
      return;
    }
    audioBlobRef.current = blob;
    setRestoredDuration(null);
    const title = recordingTitle || `Recording ${new Date().toLocaleTimeString()}`;
    setState('reviewing');
    // Park it durably so a reload or backgrounded tab can't lose it.
    try {
      await savePendingRecording({
        blob,
        mimeType: blob.type || 'audio/webm',
        extension: (blob.type || '').includes('mp4') ? 'm4a' : 'webm',
        duration,
        title,
        savedAt: Date.now(),
      });
    } catch (err) {
      console.warn('handleStopRecording: could not park recording', err);
    }
  };

  // Auto-stop cleanly at the per-recording cap for this tier.
  const autoStoppedRef = useRef(false);
  useEffect(() => {
    if (!isRecording) {
      autoStoppedRef.current = false;
      return;
    }
    if (duration >= sessionCapSeconds && !autoStoppedRef.current) {
      autoStoppedRef.current = true;
      toast.info(
        `Reached the ${formatMinutes(allowance.limits.perRecordingMinutes)} limit for one recording — saving what you've captured.`
      );
      handleStopRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, isRecording, sessionCapSeconds]);



  const handleSave = async () => {
    if (!audioBlobRef.current) {
      console.warn('handleSave: blocked — no audio in memory');
      toast.error('That recording is no longer available. Please record again.');
      setState('idle');
      return;
    }
    if (audioBlobRef.current.size === 0) {
      console.warn('handleSave: blocked — empty audio blob');
      toast.error('That recording came through empty — check your microphone and record again.');
      setState('idle');
      return;
    }

    // Never trust stale React auth state — ask Supabase and refresh if needed.
    const userId = await ensureSession();
    if (!userId) {
      console.warn('handleSave: blocked — session expired and could not be refreshed');
      toast.error('Your session timed out — your recording is safe.', {
        description: 'Sign in and it will pick up right where it left off.',
        action: {
          label: 'Sign in',
          onClick: () => navigate(`/auth?redirect=${encodeURIComponent('/launch/memory')}`),
        },
        duration: 12000,
      });
      return;
    }

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
      await clearPendingRecording();
      allowance.refresh();

      // Automatically start extraction
      const result = await processSavedRecording(
        saved.id,
        userId,
        restoredDuration ?? duration
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
    actionIds?: string[],
    overrides?: Map<string, ActionOverride>,
  ) => {
    if (!lastExtractionResult || !user) return;

    try {
      const summary = await scheduleExtractedActions(
        lastExtractionResult.meetingId,
        user.id,
        actionIds,
        overrides,
      );

      if (summary.scheduled === 0) {
        toast.error(
          summary.total === 0
            ? 'There are no next steps to schedule yet.'
            : 'Nothing could be added to my diary — please try again.',
        );
      } else {
        recordAction(SURFACES.commit, 'scheduled', {
          value: summary.scheduled,
          data: { scheduled: summary.scheduled, total: summary.total },
        });
        setCommitSummary(summary);
        const peopleNote =
          summary.notified > 0
            ? ` · ${summary.notified} ${summary.notified === 1 ? 'person' : 'people'} told`
            : '';
        toast.success(
          `${summary.scheduled} of ${summary.total} in my diary${peopleNote}`,
        );
        if (summary.notifyFailures.length > 0) {
          toast.warning(
            `Couldn't reach: ${summary.notifyFailures.join(', ')}`,
          );
        }
      }
      setShowPostExtractionDialog(false);

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

      recordAction(SURFACES.memoryBridge, 'extracted', {
        value: result.actionsCount || 0,
        data: { actions: result.actionsCount || 0 },
      });

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
        {/* Import from a document (schedule, discharge letter, care plan, notes) */}
        <DocumentImportCard
          onExtracted={(res: DocumentImportResult) => {
            setLastExtractionResult({
              meetingId: res.meetingId,
              recordingId: '',
              actionsCount: res.actionsCount,
              title: res.title,
              sourceFilePath: res.filePath,
              sourceFileName: res.fileName,
            });
            fetchRecordings();
            setShowPostExtractionDialog(true);
          }}
        />

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
                <p className="mt-2 text-xs text-launch-ink/60">
                  {outOfAllowance
                    ? `You've used your ${allowance.period === 'week' ? 'weekly' : 'monthly'} recording time.`
                    : `You can record up to ${formatMinutes(allowance.limits.perRecordingMinutes)} in one go — ${formatMinutes(allowance.remainingMinutes)} left this ${allowance.period}.`}
                </p>
                {outOfAllowance && nextTierKey && (
                  <p className="mt-1 text-xs text-launch-ember">
                    {RECORDING_LIMITS[nextTierKey].label} gives you{' '}
                    {formatMinutes(RECORDING_LIMITS[nextTierKey].perRecordingMinutes)} per recording and{' '}
                    {formatMinutes(RECORDING_LIMITS[nextTierKey].monthlyMinutes)} a month.
                  </p>
                )}

                <RecordingEggTimer className="mt-5 text-left" />
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
                  "mb-2",
                  state === 'recording'
                    ? "bg-launch-ember/10 text-launch-ember border-launch-ember/30"
                    : "bg-launch-gold/10 text-launch-gold border-launch-gold/30"
                )}>
                  {state === 'recording' ? '● Recording...' : '❚❚ Paused'}
                </Badge>

                <div className="mb-2 flex justify-center">
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium',
                      remainingSessionSeconds <= 60
                        ? 'bg-launch-ember/10 text-launch-ember'
                        : remainingSessionSeconds <= 300
                        ? 'bg-launch-gold/15 text-launch-gold'
                        : 'bg-launch-ink/5 text-launch-ink/60'
                    )}
                    aria-live="polite"
                  >
                    {formatClock(remainingSessionSeconds)} remaining (this recording)
                  </span>
                </div>

                <MicLevelMeter state={micLevel} paused={state === 'paused'} className="mb-3" />

                <p className={cn(
                  "text-xs mb-4",
                  recordedBytes > 0 ? "text-launch-ink/60" : "text-launch-ember"
                )} role="status" aria-live="polite">
                  {recordedBytes > 0
                    ? `Audio captured: ${formatBytes(recordedBytes)}`
                    : 'No audio captured yet — check your microphone is on'}
                </p>



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
                <Badge className="mb-4 bg-launch-gold/10 text-launch-gold border-launch-gold/30">{formatDuration(restoredDuration ?? duration)}</Badge>

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

                {(isProcessing || isExtracting) && (
                  <p className="mt-3 text-sm text-launch-ink/70 max-w-xs mx-auto" role="status" aria-live="polite">
                    This can take a minute on a phone. Your recording is safe — you can leave this
                    screen and come back, it'll be waiting in your captures.
                  </p>
                )}
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

      {/* Review & edit everything before it reaches my diary */}
      <ReviewStep
        isOpen={showPostExtractionDialog}
        onClose={() => setShowPostExtractionDialog(false)}
        meetingId={lastExtractionResult?.meetingId}
        meetingTitle={lastExtractionResult?.title || ''}
        sourceFilePath={lastExtractionResult?.sourceFilePath}
        sourceFileName={lastExtractionResult?.sourceFileName}
        onCommit={(actionIds, overrides) => handleAcceptAndScheduleAll(actionIds, overrides)}
      />

      {/* Celebration Modal */}
      <CompletionCelebration
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        actionTitle={
          lastExtractionResult?.actionsCount
            ? `${lastExtractionResult.actionsCount} ${lastExtractionResult.actionsCount === 1 ? 'action' : 'actions'} scheduled`
            : "Recording saved — my transcript and summary are ready"
        }
        onNotifySupport={notifySupport ? () => console.log('Notifying support') : undefined}
        streakCount={3}
      />

      <CommitSummarySheet summary={commitSummary} onClose={() => setCommitSummary(null)} />

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
