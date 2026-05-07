import React from 'react';
import { Activity } from 'lucide-react';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { TierGate } from './TierGate';
import { BrainHealthLensChip } from './BrainHealthLensChip';

export function CognitiveLoadMeter() {
  const { fixtures } = useDemoOrLive();
  const load = fixtures.cognitiveLoad;
  const band = load < 35 ? 'Light' : load < 65 ? 'Steady' : 'Full';
  const tone = load < 35 ? 'bg-memory-emerald-500' : load < 65 ? 'bg-clarity-teal-500' : 'bg-brand-orange-500';

  return (
    <TierGate required="plus" label="Cognitive Load Meter — unlock with Plus">
      <div className="rounded-3xl bg-white/80 backdrop-blur border border-brain-health-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-brain-health-600" />
            <h3 className="font-semibold text-brain-health-900">Cognitive Load</h3>
          </div>
          <span className="text-sm font-medium text-brain-health-700">{band}</span>
        </div>
        <div className="h-3 rounded-full bg-brain-health-50 overflow-hidden">
          <div className={`h-full ${tone} transition-all`} style={{ width: `${load}%` }} />
        </div>
        <p className="text-xs text-brain-health-600 mt-2">You're at {load}% of your usual rhythm.</p>
        <BrainHealthLensChip
          className="mt-3"
          text="Knowing your load helps you choose the next move that fits — not the one that drains you."
        />
      </div>
    </TierGate>
  );
}
