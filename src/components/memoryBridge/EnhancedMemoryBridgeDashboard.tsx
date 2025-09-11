import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyBrief } from './DailyBrief';
import { QuickCaptureRecorder } from './QuickCaptureRecorder';
import { ActsReviewTable } from './ActsReviewTable';
import { RecordingsTab } from './RecordingsTab';
import { ConfidenceScore } from './ConfidenceScore';
import { MicroCoaching } from './MicroCoaching';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useEmpowerment } from '@/contexts/EmpowermentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  
  const [showQuickCapture, setShowQuickCapture] = useState(false);
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
      loadUserDashboardData();
    }
  }, [user]);

  const loadUserDashboardData = async () => {
    await fetchExtractedActions();
    
    // Get today's scheduled actions
    const today = new Date().toISOString().split('T')[0];
    const { data: dailyActions } = await supabase
      .from('daily_actions')
      .select('*')
      .eq('user_id', user?.id)
      .eq('date', today);
    
    if (dailyActions) {
      setTodaysActions(dailyActions);
      const completed = dailyActions.filter(a => a.status === 'completed').length;
      setCompletedToday(completed);
    }

    // Get streak data
    const { data: streakData } = await supabase
      .from('daily_win_streaks')
      .select('current_streak')
      .eq('user_id', user?.id)
      .single();
    
    if (streakData) {
      setStreakCount(streakData.current_streak);
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
        <h2 className="text-3xl font-bold text-memory-emerald-900 mb-4">
          Welcome to Memory Bridge! 🎉
        </h2>
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
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        {!user && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Sign In Required</h3>
                  <p className="text-red-700">Sign in to access Memory Bridge</p>
                </div>
                <Button onClick={() => navigate('/auth')} className="bg-red-600 hover:bg-red-700">
                  Sign In / Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {user && (
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
            {isReturningUser ? (
              <Tabs defaultValue="brief" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="brief">Daily Brief</TabsTrigger>
                  <TabsTrigger value="recording">Record</TabsTrigger>
                  <TabsTrigger value="actions">
                    Actions ({extractedActions.length})
                  </TabsTrigger>
                  <TabsTrigger value="recordings">History</TabsTrigger>
                </TabsList>

                <TabsContent value="brief" className="space-y-4">
                  <DailyBrief
                    userName={user?.email?.split('@')[0]}
                    todaysActions={todaysActions}
                    completedToday={completedToday}
                    streakCount={streakCount}
                    onQuickCapture={handleStartRecording}
                  />
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
            ) : (
              <FirstTimeWelcome />
            )}

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

            {/* Progressive Unlock Messages */}
            {extractedActions.length === 1 && (
              <Card className="border-2 border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50 to-brain-health-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-memory-emerald-800">🎉 First Action Captured!</h3>
                      <p className="text-memory-emerald-700">Calendar integration unlocked - schedule your commitments</p>
                    </div>
                    <Button onClick={() => navigate('/calendar')} className="bg-memory-emerald-600 hover:bg-memory-emerald-700">
                      Open Calendar <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}