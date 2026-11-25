import React, { useEffect } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { DemoModeProvider } from '@/contexts/DemoModeContext';
import { QuietHome } from '@/components/launch/quiet/QuietHome';
import { markAppReady } from '@/hooks/useAppReady';

export default function LaunchDashboard() {

  // Home unlocks free movement. Any unfinished set-up stays resumable here.
  useEffect(() => {
    markAppReady();
  }, []);



  return (
    <DemoModeProvider>
      <LaunchLayout>
        <QuietHome />
      </LaunchLayout>
    </DemoModeProvider>
  );
}
