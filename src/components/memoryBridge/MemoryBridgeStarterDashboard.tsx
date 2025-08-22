import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemoryBridgeRecorder } from './MemoryBridgeRecorder';
import { MemoryBridgeResultsModal } from './MemoryBridgeResultsModal';
import { ExtractedActionsReview } from './ExtractedActionsReview';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useAuth } from '@/contexts/AuthContext';
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
  CheckSquare
} from 'lucide-react';
import { MVPThemeWrapper } from '@/components/theme/MVPThemeWrapper';
import { MVPTopNav } from '@/components/mvp/MVPTopNav';
import { MVPPageHeader } from '@/components/mvp/MVPPageHeader';

export function MemoryBridgeStarterDashboard() {
  const { extractedActions, isRecording } = useMemoryBridge();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showFirstRecording, setShowFirstRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastMeetingId, setLastMeetingId] = useState<string>('');
  const [lastActionsCount, setLastActionsCount] = useState(0);
  const [lastSummary, setLastSummary] = useState<string>('');
  
  const hasCompletedFirstRecording = extractedActions.length > 0;
  const recordingCount = extractedActions.length;
  
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

  return (
    <MVPThemeWrapper>
      <MVPTopNav />
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6 p-6">
          {/* MVP Page Header */}
          <MVPPageHeader 
            title="Welcome to MyRhythm"
            subtitle="Let's start your journey with your first Memory Bridge recording"
          />

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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recording" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Recording
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Actions ({extractedActions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recording" className="space-y-4">
            {/* Main Action Card */}
            {!hasCompletedFirstRecording && !showFirstRecording && (
              <Card className="border-2 border-memory-emerald-200 bg-gradient-to-br from-white via-memory-emerald-50/50 to-brain-health-50/30">
                <CardHeader>
                  <CardTitle className="text-center text-2xl text-brain-health-900">Ready for Your First Recording?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-memory-emerald-50 to-brain-health-50">
                      <Heart className="h-8 w-8 mx-auto mb-2 text-memory-emerald-600" />
                      <h3 className="font-semibold text-memory-emerald-900">Capture Commitments</h3>
                      <p className="text-sm text-memory-emerald-700">AI captures every promise you make</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-brain-health-50 to-clarity-teal-50">
                      <Target className="h-8 w-8 mx-auto mb-2 text-brain-health-600" />
                      <h3 className="font-semibold text-brain-health-900">Track Progress</h3>
                      <p className="text-sm text-brain-health-700">See immediate ACT results</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-clarity-teal-50 to-sunrise-amber-50">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-clarity-teal-600" />
                      <h3 className="font-semibold text-clarity-teal-900">Build Trust</h3>
                      <p className="text-sm text-clarity-teal-700">Show others you keep your word</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button
                      onClick={handleStartFirstRecording}
                      size="lg"
                      className="bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 text-white px-8 py-4 text-lg"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Your First Recording
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                    <p className="text-sm text-brain-health-600 mt-2">
                      Takes just 2-3 minutes • Immediate results
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start New Recording Card for users who have completed first recording */}
            {hasCompletedFirstRecording && !showFirstRecording && (
              <Card className="border-2 border-memory-emerald-200 bg-gradient-to-br from-white via-memory-emerald-50/50 to-brain-health-50/30">
                <CardHeader>
                  <CardTitle className="text-center text-xl text-brain-health-900">Ready for Another Recording?</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-brain-health-700">Continue building your commitment tracker</p>
                  <Button
                    onClick={handleStartFirstRecording}
                    size="lg"
                    className="bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 text-white px-8 py-4"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start New Recording
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            {hasCompletedFirstRecording ? (
              <ExtractedActionsReview />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Actions Yet</h3>
                  <p className="text-muted-foreground">Complete your first recording to see your extracted actions here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Recording Interface */}
        <MemoryBridgeRecorder 
          open={showFirstRecording}
          onClose={() => setShowFirstRecording(false)}
          meetingData={{
            meeting_title: hasCompletedFirstRecording ? 'Memory Bridge Recording' : 'Your First Memory Bridge Recording',
            participants: []
          }}
          onComplete={handleRecordingComplete} 
        />

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