import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import {
  saveActs, getSampleActs, saveTranscript, smartReminderDefaults,
  isBypassAuth, applyContextDefaults, saveContextId, type PrototypeAct,
} from '@/prototype/prototypeStore';
import { Mic, Square, AlertTriangle, Pause, Play, Loader2, PlayCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Minimal typing for Web Speech API.
type AnySpeechRecognition = any;

export default function PrototypeCapture() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const bypass = isBypassAuth();

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [partial, setPartial] = useState('');
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const recogRef = useRef<AnySpeechRecognition | null>(null);
  const finalRef = useRef<string>('');
  const pausedRef = useRef<boolean>(false);
  const recordingRef = useRef<boolean>(false);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try { recogRef.current?.stop(); } catch {}
  }, []);

  const supportsSpeech = typeof window !== 'undefined' &&
    (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));

  const buildRecogniser = (): AnySpeechRecognition => {
    const Ctor: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recog: AnySpeechRecognition = new Ctor();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = navigator.language || 'en-US';

    recog.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalRef.current += res[0].transcript + ' ';
        } else {
          interim += res[0].transcript;
        }
      }
      setTranscript(finalRef.current);
      setPartial(interim);
    };
    recog.onerror = (e: any) => {
      console.error('Speech error', e);
      if (e.error === 'not-allowed') setError('Microphone permission was denied.');
      else if (e.error !== 'no-speech') setError(`Transcription error: ${e.error}`);
    };
    recog.onend = () => {
      // Auto-restart only if actively recording and not paused.
      if (recordingRef.current && !pausedRef.current) {
        try { recog.start(); } catch {}
      }
    };
    return recog;
  };

  const startRecording = async () => {
    setError(null);
    if (!supportsSpeech) {
      setError('Your browser does not support live transcription. Try Chrome or Edge — or use the sample meeting.');
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError('Microphone permission was denied. Enable it in browser settings, or use the sample meeting.');
      return;
    }

    const recog = buildRecogniser();
    recogRef.current = recog;
    finalRef.current = '';
    pausedRef.current = false;
    recordingRef.current = true;
    setTranscript(''); setPartial('');
    setElapsed(0);
    setIsPaused(false);
    setIsRecording(true);
    timerRef.current = window.setInterval(() => setElapsed(e => e + 1), 1000);
    try { recog.start(); } catch (e) { console.error(e); }
  };

  const pauseRecording = () => {
    pausedRef.current = true;
    setIsPaused(true);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    try { recogRef.current?.stop(); } catch {}
  };

  const resumeRecording = () => {
    pausedRef.current = false;
    setIsPaused(false);
    timerRef.current = window.setInterval(() => setElapsed(e => e + 1), 1000);
    // Recogniser may have ended — rebuild if needed.
    try {
      recogRef.current?.start();
    } catch {
      const recog = buildRecogniser();
      recogRef.current = recog;
      try { recog.start(); } catch (e) { console.error(e); }
    }
  };

  const stopAndProcess = async () => {
    recordingRef.current = false;
    pausedRef.current = false;
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    try { recogRef.current?.stop(); } catch {}

    const fullTranscript = (finalRef.current + ' ' + partial).trim();
    setPartial('');
    saveTranscript(fullTranscript);

    if (fullTranscript.length < 5) {
      setError("I didn't catch anything. Try again, or use the sample meeting below.");
      return;
    }

    setProcessing(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('prototype-extract-acts', {
        body: { transcript: fullTranscript },
      });
      if (fnErr) throw fnErr;
      const rawActs = (data?.acts || []) as any[];
      if (rawActs.length === 0) {
        toast.warning("I heard you, but couldn't find any actions. Try being more specific.");
        setProcessing(false);
        return;
      }
      const detectedContext = (data?.contextId as any) || 'general';
      const acts: PrototypeAct[] = rawActs.map((a) => {
        const act: PrototypeAct = {
          id: crypto.randomUUID(),
          text: a.text || 'Untitled action',
          assignee: a.assignee || 'me',
          dueContext: a.dueContext || 'unspecified',
          priority: (a.priority as any) || 'medium',
          confidence: typeof a.confidence === 'number' ? a.confidence : 0.7,
          attendees: Array.isArray(a.attendees) ? a.attendees : [],
          proposedDate: a.proposedDate || undefined,
          proposedTime: a.proposedTime || undefined,
          actType: a.actType || undefined,
          clinician: a.clinician || undefined,
          status: 'pending',
        };
        const shaped = applyContextDefaults(act, detectedContext);
        shaped.reminders = smartReminderDefaults(shaped);
        return shaped;
      });
      saveContextId(detectedContext);
      saveActs(acts);
      navigate('/prototype/review');
    } catch (e: any) {
      console.error(e);
      setError(`Extraction failed: ${e?.message || e}. Try the sample meeting.`);
      setProcessing(false);
    }
  };

  const useSample = () => {
    saveActs(getSampleActs());
    navigate('/prototype/review');
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  const needsLogin = !bypass && !user;

  return (
    <PrototypeLayout
      title="Capture the conversation"
      subtitle="Press record. Your assistant listens, then extracts every action, commitment, and follow-up."
    >
      {needsLogin && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <div className="font-medium text-slate-900">Sign in to record</div>
            <div className="text-slate-600 mt-0.5 leading-relaxed">
              Real recording works best signed in. Or flip the <strong>bypass</strong> toggle at the top to demo with sample data — no login.
            </div>
            <button
              onClick={() => navigate('/auth?next=/prototype/capture')}
              className="mt-2 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              Sign in →
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="flex flex-col items-center">
          {/* Status indicator (non-interactive) */}
          <div className="relative mb-6" aria-hidden="true">
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-colors ${
                isPaused
                  ? 'bg-slate-100 text-slate-500 border border-slate-200'
                  : isRecording
                    ? 'bg-slate-900 text-white animate-pulse'
                    : 'bg-slate-50 text-slate-400 border border-slate-200'
              }`}
            >
              {isPaused ? <Pause className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
            </div>
          </div>

          <div className="text-2xl font-mono font-semibold text-slate-900 tabular-nums">{mm}:{ss}</div>
          <div className="text-sm text-slate-500 mt-1 min-h-[20px]">
            {processing ? 'extracting actions…'
              : isPaused ? 'paused — transcript is safe'
              : isRecording ? 'listening — catching every action'
              : 'tap start to begin'}
          </div>

          {/* Controls */}
          <div className="mt-6 w-full flex flex-col sm:flex-row gap-3 justify-center">
            {processing ? (
              <div className="inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-xl bg-slate-100 text-slate-600 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting actions…
              </div>
            ) : !isRecording ? (
              <button
                onClick={startRecording}
                aria-label="Start recording"
                className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
              >
                <Mic className="w-4 h-4" />
                Start recording
              </button>
            ) : (
              <>
                {isPaused ? (
                  <button
                    onClick={resumeRecording}
                    aria-label="Resume recording"
                    className="inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Resume
                  </button>
                ) : (
                  <button
                    onClick={pauseRecording}
                    aria-label="Pause recording"
                    className="inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-medium transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                )}
                <button
                  onClick={stopAndProcess}
                  aria-label="Stop recording and extract actions"
                  className="inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
                >
                  <Square className="w-4 h-4" />
                  Stop & extract
                </button>
              </>
            )}
          </div>

          {(transcript || partial) && (
            <div className="mt-6 w-full max-h-48 overflow-y-auto rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700 leading-relaxed">
              <span>{transcript}</span>
              <span className="text-slate-400 italic">{partial}</span>
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600 text-center">{error}</div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <PlayCircle className="w-[18px] h-[18px] text-slate-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium text-slate-900 text-sm">Skip the recording</div>
            <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              See the full flow in 30 seconds with a sample meeting.
            </div>
            <button
              onClick={useSample}
              className="mt-3 min-h-[44px] px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium"
            >
              Try a sample meeting →
            </button>
          </div>
        </div>
      </div>
    </PrototypeLayout>
  );
}
