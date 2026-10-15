import React, { useState, useEffect, useRef, useCallback } from 'react';
import { recordAction, SURFACES } from '@/lib/evidence/track';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { Button } from '@/components/ui/button';
import { SourceRefLine } from '@/components/traceability/SourceRefLine';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { CompletionCelebration } from '@/components/launch/CompletionCelebration';
import { Mic, Square, Play, Pause, Save, Users, Clock, Loader2, Brain, Eye, Volume2, VolumeX, CheckCircle, Upload, Trash2, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversationDisclosure } from '@/hooks/memoryBridge/useConversationDisclosure';
import { LaunchConversationLibrary } from '@/components/memoryBridge/LaunchConversationLibrary';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ensureSession, touchSession } from '@/utils/ensureSession';

import { formatDistanceToNow, format } from 'date-fns';
import { processSavedRecording } from '@/utils/processSavedRecording';
import { RecordingPlayer } from '@/components/memoryBridge/RecordingPlayer';
import { stopPlayback } from '@/hooks/useAudioPlayer';

import { ActionsViewer } from '@/components/memoryBridge/ActionsViewer';
import { ReviewStep } from '@/components/memoryBridge/review/ReviewStep';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
import { uploadRecordingFile, isSupportedRecordingFile } from '@/utils/uploadRecordingFile';
import { CaptureHub } from '@/components/memoryBridge/CaptureHub';
import { OutputModeChooser } from '@/components/memoryBridge/OutputModeChooser';
import { TranscriptView } from '@/components/memoryBridge/TranscriptView';
import { useOutputMode, OUTPUT_MODE_LABELS } from '@/lib/memoryBridge/outputMode';

import { setRecordingLive } from '@/launch/capture/recordingSignal';
import { useCapturePreferences } from '@/hooks/useCapturePreferences';
import { useQuietEnd } from '@/hooks/memoryBridge/useQuietEnd';
import { publishCaptureStatus, registerCaptureStopHandler } from '@/launch/capture/captureStatus';
import {
  assembleCaptureSession,
  deleteCaptureSession,
  listRecoverableSessions,
} from '@/utils/captureSegments';


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
  reference_code?: string | null;
}

