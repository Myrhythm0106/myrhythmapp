import React from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { DemoModeProvider } from '@/contexts/DemoModeContext';
import { QuietHome } from '@/components/launch/quiet/QuietHome';
import { FirstRunOverlay } from '@/components/launch/FirstRunOverlay';
import LaunchDashboardLegacy from './LaunchDashboardLegacy';

export default function LaunchDashboard() {
  // Escape hatch: ?quiet=0 instantly reverts to the legacy dashboard.
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const useLegacy = params?.get('quiet') === '0';

  if (useLegacy) {
    return <LaunchDashboardLegacy />;
  }

  return (
    <DemoModeProvider>
      <LaunchLayout>
        <QuietHome />
        <FirstRunOverlay />
      </LaunchLayout>
    </DemoModeProvider>
  );
}
