import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MemoryBridgeRecorder } from './MemoryBridgeRecorder';
import { MemoryBridgeResultsModal } from './MemoryBridgeResultsModal';
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
  Play
} from 'lucide-react';

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
  
  const handleRecordingComplete = (result: any) => {
    setShowFirstRecording(false);
    if (result && result.meetingId) {
      setLastMeetingId(result.meetingId);
      setLastActionsCount(result.actions_found || 0);
      setLastSummary(result.summary || '');
      setShowResults(true);
    }
  };
  
  const handleUnlockCalendar = () => {
    navigate('/calendar');
  };
  
  const handleUnlockDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Clean Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              Welcome to MyRhythm
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's start your journey with your first Memory Bridge recording
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="border-purple-200 bg-gradient-to-r from-white via-purple-50/30 to-blue-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{recordingCount}</div>
                  <p className="text-sm text-gray-600">Recordings</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {recordingCount >= 1 && (
                    <Badge className="bg-green-100 text-green-800">
                      <Trophy className="h-3 w-3 mr-1" />
                      First Win!
                    </Badge>
                  )}
                  
                  {recordingCount >= 3 && (
                    <Badge className="bg-purple-100 text-purple-800">
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

        {/* Main Action Card */}
        {!hasCompletedFirstRecording && !showFirstRecording && (
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/50 to-blue-50/30">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Ready for Your First Recording?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">Capture Commitments</h3>
                  <p className="text-sm text-purple-700">AI captures every promise you make</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-teal-50">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Track Progress</h3>
                  <p className="text-sm text-blue-700">See immediate ACT results</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-teal-50 to-green-50">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                  <h3 className="font-semibold text-teal-900">Build Trust</h3>
                  <p className="text-sm text-teal-700">Show others you keep your word</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button
                  onClick={handleStartFirstRecording}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Your First Recording
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Takes just 2-3 minutes • Immediate results
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recording Interface */}
        {showFirstRecording && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Your First Memory Bridge Recording</CardTitle>
            </CardHeader>
            <CardContent>
              <MemoryBridgeRecorder onComplete={handleRecordingComplete} />
            </CardContent>
          </Card>
        )}

        {/* Progressive Unlock Cards */}
        {hasCompletedFirstRecording && (
          <div className="space-y-4">
            {/* Calendar Unlock */}
            {recordingCount >= 1 && recordingCount < 3 && (
              <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">🎉 Calendar Unlocked!</h3>
                      <p className="text-green-700">Plan your commitments with your personal calendar</p>
                    </div>
                    <Button onClick={handleUnlockCalendar} className="bg-green-600 hover:bg-green-700">
                      Open Calendar <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dashboard Unlock */}
            {recordingCount >= 3 && (
              <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-800">🚀 Full Dashboard Unlocked!</h3>
                      <p className="text-purple-700">Access all MyRhythm features and advanced analytics</p>
                    </div>
                    <Button onClick={handleUnlockDashboard} className="bg-purple-600 hover:bg-purple-700">
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
  );
}