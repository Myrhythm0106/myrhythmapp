// @version 0.1
// LaunchLanding — reuses the /mvp story page (MVPCore4C). Auth redirect lives inside MVPCore4C.
import React from 'react';
import { MVPCore4C } from '@/components/mvp/MVPCore4C';
import { ResumeBanner } from '@/components/launch/ResumeBanner';

export default function LaunchLanding() {
  return (
    <>
      <MVPCore4C />
      <ResumeBanner />
    </>
  );
}
