import React from 'react';
import { useDemoOrLive, useIsDevDemo } from '@/contexts/DemoModeContext';
import { DemoTier } from '@/data/demoFixtures';

const TIERS: DemoTier[] = ['free', 'plus', 'pro', 'family'];

export function TierSwitcherPill() {
  const { tier, setTier } = useDemoOrLive();
  const visible = useIsDevDemo();
  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 rounded-full bg-black/80 backdrop-blur text-white text-xs px-1 py-1 shadow-2xl flex items-center gap-1">
      <span className="px-2 opacity-60 uppercase tracking-wider">demo</span>
      {TIERS.map((t) => (
        <button
          key={t}
          onClick={() => setTier(t)}
          className={`px-3 py-1.5 rounded-full capitalize transition-colors ${
            tier === t ? 'bg-white text-black font-medium' : 'hover:bg-white/15'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
