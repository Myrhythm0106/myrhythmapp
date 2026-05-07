import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DemoFixtures, DemoTier, getDemoFixtures } from '@/data/demoFixtures';

// SINGLE SWAP POINT: set to false to wire to live Supabase data.
const DEMO_MODE_ENABLED = true;

const TIER_KEY = 'myrhythm_demo_tier';

interface DemoModeContextValue {
  isDemo: boolean;
  tier: DemoTier;
  setTier: (t: DemoTier) => void;
  fixtures: DemoFixtures;
}

const DemoModeContext = createContext<DemoModeContextValue | undefined>(undefined);

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTierState] = useState<DemoTier>(() => {
    if (typeof window === 'undefined') return 'free';
    const saved = localStorage.getItem(TIER_KEY) as DemoTier | null;
    return saved ?? 'free';
  });

  useEffect(() => {
    localStorage.setItem(TIER_KEY, tier);
  }, [tier]);

  const value = useMemo<DemoModeContextValue>(() => ({
    isDemo: DEMO_MODE_ENABLED,
    tier,
    setTier: setTierState,
    fixtures: getDemoFixtures(tier),
  }), [tier]);

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export function useDemoOrLive(): DemoModeContextValue {
  const ctx = useContext(DemoModeContext);
  if (!ctx) {
    // Safe fallback so components don't crash if rendered outside provider.
    return { isDemo: DEMO_MODE_ENABLED, tier: 'free', setTier: () => {}, fixtures: getDemoFixtures('free') };
  }
  return ctx;
}

export function useIsDevDemo(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return import.meta.env.DEV && params.get('demo') === '1';
}
