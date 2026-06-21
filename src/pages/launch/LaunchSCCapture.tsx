import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ArrowLeft, Wifi, WifiOff, Hand, MousePointerClick } from 'lucide-react';
import { toast } from 'sonner';
import { RecipientHeader } from '@/components/launch/circle/RecipientHeader';
import { LiveTranscriptRibbon } from '@/components/launch/circle/LiveTranscriptRibbon';
import { SendConfirmation } from '@/components/launch/circle/SendConfirmation';
import { QueuedDrawer, type QueuedCapture } from '@/components/launch/circle/QueuedDrawer';
import { FirstSendCoachmark } from '@/components/launch/circle/FirstSendCoachmark';
import { LaunchQuickActions } from '@/components/launch/LaunchQuickActions';

type Mode = 'tap' | 'hold';
const MODE_KEY = 'mr:sc-capture-mode';
const MAX_SECS = 60;

/**
 * Voice-only Support Circle capture surface.
 * Polished v2: recipient header, live transcript ribbon, level meter,
 * tap/hold mode toggle, send-confirmation panel, queued drawer.
 *
 * URL: /launch/sc/capture/:subjectId  (name passed via ?name= for back-compat;
 * legacy /:subjectId/:subjectName still routes here.)
 */
export default function LaunchSCCapture() {
  const params = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const subjectId = params.subjectId ?? 'subject';
  const subjectNameRaw =
    params.subjectName ?? search.get('name') ?? 'your person';
  const recipientName = decodeURIComponent(subjectNameRaw);

  // Document title
  useEffect(() => {
    const prev = document.title;
    document.title = `Capture for ${recipientName} · MyRhythm`;
    return () => { document.title = prev; };
  }, [recipientName]);

  // Mode (tap vs hold-to-talk)
  const [mode, setMode] = useState<Mode>(() => {
    try {
      const v = localStorage.getItem(MODE_KEY);
      return v === 'hold' ? 'hold' : 'tap';
    } catch { return 'tap'; }
  });
  useEffect(() => {
    try { localStorage.setItem(MODE_KEY, mode); } catch { /* noop */ }
  }, [mode]);

  // Online / offline
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  // Recording + simulated transcript / level
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [finalText, setFinalText] = useState('');
  const [partialText, setPartialText] = useState('');
  const [level, setLevel] = useState(0);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!recording) {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
      setLevel(0);
      return;
    }
    tickRef.current = window.setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (next >= MAX_SECS) handleStopAndSend();
        return next;
      });
      setLevel(0.4 + Math.random() * 0.6);
      // tiny demo transcript progression
      setPartialText((p) => (p.length > 40 ? '' : p + (p.length === 0 ? 'listening' : '.')));
    }, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  // Confirmation + queue
  const [confirmation, setConfirmation] = useState<null | { name: string; online: boolean }>(null);
  const [queued, setQueued] = useState<QueuedCapture[]>([]);
  const undoRef = useRef<number | null>(null);

  function handleStart() {
    setFinalText('');
    setPartialText('');
    setElapsed(0);
    setRecording(true);
  }

  function handleStopAndSend() {
    if (!recording) return;
    setRecording(false);
    const dur = Math.max(1, elapsed);

    if (!online) {
      setQueued((q) => [
        ...q,
        { id: `${Date.now()}`, durationSec: dur, queuedAt: Date.now() },
      ]);
    }

    setConfirmation({ name: recipientName, online });
    if (undoRef.current) window.clearTimeout(undoRef.current);
    undoRef.current = window.setTimeout(() => setConfirmation(null), 6000);
  }

  function handlePointerDown() {
    if (mode === 'hold' && !recording) handleStart();
  }
  function handlePointerUp() {
    if (mode === 'hold' && recording) handleStopAndSend();
  }
  function handleClick() {
    if (mode !== 'tap') return;
    if (recording) handleStopAndSend();
    else handleStart();
  }

  function handleUndo() {
    if (undoRef.current) window.clearTimeout(undoRef.current);
    setConfirmation(null);
    setQueued((q) => q.slice(0, -1));
    toast.success('Capture removed');
  }

  function handleSendAnother() {
    if (undoRef.current) window.clearTimeout(undoRef.current);
    setConfirmation(null);
    handleStart();
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-stone-200/70 bg-white/80 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-stone-700 min-h-[44px] px-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode((m) => (m === 'tap' ? 'hold' : 'tap'))}
            className="text-[11px] uppercase tracking-[0.15em] text-stone-500 hover:text-stone-800 flex items-center gap-1.5 min-h-[40px] px-2"
            aria-label={`Switch to ${mode === 'tap' ? 'hold to talk' : 'tap to toggle'}`}
            title={mode === 'tap' ? 'Tap to toggle' : 'Hold to talk'}
          >
            {mode === 'tap' ? <MousePointerClick className="h-3.5 w-3.5" /> : <Hand className="h-3.5 w-3.5" />}
            {mode === 'tap' ? 'Tap mode' : 'Hold mode'}
          </button>
          <span className="flex items-center gap-1.5 text-xs text-stone-500">
            {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
      </header>

      <RecipientHeader name={recipientName} />

      {/* Mic stage */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-6 pb-12 gap-8">
        <p className="text-sm text-stone-600 text-center max-w-md">
          They will review and accept. <span className="text-stone-400">Nothing is added until they say yes.</span>
        </p>

        <div className="relative">
          {/* Level meter ring */}
          {recording && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-teal-400/60 pointer-events-none"
              animate={{ scale: 1 + level * 0.18, opacity: 0.8 - level * 0.4 }}
              transition={{ duration: 0.6 }}
            />
          )}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`relative w-56 h-56 rounded-full shadow-2xl flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 ${
              recording
                ? 'bg-gradient-to-br from-rose-500 to-orange-500'
                : 'bg-gradient-to-br from-[#0D9488] to-[#3FB6A8]'
            }`}
            aria-label={recording ? 'Stop and send' : mode === 'hold' ? 'Hold to record' : 'Tap to record'}
            aria-pressed={recording}
          >
            <div className="flex flex-col items-center text-white">
              <Mic className="h-16 w-16 mb-2" />
              <span className="text-sm font-medium tracking-wide">
                {recording
                  ? `${elapsed}s · ${mode === 'hold' ? 'release to send' : 'tap to send'}`
                  : mode === 'hold' ? 'Hold to speak' : 'Tap to speak'}
              </span>
            </div>
          </motion.button>
        </div>

        <LiveTranscriptRibbon visible={recording} finalText={finalText} partialText={partialText} />
      </div>

      <p className="text-center text-[11px] text-stone-400 pb-8 px-6 max-w-md mx-auto leading-relaxed">
        MyRhythm does not diagnose or treat. Captures share what you noticed — they are not medical advice.
      </p>

      <QueuedDrawer
        items={queued}
        onRemove={(id) => setQueued((q) => q.filter((x) => x.id !== id))}
      />

      <SendConfirmation
        visible={!!confirmation}
        recipientName={confirmation?.name ?? recipientName}
        online={confirmation?.online ?? online}
        onUndo={handleUndo}
        onSendAnother={handleSendAnother}
        onClose={() => setConfirmation(null)}
      />

      {confirmation && (
        <FirstSendCoachmark recipientName={recipientName} recipientId={subjectId} />
      )}
      <LaunchQuickActions />
    </div>
  );
}
