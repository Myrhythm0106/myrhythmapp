import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { FirstSendCoachmark } from '@/components/launch/circle/FirstSendCoachmark';
import { toast } from 'sonner';

/**
 * Voice-only Support Circle capture surface.
 * One large mic button + name of the person they're capturing for.
 * No typing required. Built for elderly caregivers on small phones.
 */
export default function LaunchSCCapture() {
  const { subjectId = 'subject', subjectName = 'your person' } = useParams();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

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

  const handlePress = () => {
    if (recording) {
      setRecording(false);
      setJustSent(true);
      const undo = setTimeout(() => setJustSent(false), 6000);
      toast('Sent for review', {
        description: online ? 'Delivered.' : 'Queued — will sync when online.',
        action: {
          label: 'Undo',
          onClick: () => { clearTimeout(undo); setJustSent(false); toast.success('Capture removed'); },
        },
        duration: 6000,
      });
    } else {
      setRecording(true);
      // Auto-stop after 60s to keep it simple
      setTimeout(() => setRecording((r) => { if (r) handlePress(); return r; }), 60_000);
    }
  };

  const friendlyName = decodeURIComponent(subjectName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-teal-50 via-white to-memory-emerald-50/40 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-brain-health-100/60 bg-white/70 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-brain-health-700 min-h-[44px] px-2"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-1.5 text-xs text-brain-health-500">
          {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          {online ? 'Online' : 'Offline — will queue'}
        </div>
      </header>

      {/* Subject card */}
      <div className="px-6 pt-8 text-center space-y-1">
        <p className="text-xs uppercase tracking-wide text-brain-health-500">Capturing for</p>
        <h1 className="text-3xl font-bold text-brain-health-900">{friendlyName}</h1>
        <p className="text-sm text-brain-health-600 mt-2">
          They will review and accept. Nothing is added until they say yes.
        </p>
      </div>

      {/* Big mic button */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handlePress}
          className={`w-56 h-56 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
            recording
              ? 'bg-brand-orange-500'
              : 'bg-gradient-to-br from-brand-teal-500 to-memory-emerald-500'
          }`}
          aria-label={recording ? 'Stop and send' : 'Tap to record'}
          style={{ minHeight: 56 }}
        >
          {recording ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex flex-col items-center text-white"
            >
              <Mic className="h-16 w-16 mb-2" />
              <span className="text-sm font-medium">Tap to send</span>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-white">
              <Mic className="h-16 w-16 mb-2" />
              <span className="text-sm font-medium">Tap to speak</span>
            </div>
          )}
        </motion.button>
      </div>

      <p className="text-center text-xs text-brain-health-500 pb-8 px-6 max-w-md mx-auto">
        MyRhythm does not diagnose or treat. Captures are a way to share what you noticed, not medical advice.
      </p>

      {justSent && (
        <FirstSendCoachmark recipientName={friendlyName} recipientId={subjectId} />
      )}
    </div>
  );
}
