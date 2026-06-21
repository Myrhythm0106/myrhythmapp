import React from 'react';
import { CaptureDeliverableView } from '@/components/memoryBridge/capture-brief/CaptureDeliverableView';
import { LaunchQuickActions } from '@/components/launch/LaunchQuickActions';
import { LaunchPageHeader } from '@/components/launch/LaunchPageHeader';

export default function LaunchCaptureResult() {
  return (
    <>
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <LaunchPageHeader fallbackPath="/launch/capture" />
      </div>
      <CaptureDeliverableView />
      <LaunchQuickActions />
    </>
  );
}
