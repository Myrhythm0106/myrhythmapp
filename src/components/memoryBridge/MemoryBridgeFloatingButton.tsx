import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MeetingSetupDialog } from './MeetingSetupDialog';
import { MemoryBridgeRecorder } from './MemoryBridgeRecorder';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { Brain, Mic, StopCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemoryBridgeFloatingButtonProps {
  className?: string;
}

export function MemoryBridgeFloatingButton({ className }: MemoryBridgeFloatingButtonProps) {
  const { isRecording, currentMeeting } = useMemoryBridge();
  const [showSetup, setShowSetup] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);

  const handleQuickStart = () => {
    if (isRecording) {
      setShowRecorder(true);
    } else {
      setShowSetup(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleQuickStart}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          isRecording 
            ? "bg-red-500 hover:bg-red-600 animate-pulse" 
            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
          className
        )}
        size="icon"
      >
        {isRecording ? (
          <StopCircle className="h-6 w-6 text-white" />
        ) : currentMeeting ? (
          <Mic className="h-6 w-6 text-white" />
        ) : (
          <Brain className="h-6 w-6 text-white" />
        )}
      </Button>

      {showSetup && (
        <MeetingSetupDialog
          onStartMeeting={(setupData) => {
            setShowSetup(false);
            setShowRecorder(true);
          }}
        />
      )}

      {showRecorder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <MemoryBridgeRecorder 
          open={showRecorder}
          onClose={() => setShowRecorder(false)}
          meetingData={currentMeeting}
          onComplete={() => {
            setShowRecorder(false);
            setCurrentMeeting(null);
          }}
        />
            <div className="p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowRecorder(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}