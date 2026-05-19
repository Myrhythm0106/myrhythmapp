import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import {
  saveActs, getSampleActs, saveTranscript, smartReminderDefaults,
  isBypassAuth, type PrototypeAct,
} from '@/prototype/prototypeStore';
import { Mic, Square, Sparkles, AlertTriangle } from 'lucide-react';
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
  const [elapsed, setElapsed] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [partial, setPartial] = useState('');
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const recogRef = useRef<AnySpeechRecognition | null>(null);
  const finalRef = useRef<string>('');

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try { recogRef.current?.stop(); } catch {}
  }, []);

  const supportsSpeech = typeof window !== 'undefined' &&
    (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));

  const startRecording = async () => {
    setError(null);
    if (!supportsSpeech) {
      setError('Your browser does not support live transcription. Try Chrome or Edge — or use the sample meeting.');
      return;
    }
    try {
      // Prompt mic permission first for a clearer UX.
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError('Microphone permission was denied. Enable it in browser settings, or use the sample meeting.');
      return;
    }

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
      // If we are still in "recording" state, the API auto-stopped; restart.
      if (isRecording) { try { recog.start(); } catch {} }
    };

    recogRef.current = recog;
    finalRef.current = '';
    setTranscript(''); setPartial('');
    setElapsed(0);
    setIsRecording(true);
    timerRef.current = window.setInterval(() => setElapsed(e => e + 1), 1000);
    try { recog.start(); } catch (e) { console.error(e); }
  };

  const stopAndProcess = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
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
          status: 'pending',
        };
        act.reminders = smartReminderDefaults(act);
        return act;
      });
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
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <div className="font-medium text-amber-900">Sign in to record</div>
            <div className="text-amber-800 mt-0.5">
              Real recording works best signed in. Or flip the <strong>Bypass</strong> toggle at the top to demo with sample data — no login.
            </div>
            <button
              onClick={() => navigate('/auth?next=/prototype/capture')}
              className="mt-2 px-3 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium"
            >
              Sign in →
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <div className={`relative mb-6 ${isRecording ? 'animate-pulse' : ''}`}>
            <button
              onClick={isRecording ? stopAndProcess : startRecording}
              disabled={processing}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/40'
                  : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/40'
              } disabled:opacity-50`}
            >
              {isRecording ? <Square className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>
            {isRecording && (
              <div className="absolute -inset-2 rounded-full border-4 border-red-300 animate-ping" />
            )}
          </div>

          <div className="text-2xl font-mono font-semibold text-slate-900">{mm}:{ss}</div>
          <div className="text-sm text-slate-500 mt-1">
            {processing ? 'Extracting actions…'
              : isRecording ? 'Listening — tap to finish'
              : 'Tap the mic to start recording'}
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

      <div className="mt-6 rounded-2xl bg-teal-50 border border-teal-200 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium text-teal-900 text-sm">Skip the recording</div>
            <div className="text-xs text-teal-700 mt-0.5">
              See the full flow in 30 seconds with a sample meeting.
            </div>
            <button
              onClick={useSample}
              className="mt-3 min-h-[44px] px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium"
            >
              Try a sample meeting →
            </button>
          </div>
        </div>
      </div>
    </PrototypeLayout>
  );
}
