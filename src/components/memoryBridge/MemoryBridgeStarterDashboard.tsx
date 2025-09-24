import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemoryBridgeRecorder } from './MemoryBridgeRecorder';
import { MemoryBridgeResultsModal } from './MemoryBridgeResultsModal';
import { ExtractedActionsReview } from './ExtractedActionsReview';
import { ActsReviewTable } from './ActsReviewTable';
import { RecordingsTab } from './RecordingsTab';
import { QuickCaptureRecorder } from './QuickCaptureRecorder';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Mic,
  Heart,
  Zap,
  Target,
  Trophy,
  ArrowRight,
  Play,
  CheckSquare,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { MVPThemeWrapper } from '@/components/theme/MVPThemeWrapper';
import { MVPTopNav } from '@/components/mvp/MVPTopNav';
import { MVPPageHeader } from '@/components/mvp/MVPPageHeader';

export function MemoryBridgeStarterDashboard() {
  const { 
    extractedActions, 
    fetchExtractedActions, 
    confirmAction,
    isProcessing,
    fetchMeetingHistory,
    updateExtractedAction,
    isRecording
  } = useMemoryBridge();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showFirstRecording, setShowFirstRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastMeetingId, setLastMeetingId] = useState<string>('');
  const [lastActionsCount, setLastActionsCount] = useState(0);
  const [lastSummary, setLastSummary] = useState<string>('');
  
  const hasCompletedFirstRecording = extractedActions.length > 0;
  const recordingCount = extractedActions.length;

  // Load actions on component mount
  React.useEffect(() => {
    if (user) {
      fetchExtractedActions().catch(console.error);
    }
  }, [user]);
  
  const handleStartFirstRecording = () => {
    setShowFirstRecording(true);
  };
  
  const handleRecordingComplete = () => {
    setShowFirstRecording(false);
    // Results will be handled by the Memory Bridge hook automatically
    // We just close the recording interface
  };
  
  const handleUnlockCalendar = () => {
    navigate('/calendar');
  };
  
  const handleUnlockDashboard = () => {
    navigate('/dashboard');
  };

  const handleUpdateAction = async (actionId: string, updates: Partial<any>) => {
    if (updateExtractedAction) {
      await updateExtractedAction(actionId, updates);
    }
  };

  const handleConfirmActions = async (actionIds: string[], scheduleData: Record<string, { date: string; time: string }>) => {
    for (const actionId of actionIds) {
      const schedule = scheduleData[actionId];
      await confirmAction(actionId, 'confirmed', {
        scheduled_date: schedule?.date,
        scheduled_time: schedule?.time
      });
    }
    await fetchExtractedActions();
  };

  const handleBackfillExtraction = async () => {
    try {
      const meetings = await fetchMeetingHistory();
      let processedCount = 0;
      
      for (const meeting of meetings) {
        if (meeting.transcript && !meeting.processing_completed_at) {
          // Re-extract ACTs from existing transcripts
          const { data, error } = await supabase.functions.invoke('extract-acts-incremental', {
            body: {
              transcript: meeting.transcript,
              meetingId: meeting.id,
              userId: user?.id
            }
          });
          
          if (!error) {
            processedCount++;
          }
        }
      }
      
      await fetchExtractedActions();
      toast.success(`Re-extracted ACTs from ${processedCount} past recordings`);
    } catch (error) {
      console.error('Backfill extraction error:', error);
      toast.error('Failed to re-extract past recordings');
    }
  };

  return (
    <MVPThemeWrapper>
      <MVPTopNav />
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6 p-6">
          {/* Authentication Check Banner */}
          {!user && (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Sign In Required</h3>
                    <p className="text-red-700">You need to sign in to test recordings and ACT extraction</p>
                  </div>
                  <Button onClick={() => navigate('/auth')} className="bg-red-600 hover:bg-red-700">
                    Sign In / Sign Up
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current User Info */}
          {user && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">Signed in as: <strong>{user.email}</strong></span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Ready to Test</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* MVP Page Header */}
          <MVPPageHeader 
            title="Memory Bridge Testing"
            subtitle={user ? "Record a conversation and watch AI extract actionable commitments" : "Sign in to start testing the complete Memory Bridge experience"}
          />

          {/* Testing Interface - Hidden from public but accessible for QA */}
          {user && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open('/testing-suite', '_blank')}
                className="text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                Open Testing Suite
              </Button>
            </div>
          )}

          {/* Progress Indicator */}
        <Card className="border-memory-emerald-200 bg-gradient-to-r from-white via-memory-emerald-50/30 to-brain-health-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-memory-emerald-600">{recordingCount}</div>
                  <p className="text-sm text-brain-health-600">Recordings</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {recordingCount >= 1 && (
                    <Badge className="bg-memory-emerald-100 text-memory-emerald-800">
                      <Trophy className="h-3 w-3 mr-1" />
                      First Win!
                    </Badge>
                  )}
                  
                  {recordingCount >= 3 && (
                    <Badge className="bg-brain-health-100 text-brain-health-800">
                      <Brain className="h-3 w-3 mr-1" />
                      Expert Mode
                    </Badge>
                  )}
                </div>
              </div>
              
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  <Mic className="h-3 w-3 mr-1" />
                  Recording Active
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue={hasCompletedFirstRecording ? "actions" : "recording"} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recording" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Recording
            </TabsTrigger>
            <TabsTrigger value="recordings" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Recordings
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Actions ({extractedActions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recording" className="space-y-4">
            {/* Quick Capture Interface */}
            <QuickCaptureRecorder 
              onComplete={(data) => {
                setLastMeetingId(data.meetingId);
                setLastActionsCount(data.actionsCount);
                setShowResults(true);
                fetchExtractedActions(); // Refresh actions
              }}
            />
            
            {/* Benefits Cards - Only show for first-time users */}
            {!hasCompletedFirstRecording && (
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-memory-emerald-50 to-brain-health-50">
                  <Heart className="h-6 w-6 mx-auto mb-2 text-memory-emerald-600" />
                  <h3 className="font-medium text-memory-emerald-900">Capture Commitments</h3>
                  <p className="text-xs text-memory-emerald-700">AI captures every promise you make</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-brain-health-50 to-clarity-teal-50">
                  <Target className="h-6 w-6 mx-auto mb-2 text-brain-health-600" />
                  <h3 className="font-medium text-brain-health-900">Track Progress</h3>
                  <p className="text-xs text-brain-health-700">See immediate ACT results</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-clarity-teal-50 to-sunrise-amber-50">
                  <Zap className="h-6 w-6 mx-auto mb-2 text-clarity-teal-600" />
                  <h3 className="font-medium text-clarity-teal-900">Build Trust</h3>
                  <p className="text-xs text-clarity-teal-700">Show others you keep your word</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recordings" className="space-y-4">
            <RecordingsTab 
              onProcessComplete={(meetingId, actionsCount) => {
                setLastMeetingId(meetingId);
                setLastActionsCount(actionsCount);
                setShowResults(true);
              }}
            />
          </TabsContent>

            <TabsContent value="actions" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Smart Actions Dashboard</h3>
                  <p className="text-muted-foreground">
                    AI-extracted commitments from all your conversations - ready to schedule.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleBackfillExtraction}
                  disabled={isProcessing}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Re-extract Past Recordings
                </Button>
              </div>
              
              <ActsReviewTable
                actions={extractedActions}
                onUpdateAction={handleUpdateAction}
                onConfirmActions={handleConfirmActions}
              />
            </TabsContent>
        </Tabs>

        {/* Legacy Recording Interface - Hidden for streamlined experience */}
        {showFirstRecording && (
          <MemoryBridgeRecorder 
            open={showFirstRecording}
            onClose={() => setShowFirstRecording(false)}
            meetingData={{
              meeting_title: hasCompletedFirstRecording ? 'Memory Bridge Recording' : 'Your First Memory Bridge Recording',
              participants: []
            }}
            onComplete={handleRecordingComplete} 
          />
        )}

        {/* Progressive Unlock Cards */}
        {hasCompletedFirstRecording && (
          <div className="space-y-4">
            {/* Calendar Unlock */}
            {recordingCount >= 1 && recordingCount < 3 && (
              <Card className="border-2 border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50 to-brain-health-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-memory-emerald-800">🎉 Calendar Unlocked!</h3>
                      <p className="text-memory-emerald-700">Plan your commitments with your personal calendar</p>
                    </div>
                    <Button onClick={handleUnlockCalendar} className="bg-memory-emerald-600 hover:bg-memory-emerald-700">
                      Open Calendar <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dashboard Unlock */}
            {recordingCount >= 3 && (
              <Card className="border-2 border-brain-health-200 bg-gradient-to-r from-brain-health-50 to-clarity-teal-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-brain-health-800">🚀 Full Dashboard Unlocked!</h3>
                      <p className="text-brain-health-700">Access all MyRhythm features and advanced analytics</p>
                    </div>
                    <Button onClick={handleUnlockDashboard} className="bg-brain-health-600 hover:bg-brain-health-700">
                      Open Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Results Modal */}
        <MemoryBridgeResultsModal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          meetingId={lastMeetingId}
          actionsFound={lastActionsCount}
          summary={lastSummary}
        />
        </div>
      </div>
    </MVPThemeWrapper>
  );
}