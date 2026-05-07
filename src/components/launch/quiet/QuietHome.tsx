import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { IChooseHeart } from './IChooseHeart';
import { ReEntryCard } from './ReEntryCard';
import { Scaffolds } from './Scaffolds';
import { Composer } from './Composer';
import { CognitiveLoadMeter } from './CognitiveLoadMeter';
import { TierSwitcherPill } from './TierSwitcherPill';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function QuietHome() {
  const { fixtures } = useDemoOrLive();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Greeting strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-sm text-brain-health-600">{greeting()}, {fixtures.name}.</p>
          <p className="text-xs text-brain-health-500 mt-0.5">No catching up. Just this moment.</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-white/60 border border-brain-health-100 text-brain-health-700 capitalize">
          {fixtures.tier}
        </span>
      </motion.div>

      {/* #IChoose centerpiece */}
      <IChooseHeart />

      {/* Re-entry */}
      <ReEntryCard />

      {/* Scaffolds */}
      <Scaffolds />

      {/* Composer */}
      <Composer />

      {/* Today's wins */}
      <div className="rounded-3xl bg-white/80 backdrop-blur border border-memory-emerald-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-memory-emerald-600" />
          <h3 className="font-semibold text-memory-emerald-900">Today's gentle wins</h3>
        </div>
        <ul className="space-y-2">
          {fixtures.wins.map((w) => (
            <li key={w.id} className="flex items-center justify-between text-sm">
              <span className="text-brain-health-800">{w.text}</span>
              <span className="text-xs text-brain-health-500">{w.time}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cognitive Load (Plus+) */}
      <CognitiveLoadMeter />

      {/* Footer signature */}
      <p className="text-center text-xs text-brain-health-500 pt-4 pb-8">
        Today is yours. #IChoose
      </p>

      {/* Dev-only tier switcher */}
      <TierSwitcherPill />
    </div>
  );
}
