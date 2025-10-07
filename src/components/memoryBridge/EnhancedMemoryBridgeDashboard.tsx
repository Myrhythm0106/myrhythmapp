import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { DailyBrief } from './DailyBrief';
import { QuickCaptureRecorder } from './QuickCaptureRecorder';
import { ActsReviewTable } from './ActsReviewTable';
import { RecordingsTab } from './RecordingsTab';
import { TranscriptsTab } from './TranscriptsTab';
import { ConfidenceScore } from './ConfidenceScore';
import { MicroCoaching } from './MicroCoaching';
import { NextStepsHub } from '../nextStepsHub/NextStepsHub';
import { MemoryBridgeSetupHub } from '../memory-bridge/MemoryBridgeSetupHub';
import { EcosystemFlowWidget } from '../ecosystem/EcosystemFlowWidget';
import { AnnualCompassWidget } from '../ecosystem/AnnualCompassWidget';
import { FirstTimeTutorialOverlay } from './FirstTimeTutorialOverlay';
import { FirstCaptureSuccessModal } from './FirstCaptureSuccessModal';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useEmpowerment } from '@/contexts/EmpowermentContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Brain, 
  Zap,
  Target,
  Trophy,
  ArrowRight,
  CheckSquare,
  Clock,
  CheckCircle,
  Sparkles,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function EnhancedMemoryBridgeDashboard() {
  const { 
    extractedActions, 
    fetchExtractedActions, 
    confirmAction,
    isProcessing,
    updateExtractedAction,
    isRecording
  } = useMemoryBridge();
  
  const { dailyStatement, refreshStatement } = useEmpowerment();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFirstTime = searchParams.get('firstTime') === 'true';
  
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showFirstCaptureModal, setShowFirstCaptureModal] = useState(false);
  const [firstCaptureResults, setFirstCaptureResults] = useState<{
    actionCount: number;
    appointmentCount: number;
    suggestionCount: number;
  } | null>(null);
  const [lastExtractionData, setLastExtractionData] = useState<{
    confidenceScore: number;
    actionsCount: number;
    processingMethod: string;
  } | null>(null);
  const [todaysActions, setTodaysActions] = useState<any[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [coachingStage, setCoachingStage] = useState<'pre-recording' | 'during-recording' | 'post-extraction' | null>(null);

  // Get Word of the Month
  const getWordOfTheMonth = () => {
    const monthlyWords = [
      'FRESH', 'BOLD', 'FLOURISH', 'BRIGHT', 'BLOOM', 'RADIANT',
      'VIBRANT', 'FIERCE', 'GRATEFUL', 'POWERFUL', 'RESILIENT', 'TRIUMPHANT'
    ];
    return monthlyWords[new Date().getMonth()];
  };

  const wordOfTheMonth = getWordOfTheMonth();

  // Check if user is returning (has previous actions)
  const isReturningUser = extractedActions.length > 0;

  // Load user data on mount
  useEffect(() => {
    if (user) {
      console.log('EnhancedMemoryBridgeDashboard: Loading dashboard data for user:', user.id);
      loadUserDashboardData();
    }
  }, [user]);

  // Show tutorial on first time
  useEffect(() => {
    if (isFirstTime) {
      setShowQuickCapture(true);
      setTimeout(() => setShowTutorial(true), 500);
    }
  }, [isFirstTime]);

  const loadUserDashboardData = async () => {
    try {
      console.log('EnhancedMemoryBridgeDashboard: Starting dashboard data load');
      
      // Fetch extracted actions first
      await fetchExtractedActions();
      
      // Get today's scheduled actions
      const today = new Date().toISOString().split('T')[0];
      console.log('EnhancedMemoryBridgeDashboard: Fetching daily actions for date:', today);
      
      const { data: dailyActions, error: dailyActionsError } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today);
      
      if (dailyActionsError) {
        console.error('EnhancedMemoryBridgeDashboard: Error fetching daily actions:', dailyActionsError);
        toast.error('Failed to load today\'s actions');
      } else if (dailyActions) {
        console.log('EnhancedMemoryBridgeDashboard: Loaded daily actions count:', dailyActions.length);
        setTodaysActions(dailyActions);
        const completed = dailyActions.filter(a => a.status === 'completed').length;
        setCompletedToday(completed);
      }

      // Get streak data
      console.log('EnhancedMemoryBridgeDashboard: Fetching streak data');
      const { data: streakData, error: streakError } = await supabase
        .from('daily_win_streaks')
        .select('current_streak')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (streakError) {
        console.error('EnhancedMemoryBridgeDashboard: Error fetching streak data:', streakError);
      } else if (streakData) {
        console.log('EnhancedMemoryBridgeDashboard: Current streak:', streakData.current_streak);
        setStreakCount(streakData.current_streak);
      }
      
      console.log('EnhancedMemoryBridgeDashboard: Dashboard data load complete');
    } catch (error) {
      console.error('EnhancedMemoryBridgeDashboard: Error in loadUserDashboardData:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleStartRecording = () => {
    setShowQuickCapture(true);
    setCoachingStage('pre-recording');
  };

  const handleRecordingStart = () => {
    setCoachingStage('during-recording');
  };

  const handleRecordingComplete = (data: any) => {
    setShowQuickCapture(false);
    setLastExtractionData({
      confidenceScore: data.confidenceScore || 75,
      actionsCount: data.actionsCount || 0,
      processingMethod: data.processingMethod || 'openai'
    });
    setCoachingStage('post-extraction');
    fetchExtractedActions();
    
    // Check if this is first capture and show celebration modal
    const hasHadFirstCapture = localStorage.getItem('myrhythm_first_capture_complete');
    if (!hasHadFirstCapture && isFirstTime) {
      setFirstCaptureResults({
        actionCount: data.actionsCount || 0,
        appointmentCount: Math.floor((data.actionsCount || 0) / 2), // Estimate
        suggestionCount: data.actionsCount || 0
      });
      setShowFirstCaptureModal(true);
      localStorage.setItem('myrhythm_first_capture_complete', 'true');
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
    toast.success('Actions confirmed and scheduled!');
  };

  // First-time user welcome screen
  const FirstTimeWelcome = () => (
    <div className="text-center space-y-6 py-8">
      {/* Word of the Month */}
      <div className="mb-8">
        <Badge className="bg-gradient-to-r from-memory-emerald-100 to-brain-health-100 text-memory-emerald-900 text-lg px-4 py-2 mb-4">
          <Sparkles className="h-4 w-4 mr-2" />
          Word of the Month
        </Badge>
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 mb-4">
          {wordOfTheMonth}
        </h1>
      </div>

      {/* IChoose Statement */}
      {dailyStatement && (
        <Card className="max-w-2xl mx-auto border-brain-health-200 bg-gradient-to-r from-brain-health-50 to-clarity-teal-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Target className="h-5 w-5 text-brain-health-600" />
              <h3 className="font-semibold text-brain-health-900">Today's Empowerment</h3>
            </div>
            <p className="text-xl text-brain-health-800 font-medium leading-relaxed">
              {dailyStatement.text}
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={refreshStatement}
              className="mt-3 text-brain-health-600 hover:text-brain-health-800"
            >
              <Target className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Welcome Message */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-memory-emerald-600" />
          <h2 className="text-3xl font-bold text-memory-emerald-900">
            Welcome to Memory Bridge!
          </h2>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Your personal AI assistant for capturing commitments and turning them into scheduled actions.
          Start with a 30-second recording and watch the magic happen.
        </p>
        
        <Button
          onClick={handleStartRecording}
          size="lg"
          className="bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 text-white px-8 py-4 text-lg"
        >
          <Zap className="h-6 w-6 mr-2" />
          Record Your First Conversation
          <ArrowRight className="h-6 w-6 ml-2" />
        </Button>
      </div>

      {/* Benefits Preview */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
        <Card className="text-center p-6 border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50 to-brain-health-50">
          <CheckCircle className="h-8 w-8 mx-auto mb-3 text-memory-emerald-600" />
          <h3 className="font-semibold text-memory-emerald-900 mb-2">Capture Commitments</h3>
          <p className="text-sm text-memory-emerald-700">AI extracts every promise and commitment from your conversations</p>
        </Card>
        <Card className="text-center p-6 border-brain-health-200 bg-gradient-to-br from-brain-health-50 to-clarity-teal-50">
          <Calendar className="h-8 w-8 mx-auto mb-3 text-brain-health-600" />
          <h3 className="font-semibold text-brain-health-900 mb-2">Smart Scheduling</h3>
          <p className="text-sm text-brain-health-700">Get suggested dates and one-click calendar integration</p>
        </Card>
        <Card className="text-center p-6 border-clarity-teal-200 bg-gradient-to-br from-clarity-teal-50 to-sunrise-amber-50">
          <Trophy className="h-8 w-8 mx-auto mb-3 text-clarity-teal-600" />
          <h3 className="font-semibold text-clarity-teal-900 mb-2">Build Trust</h3>
          <p className="text-sm text-clarity-teal-700">Show others you keep your word with shared accountability</p>
        </Card>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6 p-6">
        <>
          {/* Micro-coaching */}
          {coachingStage && (
            <MicroCoaching 
              stage={coachingStage}
              actionsCount={lastExtractionData?.actionsCount || 0}
              onDismiss={() => setCoachingStage(null)}
            />
          )}

          {/* Main Content */}
          <Tabs defaultValue={isReturningUser ? "brief" : "nextsteps"} className="w-full">
                <TabsList className={`grid w-full ${!isReturningUser ? 'grid-cols-8' : 'grid-cols-7'}`}>
                  {!isReturningUser && (
                    <TabsTrigger value="welcome">
                      <Sparkles className="h-4 w-4 mr-1" />
                      Welcome
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="brief">Daily Brief</TabsTrigger>
                  <TabsTrigger value="nextsteps">
                    <Target className="h-4 w-4 mr-1" />
                    Next Steps Hub ({extractedActions.length})
                  </TabsTrigger>
                  <TabsTrigger value="recording">Capture</TabsTrigger>
                  <TabsTrigger value="actions">Review Actions</TabsTrigger>
                  <TabsTrigger value="setup">Setup Hub</TabsTrigger>
                  <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
                  <TabsTrigger value="recordings">History</TabsTrigger>
                </TabsList>

                {!isReturningUser && (
                  <TabsContent value="welcome" className="space-y-4">
                    <FirstTimeWelcome />
                  </TabsContent>
                )}

                <TabsContent value="brief" className="space-y-4">
                  <DailyBrief
                    userName={user?.email?.split('@')[0]}
                    todaysActions={todaysActions}
                    completedToday={completedToday}
                    streakCount={streakCount}
                    onQuickCapture={handleStartRecording}
                  />
                  
                  {/* Ecosystem Integration */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <EcosystemFlowWidget />
                    <AnnualCompassWidget />
                  </div>
                </TabsContent>

                <TabsContent value="nextsteps" className="space-y-4">
                  <NextStepsHub />
                </TabsContent>

                <TabsContent value="recording" className="space-y-4">
                  <QuickCaptureRecorder 
                    onComplete={handleRecordingComplete}
                  />
                  
                  {lastExtractionData && (
                    <ConfidenceScore
                      score={lastExtractionData.confidenceScore}
                      actionsCount={lastExtractionData.actionsCount}
                      processingMethod={lastExtractionData.processingMethod as any}
                    />
                  )}
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <ActsReviewTable
                    actions={extractedActions}
                    onUpdateAction={updateExtractedAction}
                    onConfirmActions={handleConfirmActions}
                  />
                </TabsContent>

                <TabsContent value="setup" className="space-y-4">
                  <MemoryBridgeSetupHub onComplete={() => setCoachingStage('post-extraction')} />
                </TabsContent>

                <TabsContent value="transcripts" className="space-y-4">
                  <TranscriptsTab />
                </TabsContent>

                <TabsContent value="recordings" className="space-y-4">
                  <RecordingsTab 
                    onProcessComplete={(meetingId, actionsCount) => {
                      setLastExtractionData({
                        confidenceScore: 80,
                        actionsCount,
                        processingMethod: 'openai'
                      });
                    }}
                  />
                </TabsContent>
              </Tabs>

            {/* Quick Capture Modal */}
            {showQuickCapture && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Quick Capture</h2>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowQuickCapture(false)}
                      >
                        ✕
                      </Button>
                    </div>
                    <QuickCaptureRecorder 
                      onComplete={handleRecordingComplete}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tutorial Modal */}
            {showTutorial && (
              <FirstTimeTutorialOverlay 
                onStart={() => {
                  setShowTutorial(false);
                  handleStartRecording();
                }}
                onSkip={() => setShowTutorial(false)}
              />
            )}

            {/* First Capture Success Modal */}
            {showFirstCaptureModal && firstCaptureResults && (
              <FirstCaptureSuccessModal 
                results={firstCaptureResults}
                onViewSuggestions={() => {
                  setShowFirstCaptureModal(false);
                  // Navigate to next steps hub or actions tab
                }}
                onClose={() => setShowFirstCaptureModal(false)}
              />
            )}

            {/* Progressive Unlock Messages */}
            {extractedActions.length === 1 && !showFirstCaptureModal && (
              <Card className="border-2 border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50 to-brain-health-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-memory-emerald-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-memory-emerald-800">First Action Captured!</h3>
                        <p className="text-memory-emerald-700">Calendar integration unlocked - schedule your commitments</p>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/calendar')} className="bg-memory-emerald-600 hover:bg-memory-emerald-700">
                      Open Calendar <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        
        </div>
      </div>
    </ErrorBoundary>
  );
}