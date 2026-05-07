import React from 'react';
import { Lock } from 'lucide-react';
import { DemoTier } from '@/data/demoFixtures';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { cn } from '@/lib/utils';

const TIER_RANK: Record<DemoTier, number> = { free: 0, plus: 1, pro: 2, family: 3 };

interface TierGateProps {
  required: DemoTier;
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export function TierGate({ required, children, className, label }: TierGateProps) {
  const { tier } = useDemoOrLive();
  const allowed = TIER_RANK[tier] >= TIER_RANK[required];

  if (allowed) return <>{children}</>;

  return (
    <div className={cn('relative rounded-3xl overflow-hidden', className)}>
      <div className="pointer-events-none opacity-40 select-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2 text-center px-6">
          <div className="w-10 h-10 rounded-full bg-brand-teal-100 flex items-center justify-center">
            <Lock className="h-4 w-4 text-brand-teal-700" />
          </div>
          <p className="text-sm font-medium text-brain-health-800">
            {label ?? `Unlock when you're ready`}
          </p>
          <p className="text-xs text-brain-health-600 capitalize">Available on {required}</p>
        </div>
      </div>
    </div>
  );
}
