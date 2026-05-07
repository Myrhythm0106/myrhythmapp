import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useDemoOrLive } from '@/contexts/DemoModeContext';

export function ReEntryCard() {
  const { fixtures } = useDemoOrLive();
  if (fixtures.lastVisitHoursAgo <= 24) return null;

  const supporter = fixtures.supportCircle[0];
  const message = supporter
    ? `${supporter.name} has been cheering you on. Welcome back — no catching up needed.`
    : `Welcome back. There's nothing to catch up on. Just begin where you are.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl bg-gradient-to-br from-memory-emerald-50 to-clarity-teal-50/60 border border-memory-emerald-200/60 p-5"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-memory-emerald-100 flex items-center justify-center shrink-0">
          <Heart className="h-5 w-5 text-memory-emerald-600" />
        </div>
        <div>
          <h3 className="font-semibold text-memory-emerald-900 mb-1">You're back.</h3>
          <p className="text-sm text-memory-emerald-800/90 leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
