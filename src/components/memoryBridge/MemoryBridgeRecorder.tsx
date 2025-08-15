import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { SwipeHint } from '@/components/gratitude/journal/components/SwipeHint';
import { MeetingSetupDialog } from './MeetingSetupDialog';
import { MeetingEndDialog } from './MeetingEndDialog';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Heart, Users, Clock, StopCircle, Activity, Save, Trash2, Share2, ArrowUp, ArrowDown, Mic, Sparkles } from 'lucide-react';
import { MeetingSetupData } from '@/types/memoryBridge';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { MemoryBridgeResultsModal } from './MemoryBridgeResultsModal';

interface MemoryBridgeRecorderProps {
  onRecordingComplete?: (result: any) => void;
  onShowResults?: (meetingId: string, actionsFound: number, summary?: string) => void;
}

export function MemoryBridgeRecorder({ onRecordingComplete, onShowResults }: MemoryBridgeRecorderProps) {
  const { 
    isRecording, 
    isProcessing, 
    currentMeeting, 
    startMeetingRecording, 
    stopMeetingRecording 
  } = useMemoryBridge();
  // const { canRecord, updateUsage } = useRecordingLimits();
  const isMobile = useIsMobile();
  const [selectedWatchers, setSelectedWatchers] = useState<string[]>([]);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [pendingAudioBlob, setPendingAudioBlob] = useState<Blob | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [lastMeetingId, setLastMeetingId] = useState<string | null>(null);
  const [actionsFound, setActionsFound] = useState(0);
  
  const { 
    startRecording: startVoiceRecording, 
    stopRecording: stopVoiceRecording,
    saveRecording 
  } = useVoiceRecorder();
  
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  const [currentDuration, setCurrentDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSwipeSave = () => {
    handleStopMeeting();
    toast.success("Recording saved and processing...");
  };

  const handleSwipeDiscard = () => {
    setShowDiscardConfirm(true);
  };

  const confirmDiscard = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopVoiceRecording();
    setRecordingStartTime(null);
    setCurrentDuration(0);
    setShowDiscardConfirm(false);
    toast.success("No one walks alone - your progress is always safe with us!", {
      description: "Recording discarded safely"
    });
  };

  const handleSwipeShare = () => {
    toast.info("Share with Support Circle after processing completes!");
  };

  const handleQuickStart = async () => {
    try {
      // Start voice recording immediately without setup
      await startVoiceRecording();
      setRecordingStartTime(new Date());
      
      // Start duration counter
      intervalRef.current = setInterval(() => {
        setCurrentDuration(prev => prev + 1);
      }, 1000);

      toast.success('Recording started! You\'re empowered to capture every important moment.', {
        description: 'Complete setup when you stop - no stress!'
      });
    } catch (error) {
      console.error('Error starting quick recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const handleStartMeeting = async (setupData: MeetingSetupData) => {
    try {
      // Start voice recording first
      await startVoiceRecording();
      
      // Create a temporary voice recording entry
      const tempBlob = new Blob(['temp'], { type: 'audio/wav' });
      const voiceData = await saveRecording(
        tempBlob, 
        setupData.title, 
        'memory_bridge',
        `Memory Bridge recording for: ${setupData.title}`,
        false
      );

      if (voiceData) {
        // Start the meeting recording with watchers
        const setupWithWatchers = { ...setupData, watchers: selectedWatchers };
        const meetingRecord = await startMeetingRecording(setupWithWatchers, voiceData.id);
        
        if (meetingRecord) {
          setRecordingStartTime(new Date());
          
          // Start duration counter
          intervalRef.current = setInterval(() => {
            setCurrentDuration(prev => prev + 1);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error starting meeting:', error);
      toast.error('Failed to start meeting recording');
    }
  };

  const handleStopMeeting = async () => {
    try {
      // Stop the timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Stop voice recording and get the audio blob
      const audioBlob = await stopVoiceRecording();
      
      if (audioBlob) {
        if (currentMeeting) {
          // If we have meeting setup, process immediately
          const result = await stopMeetingRecording(audioBlob);
          
          // Show ACTS results immediately (3-click rule)
          if (result?.meetingId) {
            setLastMeetingId(result.meetingId);
            setActionsFound(result.actionsCount || 0);
            setShowResultsModal(true);
          }
          
          onRecordingComplete?.(result);
        } else {
          // If no setup yet, save audio and show setup dialog
          setPendingAudioBlob(audioBlob);
          setShowEndDialog(true);
        }
      }
      
      setRecordingStartTime(null);
      setCurrentDuration(0);
    } catch (error) {
      console.error('Error stopping meeting:', error);
      toast.error('Failed to stop recording');
    }
  };

  const handleEndDialogSave = async (setupData: MeetingSetupData) => {
    if (!pendingAudioBlob) return;

    try {
      // Create voice recording entry
      const voiceData = await saveRecording(
        pendingAudioBlob,
        setupData.title,
        'memory_bridge',
        `Memory Bridge recording for: ${setupData.title}`,
        false
      );

      if (voiceData) {
        // Start meeting recording
        const setupWithWatchers = { ...setupData, watchers: selectedWatchers };
        const meetingRecord = await startMeetingRecording(setupWithWatchers, voiceData.id);
        
        if (meetingRecord) {
          // Process the audio
          const result = await stopMeetingRecording(pendingAudioBlob);
          
          // Show ACTS results immediately
          if (result?.meetingId) {
            setLastMeetingId(result.meetingId);
            setActionsFound(result.actionsCount || 0);
            setShowResultsModal(true);
          }
          
          onRecordingComplete?.(result);
        }
      }

      setShowEndDialog(false);
      setPendingAudioBlob(null);
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast.error('Failed to save meeting');
    }
  };

  const handleEndDialogCancel = () => {
    setShowDiscardConfirm(true);
  };

  const confirmEndDialogCancel = () => {
    setShowEndDialog(false);
    setPendingAudioBlob(null);
    setShowDiscardConfirm(false);
    toast.success("Your journey matters - recording safely discarded", {
      description: "No one walks alone in managing their commitments"
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show recording UI if we're recording (with or without meeting setup)
  if (isRecording || recordingStartTime) {
    return (
      <SwipeableContainer
        enableHorizontalSwipe={isMobile}
        onSwipeLeft={{
          label: "Save & Process",
          icon: <Save className="h-4 w-4" />,
          color: "#22c55e",
          action: handleSwipeSave
        }}
        onSwipeRight={{
          label: "Share Circle",
          icon: <Share2 className="h-4 w-4" />,
          color: "#3b82f6",
          action: handleSwipeShare
        }}
        onPullToRefresh={handleSwipeDiscard}
        enablePullToRefresh={isMobile}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="border-primary/20 shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Capturing: {currentMeeting?.meeting_title || 'Your Important Moment'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recording Status */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full px-6 py-3 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-red-500 animate-pulse" />
                  <span className="text-lg font-mono text-red-600 dark:text-red-400">
                    {formatDuration(currentDuration)}
                  </span>
                </div>
              </div>
            </div>

          {/* Meeting Info */}
          {currentMeeting ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Participants:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentMeeting.participants.map((participant, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {participant.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>Type:</span>
                </div>
                <Badge variant="secondary">
                  {currentMeeting.meeting_type}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Empowering Your Journey</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete meeting details when you stop - no pressure, no judgment
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Remember: No one walks alone 💜
              </p>
            </div>
          )}

          {/* Context */}
          {currentMeeting?.meeting_context && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Context:</p>
              <p className="text-sm bg-muted/50 rounded-lg p-3">
                {currentMeeting.meeting_context}
              </p>
            </div>
          )}

            {/* Stop Button */}
            <div className="flex justify-center pt-4 space-y-2">
              <div className="space-y-3 text-center">
                <Button
                  onClick={handleStopMeeting}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 text-lg"
                >
                  <StopCircle className="h-5 w-5 mr-2" />
                  {isProcessing ? 'Creating Your ACTS Summary...' : 'Complete & See Your ACTS'}
                </Button>
                
                {/* Swipe Instructions */}
                {isMobile && (
                  <div className="space-y-1">
                    <SwipeHint isMobile={true} />
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>↑ Pull down to safely discard</p>
                      <p>← Swipe left to create ACTS</p>
                      <p>→ Swipe right to share with circle</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </SwipeableContainer>
    );
  }

  return (
    <div className="space-y-6">
      {/* <RecordingLimitsWarning /> */}
      
      <SwipeableContainer
        enableHorizontalSwipe={isMobile}
        onSwipeLeft={{
          label: "Quick Start",
          icon: <Heart className="h-4 w-4" />,
          color: "#22c55e",
          action: () => toast.success("Swipe up to start recording!")
        }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Heart className="h-6 w-6 text-primary" />
              Memory Bridge
            </CardTitle>
            <p className="text-muted-foreground">
              Empower your relationships - capture conversations and never walk alone
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">No One Walks Alone</span>
              <Heart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Family Watchers Section - Coming Soon */}
            {/* {!isRecording && !isProcessing && (
              <MemoryBridgeWatchersField 
                selectedWatchers={selectedWatchers}
                onWatchersChange={setSelectedWatchers}
              />
            )} */}

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Preserve Intent</h3>
                <p className="text-xs text-muted-foreground">
                  Never lose the 'why' behind your promises
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Support Circle</h3>
                <p className="text-xs text-muted-foreground">
                  Share your journey with those who care
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Empowered Action</h3>
                <p className="text-xs text-muted-foreground">
                  Transform promises into progress
                </p>
              </div>
            </div>

            {/* Start Recording */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleQuickStart}
                disabled={isProcessing}
                className="bg-gradient-to-r from-primary to-primary-glow text-white shadow-elegant hover:shadow-glow transition-all duration-300 flex items-center gap-2"
              >
                <Mic className="h-5 w-5" />
                Quick Recording
              </Button>
              
              <MeetingSetupDialog 
                onStartMeeting={handleStartMeeting}
                isLoading={isProcessing}
              />
            </div>

            {/* Empowerment Section */}
            <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="font-medium text-primary">Empower Every Conversation</p>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✨ Family conversations & planning</p>
                <p>🏥 Medical appointments & care plans</p>
                <p>💬 Important discussions with loved ones</p>
                <p>🤝 Any conversation where promises matter</p>
                <div className="mt-3 p-2 bg-background/50 rounded-md">
                  <p className="text-xs font-medium text-primary">
                    "Transform every conversation into actionable progress - you're never alone in your journey"
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Swipe Instructions */}
            {isMobile && (
              <div className="text-center">
                <SwipeHint isMobile={true} />
                <p className="text-xs text-muted-foreground mt-1">
                  Swipe left to start your empowered recording
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </SwipeableContainer>

      {/* Meeting End Dialog */}
      <MeetingEndDialog
        isOpen={showEndDialog}
        onSave={handleEndDialogSave}
        onCancel={handleEndDialogCancel}
        isLoading={isProcessing}
      />

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showDiscardConfirm}
        onConfirm={showEndDialog ? confirmEndDialogCancel : confirmDiscard}
        onCancel={() => setShowDiscardConfirm(false)}
        title="Discard this recording?"
        description="Your conversation won't be saved. This action cannot be undone. Remember, your progress matters and you're supported every step of the way."
        confirmText="Yes, discard safely"
        cancelText="Keep recording"
        variant="destructive"
      />

      {/* ACTS Results Modal */}
      {lastMeetingId && (
        <MemoryBridgeResultsModal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          meetingId={lastMeetingId}
          actionsFound={actionsFound}
          summary="Your conversation has been transformed into actionable commitments"
        />
      )}
    </div>
  );
}