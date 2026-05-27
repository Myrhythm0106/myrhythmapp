import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  finalText: string;
  partialText?: string;
  visible: boolean;
}

/**
 * Live transcript ribbon shown under the mic while capturing.
 * Greyed partials, dark finals. aria-live for screen readers.
 */
export function LiveTranscriptRibbon({ finalText, partialText, visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="w-full max-w-xl mx-auto px-6"
          aria-live="polite"
          aria-atomic="false"
        >
          <div className="bg-white/85 backdrop-blur border border-stone-200 rounded-2xl px-5 py-4 min-h-[64px] shadow-sm">
            <p className="text-sm leading-relaxed">
              <span className="text-stone-900">{finalText}</span>{' '}
              <span className="text-stone-400">{partialText}</span>
              {!finalText && !partialText && (
                <span className="text-stone-400 italic">Listening…</span>
              )}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
