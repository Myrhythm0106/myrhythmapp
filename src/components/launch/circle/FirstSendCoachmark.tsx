import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  recipientName: string;
  /** Stable identifier (e.g. SC member id) so the coachmark shows once per recipient. */
  recipientId: string;
  onDismiss?: () => void;
}

const KEY = (id: string) => `mr:first-send-coachmark:${id}`;

/**
 * One-time, 8-word coachmark shown to a Support Circle member after their
 * very first capture for a given recipient. Solves the trust gap at zero cost.
 */
export function FirstSendCoachmark({ recipientName, recipientId, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY(recipientId))) {
        setVisible(true);
        localStorage.setItem(KEY(recipientId), '1');
        const t = setTimeout(() => {
          setVisible(false);
          onDismiss?.();
        }, 4000);
        return () => clearTimeout(t);
      }
    } catch { /* no-op */ }
  }, [recipientId, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm"
        >
          <div className="bg-white border border-memory-emerald-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-memory-emerald-500 flex-shrink-0" />
            <p className="text-sm text-brain-health-800">
              Sent. <span className="font-semibold">{recipientName}</span> will review and accept.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
