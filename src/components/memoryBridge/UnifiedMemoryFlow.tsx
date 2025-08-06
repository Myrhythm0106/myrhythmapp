
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemoryBridgeRecorder } from './MemoryBridgeRecorder';
import { PACTGenerationFlow } from './PACTGenerationFlow';
import { PACTReportsHub } from './PACTReportsHub';
import { PACTRecordingTab } from './PACTRecordingTab';
import { useMemoryBridge } from '@/hooks/useMemoryBridge';
import { Separator } from '@/components/ui/separator';
import { Mic, Target, FileText, BarChart } from 'lucide-react';

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
      {/* Memory Bridge Tabs */}
      <Tabs defaultValue="recording" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recording" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            PACT Recording
          </TabsTrigger>
          <TabsTrigger value="legacy" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Legacy Recorder
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recording" className="space-y-6">
          <PACTRecordingTab />
        </TabsContent>

        <TabsContent value="legacy" className="space-y-6">
          <MemoryBridgeRecorder />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {extractedActions.length > 0 ? (
            <PACTReportsHub />
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Reports Yet
              </h3>
              <p className="text-muted-foreground">
                Record some conversations to generate PACT reports
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-8">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-muted-foreground">
              Coming soon - Track your commitment patterns and success rates
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
