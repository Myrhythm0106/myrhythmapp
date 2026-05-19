import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import { saveActs, getSampleActs } from '@/prototype/prototypeStore';
import { Mic, Square, Sparkles } from 'lucide-react';

export default function PrototypeCapture() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [processing, setProcessing] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setElapsed(0);
    timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
  };

  const stopAndProcess = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setProcessing(true);
    // Simulate AI extraction; the real pipeline uses
    // supabase/functions/extract-acts-incremental — reused in v2.
    setTimeout(() => {
      saveActs(getSampleActs());
      navigate('/prototype/review');
    }, 1400);
  };

  const useSample = () => {
    saveActs(getSampleActs());
    navigate('/prototype/review');
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <PrototypeLayout
      title="Capture the conversation"
      subtitle="Press record. Your assistant listens, then extracts every action, commitment, and follow-up."
    >
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
            {processing
              ? 'Extracting actions…'
              : isRecording
                ? 'Listening — tap to finish'
                : 'Tap the mic to start recording'}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-teal-50 border border-teal-200 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium text-teal-900 text-sm">Skip the recording</div>
            <div className="text-xs text-teal-700 mt-0.5">
              Try the assistant loop with a sample meeting — see the full flow in 30 seconds.
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
