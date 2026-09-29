import React, { useEffect } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { DemoModeProvider } from '@/contexts/DemoModeContext';
import { QuietHome } from '@/components/launch/quiet/QuietHome';
import { markAppReady } from '@/hooks/useAppReady';
import { clearResumePoint } from '@/launch/onboarding/resumePoint';

export default function LaunchDashboard() {

  // Reaching Home means onboarding is done — unlock the wayfinder dial.
  useEffect(() => {
    markAppReady();
    clearResumePoint();
  }, []);



  return (
    <DemoModeProvider>
      <LaunchLayout>
        <QuietHome />
      </LaunchLayout>
    </DemoModeProvider>
  );
}
