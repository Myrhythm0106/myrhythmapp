import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Plus, Undo2 } from 'lucide-react';

interface Props {
  visible: boolean;
  recipientName: string;
  online: boolean;
  onUndo: () => void;
  onSendAnother: () => void;
  onClose: () => void;
}

export function SendConfirmation({
  visible,
  recipientName,
  online,
  onUndo,
  onSendAnother,
}: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6"
        >
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200 shadow-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-900">
                  Sent to {recipientName}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {online
                    ? 'They will review and accept. Nothing is added until they say yes.'
                    : 'Queued offline — will sync automatically when you reconnect.'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onUndo}
                className="flex-1 min-h-[48px] rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 flex items-center justify-center gap-2"
              >
                <Undo2 className="h-4 w-4" /> Undo
              </button>
              <button
                onClick={onSendAnother}
                className="flex-1 min-h-[48px] rounded-xl bg-[#0D9488] hover:bg-[#0B7A70] text-white text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> Send another
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