export default function LaunchMemoryBridge() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const conversationDetails = useConversationDisclosure(user?.id);
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState<RecordingState>('idle');
  const [showCelebration, setShowCelebration] = useState(false);
  const [notifySupport, setNotifySupport] = useState(false);
  const [supportOptionsOpen, setSupportOptionsOpen] = useState(false);
  const [outputOptionsOpen, setOutputOptionsOpen] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState('');
  const [outputMode, setOutputMode] = useOutputMode();
  const [transcriptFor, setTranscriptFor] = useState<{ meetingId: string; title: string } | null>(null);
  const openTranscriptForRecording = async (recordingId: string, title: string) => {
    const { data } = await supabase
      .from('meeting_recordings')
      .select('id')
      .eq('recording_id', recordingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data?.id) {
      toast.info('No transcript yet for this recording.', { description: 'Tap "Find my next steps" to write it up.' });
      return;
    }
    setTranscriptFor({ meetingId: data.id, title });
  };
  const audioBlobRef = useRef<Blob | null>(null);
  const [restoredDuration, setRestoredDuration] = useState<number | null>(null);
  const [recoverableCapture, setRecoverableCapture] = useState<Awaited<ReturnType<typeof assembleCaptureSession>>>(null);
  const [quietFinishRequested, setQuietFinishRequested] = useState(false);

  const [loopCircleIds, setLoopCircleIds] = useState<string[]>([]);
  const [loopAdhoc, setLoopAdhoc] = useState<AdhocLoopIn[]>([]);

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processedRecordings, setProcessedRecordings] = useState<Set<string>>(new Set());
  const [actionsCountMap, setActionsCountMap] = useState<Record<string, number>>({});
  const [viewingActions, setViewingActions] = useState<{ recordingId: string; title: string } | null>(null);
  const [recordingToDelete, setRecordingToDelete] = useState<VoiceRecording | null>(null);
  const [confirmDiscardCapture, setConfirmDiscardCapture] = useState(false);
  const [deletingRecording, setDeletingRecording] = useState(false);

  
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
  const [isUploading, setIsUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [commitSummary, setCommitSummary] = useState<MeetingScheduleSummary | null>(null);

  const {
    isRecording,
    isPaused,
    isProcessing,
    recordings,
    recordingsLoading,
    recordingsFailed,
    duration,
    recordedBytes,
    mediaStream,
    isStarting,
    micPermission,
    micBlockReason,
    refreshMicStatus,
    startRecording,

    pauseRecording,
    resumeRecording,
    stopRecording,
    saveRecording,
    fetchRecordings,
    getRecordingUrl,
    deleteRecording,
    formatDuration
  } = useVoiceRecorder();

  const { prefs: capturePrefs } = useCapturePreferences();
  const micLevel = useMicLevel(mediaStream, isRecording && !isPaused);
  const allowance = useRecordingAllowance();
  const sessionCapSeconds = allowance.limits.perRecordingMinutes * 60;
  const remainingSessionSeconds = Math.max(0, sessionCapSeconds - duration);
  const outOfAllowance = allowance.remainingMinutes <= 0;
  const nextTierKey = NEXT_TIER[allowance.tier];
  const { promptOpen: quietPromptOpen, secondsLeft: quietSecondsLeft, keepGoing, finishNow: finishQuietly } = useQuietEnd({
    active: isRecording && !isPaused,
    silentSeconds: micLevel.silentSeconds,
    quietMinutes: capturePrefs.autoFinishEnabled ? capturePrefs.quietFinishMinutes : null,
    onFinish: () => setQuietFinishRequested(true),
  });

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  // Restore a recording that was captured but never saved (page reload,
  // phone backgrounding the tab, auth refresh).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pending = await loadPendingRecording();
      if (cancelled || !pending || audioBlobRef.current) return;
      audioBlobRef.current = pending.blob;
      setRestoredDuration(pending.duration);
      setRecordingTitle(prev => prev || pending.title);
      setState(prev => (prev === 'idle' ? 'reviewing' : prev));
      toast.info('We recovered your last recording — it\'s ready to save.');
    })();
    return () => { cancelled = true; };
  }, []);

  // If the tab closed before Save, offer the segments already safe on this
  // device. Nothing is uploaded or shared until I choose to continue.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sessions = await listRecoverableSessions();
      const candidate = sessions.find((session) => !session.finished);
      if (cancelled || !candidate) return;
      const assembled = await assembleCaptureSession(candidate.id);
      if (!cancelled && assembled) setRecoverableCapture(assembled);
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
      stopPlayback();
    };
  }, []);

  // Let the persistent capture button anywhere in the app show "Recording".
  useEffect(() => {
    setRecordingLive(isRecording);
    return () => setRecordingLive(false);
  }, [isRecording]);


  const handleStartRecording = useCallback(async () => {
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
    } else {
      // startRecording's own paths each toast + log; this catches anything
      // unexpected so a tap can never vanish silently.
      console.warn('handleStartRecording: startRecording returned false without a state change');
    }
  }, [outOfAllowance, nextTierKey, allowance.period, startRecording, setRecordingTitle]);

  // Two-tap capture: arriving with ?record=1 starts recording immediately.
  // One attempt only — a blocked mic must never retry in a loop.
  const autoStartedRef = useRef(false);
  const recorderCardRef = useRef<HTMLDivElement | null>(null);
  const recordsRef = useRef<HTMLDivElement | null>(null);
  const [requestedConversationId, setRequestedConversationId] = useState<string | null>(null);
  useEffect(() => {
    const wants = searchParams.get('record') === '1' || searchParams.get('quick') === '1';
    if (!wants || autoStartedRef.current) return;
    autoStartedRef.current = true;
    const next = new URLSearchParams(searchParams);
    next.delete('record');
    next.delete('quick');
    setSearchParams(next, { replace: true });
    if (isRecording || state === 'reviewing' || audioBlobRef.current) return;
    void handleStartRecording().then(() => {
      recorderCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Two-tap recall: ?open=<recordingId> opens that conversation's record.
  const autoOpenedRef = useRef(false);
  useEffect(() => {
    const openId = searchParams.get('open');
    if (!openId || autoOpenedRef.current) return;
    if (recordingsLoading || recordingsFailed) return;
    autoOpenedRef.current = true;
    const match = recordings.find(r => r.id === openId);
    const next = new URLSearchParams(searchParams);
    next.delete('open');
    setSearchParams(next, { replace: true });
    if (!match) { toast.info('This conversation is not in the loaded library.'); return; }
    setRequestedConversationId(match.id);
    conversationDetails.setOpen(match.id, true);
    setViewingActions({ recordingId: match.id, title: match.title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, recordings, recordingsLoading, recordingsFailed]);

  const handlePauseRecording = () => {
    pauseRecording();
    setState('paused');
  };

  const handleResumeRecording = () => {
    resumeRecording();
    setState('recording');
  };

  const handleStopRecording = useCallback(async () => {
    const blob = await stopRecording();
    if (!blob || blob.size === 0) {
      // stopRecording already explained the empty capture.
      setState('idle');
      return;
    }
    audioBlobRef.current = blob;
    setRestoredDuration(null);
    setRecoverableCapture(null);
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
  }, [duration, recordingTitle, stopRecording]);

  // The safety-net prompt finishes through the same save path as a normal Stop.
  useEffect(() => {
    if (!quietFinishRequested || !isRecording) return;
    setQuietFinishRequested(false);
    void handleStopRecording();
  }, [quietFinishRequested, isRecording, handleStopRecording]);

  // Publish a small, global status so I always know the app is listening and
  // can return to or stop the capture from another signed-in page.
  useEffect(() => {
    publishCaptureStatus({
      active: isRecording,
      paused: isPaused,
      seconds: duration,
      level: micLevel.level,
      title: recordingTitle || 'My conversation',
    });
    setRecordingLive(isRecording);
    registerCaptureStopHandler(isRecording ? () => void handleStopRecording() : null);
    return () => {
      registerCaptureStopHandler(null);
      if (!isRecording) publishCaptureStatus({ active: false, paused: false, seconds: 0, level: 0, title: null });
    };
  }, [isRecording, isPaused, duration, micLevel.level, recordingTitle, handleStopRecording]);

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
    if (isExtracting) {
      console.log('handleSave: ignored — a save is already running');
      return;
    }
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
    const title = recordingTitle || `Conversation · ${format(new Date(), 'd MMM, HH:mm')}`;


    try {
      console.log('handleSave: stage 1 — uploading audio', {
        bytes: audioBlobRef.current.size,
        type: audioBlobRef.current.type,
      });
      const saved = await saveRecording(
        audioBlobRef.current,
        title,
        'memory-bridge',
        undefined,
        notifySupport,
        userId
      );

      if (!saved) {
        console.warn('handleSave: stage 1 failed — upload/insert returned nothing');
        toast.error("Couldn't upload that recording.", {
          description: 'Your audio is still here — check your connection and tap Save again.',
          duration: 10000,
        });
        return;
      }
      console.log('handleSave: stage 2 — recording row saved', saved.id);

      audioBlobRef.current = null;
      await clearPendingRecording();
      if (recoverableCapture?.meta.id) await deleteCaptureSession(recoverableCapture.meta.id);
      setRecoverableCapture(null);
      allowance.refresh();
      setRequestedConversationId(saved.id);

      // Automatically start extraction
      console.log('handleSave: stage 3 — starting extraction');
      const result = await processSavedRecording(
        saved.id,
        userId,
        restoredDuration ?? duration,
        undefined,
        outputMode
      );

      if (result.success && (outputMode === 'none' || outputMode === 'transcript')) {
        setProcessedRecordings(prev => new Set([...prev, saved.id]));
        setActionsCountMap(prev => ({ ...prev, [saved.id]: 0 }));
        if (outputMode === 'transcript' && result.meetingId) {
          toast.success('Recording saved — my transcript is ready.');
          setTranscriptFor({ meetingId: result.meetingId, title });
        } else {
          toast.success('Recording saved.', { description: 'I can ask for a transcript or actions any time from My Records.' });
        }
        fetchRecordings();
        setState('idle');
        setRecordingTitle('');
        return;
      }
      console.log('handleSave: stage 4 — extraction finished', result);



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
          meetingId: result.meetingId,
          recordingId: saved.id,
          actionsCount: result.actionsCount,
          title
        });
        setShowPostExtractionDialog(true);
        setProcessedRecordings(prev => new Set([...prev, saved.id]));
        setActionsCountMap(prev => ({ ...prev, [saved.id]: result.actionsCount }));
        setLoopCircleIds([]);
        setLoopAdhoc([]);
      } else if (result.success) {
        // Saved and transcribed, but nothing actionable was found. Never dead-end
        // on a "0 actions" toast — open the review surface with the transcript so
        // I can extract again or add my own next step.
        setProcessedRecordings(prev => new Set([...prev, saved.id]));
        setActionsCountMap(prev => ({ ...prev, [saved.id]: 0 }));
        setViewingActions({ recordingId: saved.id, title });
        toast.info('Recording saved — no next steps found yet.', {
          description: 'Open the transcript to extract again or add your own step.',
          duration: 8000,
        });
      }
      // On failure, processSavedRecording already shows a toast — nothing else to do.


      fetchRecordings();
      setState('idle');
      setRecordingTitle('');
    } catch (err) {
      console.error('handleSave: unexpected error', err);
      const stillSignedIn = await ensureSession();
      if (!stillSignedIn) {
        toast.error('Your session expired during extraction.', {
          description: 'Sign in again, then tap "Extract actions" on this recording in Recent Recordings.',
          duration: 12000,
        });
      } else {
        toast.error(
          `Could not save recording: ${err instanceof Error ? err.message : 'Unknown error'}`
        );
      }
    } finally {
      setIsExtracting(false);
    }

  };

  /** Upload an existing audio/video file and run the same extraction path. */
  const handleUploadSelected = async (file: File | null | undefined) => {
    if (!file) return;
    if (!isSupportedRecordingFile(file)) {
      toast.error('That file type is not supported.', {
        description: 'Choose an audio or video recording (m4a, mp3, wav, webm, mp4).',
      });
      return;
    }

    const userId = await ensureSession();
    if (!userId) {
      toast.error('Your session timed out.', {
        description: 'Sign in and upload again.',
        action: {
          label: 'Sign in',
          onClick: () => navigate(`/auth?redirect=${encodeURIComponent('/launch/memory')}`),
        },
        duration: 12000,
      });
      return;
    }

    const title = recordingTitle || file.name.replace(/\.[^.]+$/, '');
    setIsUploading(true);
    setIsExtracting(true);
    try {
      toast.info('Uploading your recording…');
      const saved = await uploadRecordingFile(file, userId, title);
      allowance.refresh();

      const result = await processSavedRecording(saved.id, userId, saved.durationSeconds);

      if (result.success && result.actionsCount && result.actionsCount > 0) {
        if (result.meetingId && (loopCircleIds.length > 0 || loopAdhoc.length > 0)) {
          await supabase
            .from('extracted_actions')
            .update({
              assigned_watchers: loopCircleIds,
              adhoc_loop_ins: loopAdhoc as any,
            })
            .eq('meeting_recording_id', result.meetingId);
        }
        setLastExtractionResult({
          meetingId: result.meetingId,
          recordingId: saved.id,
          actionsCount: result.actionsCount,
          title,
        });
        setShowPostExtractionDialog(true);
        setProcessedRecordings(prev => new Set([...prev, saved.id]));
        setActionsCountMap(prev => ({ ...prev, [saved.id]: result.actionsCount }));
        setLoopCircleIds([]);
        setLoopAdhoc([]);
      } else if (result.success) {
        setProcessedRecordings(prev => new Set([...prev, saved.id]));
        setActionsCountMap(prev => ({ ...prev, [saved.id]: 0 }));
        setViewingActions({ recordingId: saved.id, title });
        toast.info('Upload saved — no next steps found yet.', {
          description: 'Open the transcript to extract again or add your own step.',
          duration: 8000,
        });
      }

      fetchRecordings();
      setRecordingTitle('');
    } catch (err) {
      console.error('handleUploadSelected failed', err);
      toast.error(
        `Could not upload that recording: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    } finally {
      setIsUploading(false);
      setIsExtracting(false);
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };


  const handleAcceptAndScheduleAll = async (
    actionIds?: string[],
    overrides?: Map<string, ActionOverride>,
  ) => {
    if (!lastExtractionResult) return;

    const userId = await ensureSession();
    if (!userId) {
      toast.error('Your session timed out — nothing was lost.', {
        description: 'Sign in again and schedule these steps from Recent Recordings.',
        action: {
          label: 'Sign in',
          onClick: () => navigate(`/auth?redirect=${encodeURIComponent('/launch/memory')}`),
        },
        duration: 12000,
      });
      throw new Error('Sign in again to add these steps.');
    }

    try {
      const summary = await scheduleExtractedActions(
        lastExtractionResult.meetingId,
        userId,
        actionIds,
        overrides,
      );


      if (summary.scheduled === 0) {
        toast.error(
          summary.total === 0
            ? 'There are no next steps to schedule yet.'
            : 'Nothing could be added to my diary — please try again.',
        );
        throw new Error('No steps were added. Please try again.');
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
      throw error;
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

  // Playback is handled by the shared <RecordingPlayer /> (see useAudioPlayer).


  const handleProcessRecording = async (recording: VoiceRecording) => {
    if (!user) return;

    setProcessingId(recording.id);
    
    const result = await processSavedRecording(
      recording.id,
      user.id,
      recording.duration_seconds || 0,
      undefined,
      'both'
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

  const handleDeleteRecording = async () => {
    if (!recordingToDelete) return;
    setDeletingRecording(true);
    try {
      await deleteRecording(recordingToDelete.id);
      setRecordingToDelete(null);
      toast.success('Recording, transcript and extracted steps deleted.');
    } catch (error) {
      console.error('Failed to delete recording:', error);
      toast.error(error instanceof Error ? error.message : 'I could not delete that recording. Nothing else was changed.');
    } finally {
      setDeletingRecording(false);
    }
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
      

      <div className="max-w-5xl mx-auto py-4 md:py-8 pb-24 font-worksans text-launch-ink-deep">
        {/* Import from a document (schedule, discharge letter, care plan, notes) */}
        {recoverableCapture && (
          <LaunchCard className="mb-6 border-launch-gold/40 bg-launch-gold/10 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-launch-gold/20 p-2">
                <History className="h-5 w-5 text-launch-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-launch-ink">I found a conversation that was safely kept on this device.</p>
                <p className="mt-1 text-base text-launch-ink/70">
                  {formatDuration(recoverableCapture.meta.duration)} captured · not uploaded or shared yet
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      audioBlobRef.current = recoverableCapture.blob;
                      setRestoredDuration(recoverableCapture.meta.duration);
                      setRecordingTitle(recoverableCapture.meta.title);
                      setState('reviewing');
                    }}
                  >
                    Continue with this recording
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDiscardCapture(true)}
                  >
                    Discard it
                  </Button>
                </div>
              </div>
            </div>
          </LaunchCard>
        )}

        {/* Gentle safety-net pause before a long quiet stretch is auto-saved. */}
        <AlertDialog open={quietPromptOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>It has been quiet for a while</AlertDialogTitle>
              <AlertDialogDescription>
                I can keep listening, or I can safely stop and place what I have captured ready to save. I will stop the capture in {quietSecondsLeft} seconds if I do not choose.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={keepGoing}>Keep listening</AlertDialogCancel>
              <AlertDialogAction onClick={finishQuietly}>Stop and save</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Recording Interface */}
        {state === 'idle' ? (
          <CaptureHub
            onStartCapture={handleStartRecording}
            onOpenMyRecords={() => recordsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            onUploadClick={() => uploadInputRef.current?.click()}
            isStarting={isStarting}
            isUploading={isUploading}
            isExtracting={isExtracting}
            micPermission={micPermission}
            micBlockReason={micBlockReason}
            refreshMicStatus={refreshMicStatus}
            outOfAllowance={outOfAllowance}
            allowance={allowance}
            nextTierInfo={
              nextTierKey
                ? {
                    label: RECORDING_LIMITS[nextTierKey].label,
                    perRecordingMinutes: RECORDING_LIMITS[nextTierKey].perRecordingMinutes,
                    monthlyMinutes: RECORDING_LIMITS[nextTierKey].monthlyMinutes,
                  }
                : null
            }
          >
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
          </CaptureHub>
        ) : (
          <LaunchCard className="relative overflow-hidden rounded-md bg-launch-ivory border-launch-gold/30 mb-8 text-center py-8 px-4 md:px-8">

            <div className="relative z-10" ref={recorderCardRef}>
              {(state === 'recording' || state === 'paused') && (
                <>
                  <div className="w-16 h-16 mx-auto mb-5 rounded-md bg-launch-teal/10 flex items-center justify-center">
                    {state === 'recording' ? <Mic className="h-8 w-8 text-launch-teal" /> : <Pause className="h-8 w-8 text-launch-teal" />}
                  </div>
                  <p className="text-3xl font-bold text-launch-ink mb-1 font-worksans">{formatDuration(duration)}</p>
                  <Badge className={cn(
                    "mb-2",
                    state === 'recording'
                      ? "bg-launch-ember/10 text-launch-ember border-launch-ember/30"
                      : "bg-launch-gold/10 text-launch-gold border-launch-gold/30"
                  )}>
                    {state === 'recording' ? <><Mic className="h-4 w-4 mr-2" />Recording</> : <><Pause className="h-4 w-4 mr-2" />Paused</>}
                  </Badge>

                  <div className="mb-2 flex justify-center">
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-base font-medium',
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
                    "text-base mb-4",
                    recordedBytes > 0 ? "text-launch-ink/60" : "text-launch-ember"
                  )} role="status" aria-live="polite">
                    {recordedBytes > 0
                      ? `Audio captured: ${formatBytes(recordedBytes)}`
                      : 'No audio captured yet — check your microphone is on'}
                  </p>



                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {state === 'recording' ? (
                      <Button onClick={handlePauseRecording} variant="outline" className="min-h-14 rounded-md border-launch-gold/30 text-launch-ink hover:bg-launch-gold/10">
                        <Pause className="h-5 w-5" />
                        Pause
                      </Button>
                    ) : (
                      <Button onClick={handleResumeRecording} variant="outline" className="min-h-14 rounded-md border-launch-gold/30 text-launch-ink hover:bg-launch-gold/10">
                        <Play className="h-5 w-5" />
                        Continue
                      </Button>
                    )}
                    <Button onClick={handleStopRecording} variant="action" className="min-h-14 rounded-md">
                      <Square className="h-5 w-5" />
                      Stop
                    </Button>
                  </div>
                </>
              )}

              {state === 'reviewing' && (
                <>
                  <div className="w-28 h-28 mx-auto mb-4 bg-launch-moss/10 rounded-full flex items-center justify-center border border-launch-moss/20">
                    <Play className="h-12 w-12 text-launch-moss ml-1" />
                  </div>
                  <p className="text-lg font-semibold text-launch-ink mb-1">My recording is ready to save</p>
                  
                  <Badge className="mb-4 bg-launch-gold/10 text-launch-gold border-launch-gold/30">{formatDuration(restoredDuration ?? duration)}</Badge>

                  <label htmlFor="mb-title" className="block text-base font-medium text-launch-ink/60 mb-1.5">Name for this conversation (optional)</label>
                  <input
                    id="mb-title"
                    type="text"
                    value={recordingTitle}
                    onChange={(e) => setRecordingTitle(e.target.value)}
                    placeholder={`Conversation · ${format(new Date(), 'd MMM, HH:mm')}`}
                    className="w-full max-w-xs mx-auto mb-4 px-4 py-3 rounded-md border border-launch-gold/30 bg-launch-ivory text-launch-ink placeholder:text-launch-ink/40 focus:outline-none focus:ring-2 focus:ring-launch-gold/50 shadow-sm block"
                  />

                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Button variant="ghost"
                      onClick={() => setSupportOptionsOpen(!supportOptionsOpen)}
                      aria-expanded={supportOptionsOpen}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium transition-all",
                        notifySupport
                          ? "bg-launch-moss/10 text-launch-moss border border-launch-moss/30"
                          : "bg-launch-ivory text-launch-ink/70 border border-launch-gold/30"
                      )}
                    >
                      <Users className="h-4 w-4" />
                      Support Circle (optional)
                    </Button>
                  </div>

                  {supportOptionsOpen && <div className="max-w-xs mx-auto mb-4 text-left">
                    <label className="flex items-center gap-3 min-h-14 text-base"><input type="checkbox" checked={notifySupport} onChange={e => setNotifySupport(e.target.checked)} />Notify my Support Circle</label>
                    <p className="text-base font-medium text-launch-ink/60 mb-1.5 text-center">
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
                  </div>}

                  <div className="max-w-md mx-auto text-left mb-5">
                    <div className="flex items-center justify-between gap-3 border-y border-launch-gold/30 py-2">
                      <p className="text-base font-medium">{OUTPUT_MODE_LABELS[outputMode].title}</p>
                      <Button variant="ghost" className="min-h-14 text-base" aria-expanded={outputOptionsOpen} onClick={() => setOutputOptionsOpen(!outputOptionsOpen)}>{outputOptionsOpen ? 'Close choices' : 'Change'}</Button>
                    </div>
                    {outputMode === 'actions' && <p className="text-base mt-2">Only next steps will be kept; the transcript will not be saved.</p>}
                    {outputOptionsOpen && <OutputModeChooser value={outputMode} onChange={setOutputMode} className="mt-4" />}
                  </div>

                  <Button variant="action" onClick={handleSave} className="w-full max-w-md min-h-14 rounded-md whitespace-normal h-auto py-4" disabled={isProcessing || isExtracting}>
                    {isProcessing || isExtracting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {isExtracting ? 'Saved. Finding my next steps…' : 'Saving…'}
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        {outputMode === 'none' ? 'Save recording' : outputMode === 'transcript' ? 'Save and write my transcript' : 'Save and find my next steps'}
                      </>
                    )}
                  </Button>

                  {(isProcessing || isExtracting) && (
                    <p className="mt-3 text-base text-launch-ink/70 max-w-xs mx-auto" role="status" aria-live="polite">
                      This can take a minute on a phone. Your recording is safe — you can leave this
                      screen and come back, it'll be waiting in your captures.
                    </p>
                  )}

                  {!(isProcessing || isExtracting) && (
                    <Button variant="ghost"
                      type="button"
                      onClick={() => setConfirmDiscardCapture(true)}
                      className="mt-4 text-base font-medium text-launch-ink/60 underline underline-offset-4 hover:text-launch-ink"
                    >
                      Discard and record something new
                    </Button>
                  )}
                </>
              )}
            </div>
          </LaunchCard>
        )}

        {/* Hidden upload input */}
        <input
          ref={uploadInputRef}
          type="file"
          accept="audio/*,video/*,.m4a,.mp3,.wav,.webm,.mp4,.mov"
          className="hidden"
          onChange={(e) => handleUploadSelected(e.target.files?.[0])}
        />


        <div ref={recordsRef} className="scroll-mt-28">
          <LaunchConversationLibrary
            recordings={recordings}
            loading={recordingsLoading}
            failed={recordingsFailed}
            onRetry={() => void fetchRecordings()}
            requestedId={requestedConversationId}
            isOpen={conversationDetails.isOpen}
            setOpen={conversationDetails.setOpen}
            formatDuration={formatDuration}
            getStatus={recording => processingId === recording.id ? 'Finding my next steps…' : (actionsCountMap[recording.id] || 0) > 0 ? `${actionsCountMap[recording.id]} next ${actionsCountMap[recording.id] === 1 ? 'step' : 'steps'}` : 'Saved'}
            renderDetails={recording => {
              const isProcessed = processedRecordings.has(recording.id);
              const isCurrentlyProcessing = processingId === recording.id;
              const actionsCount = actionsCountMap[recording.id] || 0;
              return <>
                {'reference_code' in recording && typeof recording.reference_code === 'string' && <SourceRefLine referenceCode={recording.reference_code} className="text-base text-launch-ink" />}
                    {/* Secondary listening tools */}
                    <details><summary className="min-h-14 flex items-center text-base font-medium cursor-pointer">Listen to my recording</summary>
                    <RecordingPlayer
                      id={recording.id}
                      getUrl={() => getRecordingUrl(recording.file_path)}
                      fallbackDuration={recording.duration_seconds}
                      audioDeleted={Boolean((recording as { audio_deleted_at?: string | null }).audio_deleted_at)}
                    />

                    </details>
                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button variant="ghost"
                        type="button"
                        onClick={() => openTranscriptForRecording(recording.id, recording.title)}
                        className="flex min-h-[44px] items-center gap-1.5 px-4 py-2 rounded-md text-base font-medium border border-launch-gold/40 text-launch-ink hover:bg-launch-gold/10 transition-all"
                      >
                        Read transcript
                      </Button>


                      {isProcessed ? (
                        <Button variant="ghost"
                          onClick={() => handleViewActions(recording)}
                          className="flex min-h-14 items-center gap-1.5 px-4 py-2 rounded-md whitespace-normal h-auto text-base font-medium bg-launch-teal/10 text-launch-ink-deep hover:bg-launch-teal/20 border border-launch-teal/40 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                          {actionsCount > 0 ? 'Check my next steps' : 'Open my saved write-up'}
                        </Button>
                      ) : (
                        <Button variant="ghost"
                          onClick={() => handleProcessRecording(recording)}
                          disabled={isCurrentlyProcessing}
                          className={cn(
                            "flex min-h-14 items-center gap-1.5 px-4 py-2 rounded-md whitespace-normal h-auto text-base font-medium transition-all",
                            isCurrentlyProcessing
                              ? "bg-launch-ink/10 text-launch-ink/50 cursor-not-allowed"
                              : "bg-launch-teal/10 text-launch-ink-deep hover:bg-launch-teal/20 border border-launch-teal/40"
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
                              Find my next steps
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    <details><summary className="min-h-14 flex items-center text-base font-medium cursor-pointer">Share, download or remove</summary>
                    <div className="flex justify-end">
                      {!Boolean((recording as { legal_retention_required?: boolean }).legal_retention_required) && (
                        <Button variant="ghost"
                          type="button"
                          onClick={() => setRecordingToDelete(recording)}
                          className="flex min-h-[44px] items-center gap-1.5 rounded-md px-3 py-2 text-base font-medium text-launch-ink/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete recording
                        </Button>
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
                    </details>
              </>;
            }}
          />
        </div>
        <p className="text-base leading-relaxed text-launch-ink border-t border-launch-gold/30 pt-5">MyRhythm supports everyday planning and follow-through. It does not diagnose, treat or fix medical conditions.</p>
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

      <TranscriptView
        open={Boolean(transcriptFor)}
        onClose={() => setTranscriptFor(null)}
        meetingId={transcriptFor?.meetingId}
        title={transcriptFor?.title || ''}
        onActionsUpdated={() => fetchRecordings()}
      />

      <CommitSummarySheet summary={commitSummary} onClose={() => setCommitSummary(null)} onSeeDay={date => { setCommitSummary(null); navigate(`/launch/calendar?view=day&date=${encodeURIComponent(date)}`); }} />

      <AlertDialog open={Boolean(recordingToDelete)} onOpenChange={(open) => !open && setRecordingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this recording permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              “{recordingToDelete?.title || 'This recording'}” will be deleted with its audio, transcript and extracted steps. Any diary entries already created stay in my diary, but this source conversation will no longer be available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingRecording}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRecording}
              disabled={deletingRecording}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingRecording ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDiscardCapture} onOpenChange={setConfirmDiscardCapture}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard this recording?</AlertDialogTitle>
            <AlertDialogDescription>
              This recording has not been saved or shared yet. If you discard it, it will be permanently deleted and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (recoverableCapture?.meta.id) await deleteCaptureSession(recoverableCapture.meta.id);
                audioBlobRef.current = null;
                setRestoredDuration(null);
                await clearPendingRecording();
                setState('idle');
                setRecoverableCapture(null);
                setConfirmDiscardCapture(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Discard permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
