import React from 'react';
import { MemoryBridgeRecorder } from './MemoryBridgeRecorder';
import { PACTGenerationFlow } from './PACTGenerationFlow';
import { PACTReportsHub } from './PACTReportsHub';
import { useMemoryBridge } from '@/hooks/useMemoryBridge';
import { Separator } from '@/components/ui/separator';

export function UnifiedMemoryFlow() {
  const { 
    showPACTFlow, 
    lastRecordingData, 
    completePACTGeneration,
    extractedActions 
  } = useMemoryBridge();

  // Show PACT generation flow after recording
  if (showPACTFlow && lastRecordingData) {
    return (
      <div className="space-y-6">
        <PACTGenerationFlow
          meetingId={lastRecordingData.meetingId}
          audioData={lastRecordingData.audioData}
          onComplete={completePACTGeneration}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Recording Interface */}
      <MemoryBridgeRecorder />
      
      {/* Reports Hub - Always visible for quick access */}
      {extractedActions.length > 0 && (
        <>
          <Separator className="my-8" />
          <PACTReportsHub />
        </>
      )}
    </div>
  );
}