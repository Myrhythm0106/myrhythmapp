import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Check } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function InlineCaptureSheet({ open, onClose }: Props) {
  const [phase, setPhase] = useState<'listening' | 'done'>('listening');

  useEffect(() => {
    if (!open) return;
    setPhase('listening');
    const t1 = setTimeout(() => setPhase('done'), 3000);
    const t2 = setTimeout(() => onClose(), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="rounded-3xl bg-white border border-brand-teal-200/60 shadow-lg p-6 text-center"
        >
          {phase === 'listening' ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-3 rounded-full bg-brand-orange-500 flex items-center justify-center shadow-lg"
              >
                <Mic className="h-7 w-7 text-white" />
              </motion.div>
              <p className="font-medium text-brain-health-800">Listening… take your time.</p>
              <p className="text-xs text-brain-health-600 mt-1">Nothing to get right.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-memory-emerald-500 flex items-center justify-center">
                <Check className="h-7 w-7 text-white" />
              </div>
              <p className="font-medium text-memory-emerald-800">Got it. Saved gently.</p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
