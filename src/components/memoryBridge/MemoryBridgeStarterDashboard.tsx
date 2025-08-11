import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { SwipeHint } from '@/components/gratitude/journal/components/SwipeHint';
import { DailyIChooseWidget } from '@/components/dashboard/DailyIChooseWidget';
import { MonthlyTheme } from '@/components/dashboard/MonthlyTheme';
import { MemoryBridgeRecorder } from './MemoryBridgeRecorder';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { 
  Brain, 
  Mic, 
  Heart, 
  Users, 
  Shield, 
  Zap, 
  Target, 
  MessageCircle,
  Crown,
  ArrowRight,
  CheckCircle,
  Clock,
  PlayCircle,
  Calendar,
  Star,
  Trash2
} from 'lucide-react';

export function MemoryBridgeStarterDashboard() {
  const isMobile = useIsMobile();
  const [showRecorder, setShowRecorder] = useState(false);
  const [recordingCount, setRecordingCount] = useState(0);
  const [tier, setTier] = useState<'free' | 'taste-see' | 'pro'>('free');
  const [selectedSample, setSelectedSample] = useState(0);

  const freeTierLimits = {
    recordings: 3,
    maxDuration: 20, // minutes
    daysToDelete: 7
  };

  const handleUpgradeClick = () => {
    toast.info("Upgrade to unlock unlimited Memory Bridge sessions with family sharing!");
  };

  const handleQuickStart = () => {
    if (tier === 'free' && recordingCount >= freeTierLimits.recordings) {
      toast.error(`Free tier limit reached! You have ${freeTierLimits.recordings} recordings. Upgrade for unlimited.`);
      return;
    }
    setShowRecorder(true);
  };

  const handleSampleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && selectedSample < sampleResults.length - 1) {
      setSelectedSample(selectedSample + 1);
      toast.success("Next sample", { duration: 1000 });
    } else if (direction === 'right' && selectedSample > 0) {
      setSelectedSample(selectedSample - 1);
      toast.success("Previous sample", { duration: 1000 });
    }
  };

  const sampleResults = [
    {
      type: "Promise to Mom",
      content: "I'll call you every Sunday evening to check in",
      importance: "High emotional importance",
      category: "family",
      color: "from-green-50 to-blue-50"
    },
    {
      type: "Doctor's Appointment",
      content: "Schedule that follow-up appointment by Friday",
      importance: "Health priority",
      category: "medical",
      color: "from-orange-50 to-red-50"
    },
    {
      type: "Family Gathering",
      content: "Organize the family reunion for Dad's birthday next month",
      importance: "Shared responsibility",
      category: "planning",
      color: "from-purple-50 to-blue-50"
    }
  ];

  if (showRecorder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setShowRecorder(false)}
            className="mb-6"
          >
            ← Back to Dashboard
          </Button>
          <MemoryBridgeRecorder />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Empowerment Integration */}
        <div className="space-y-6">
          {/* Monthly Theme */}
          <MonthlyTheme />
          
          {/* Daily #IChoose Widget */}
          <DailyIChooseWidget 
            onUpgradeClick={handleUpgradeClick}
            userType="memory-focused"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Memory Bridge
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Transform conversations into commitments you'll keep
          </p>
          
          {/* Tier Status with Recording Limits */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
              {tier === 'free' ? 'Free Trial' : tier === 'taste-see' ? 'Taste & See' : 'Pro'} • {recordingCount}/{tier === 'free' ? freeTierLimits.recordings : '∞'} sessions
            </Badge>
            
            {tier === 'free' && recordingCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {freeTierLimits.daysToDelete} days until deletion
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Start with Swipe */}
        <SwipeableContainer
          enableHorizontalSwipe={isMobile}
          onSwipeLeft={tier === 'free' && recordingCount >= freeTierLimits.recordings ? {
            label: "Upgrade Now",
            icon: <Crown className="h-4 w-4" />,
            color: "#ef4444",
            action: handleUpgradeClick
          } : {
            label: "Start Recording",
            icon: <Mic className="h-4 w-4" />,
            color: "#22c55e",
            action: handleQuickStart
          }}
          onSwipeRight={tier === 'free' ? {
            label: "Save Forever",
            icon: <Star className="h-4 w-4" />,
            color: "#f59e0b",
            action: () => toast.info("Upgrade to save recordings permanently!")
          } : undefined}
          className="border-2 border-purple-200 rounded-lg"
        >
          <Card className="border-none bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-purple-900">
                Start Your First Empowerment Session
              </CardTitle>
              <p className="text-purple-700">
                Record conversations and transform them into commitments you'll actually keep
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg bg-white/50">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mic className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">1. Record</h3>
                  <p className="text-sm text-purple-700">Capture important conversations with family, friends, or healthcare providers</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg bg-white/50">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">2. Professional ACT Framework</h3>
                  <p className="text-sm text-blue-700">AI organizes your commitments using proven psychology frameworks</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg bg-white/50">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-teal-900 mb-2">3. Family Support</h3>
                  <p className="text-sm text-teal-700">Share with your Support Circle for accountability and encouragement</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <Button
                  onClick={handleQuickStart}
                  size="lg"
                  disabled={tier === 'free' && recordingCount >= freeTierLimits.recordings}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                >
                  <PlayCircle className="h-6 w-6 mr-2" />
                  {tier === 'free' && recordingCount >= freeTierLimits.recordings 
                    ? 'Upgrade to Continue' 
                    : 'Start Empowerment Session'
                  }
                </Button>
                
                {tier === 'free' && recordingCount > 0 && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    ⚠️ Your recordings will be deleted in {freeTierLimits.daysToDelete} days unless you upgrade
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </SwipeableContainer>

        {/* Mobile Swipe Hints */}
        {isMobile && (
          <div className="text-center">
            <SwipeHint isMobile={true} />
            <p className="text-xs text-muted-foreground mt-1">
              Swipe left to start • Swipe right to save forever
            </p>
          </div>
        )}

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Relationship Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-sm">Track promises to loved ones</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Shield className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Prevent relationship conflicts</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Never miss important commitments</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Family Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Share insights with care team</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="text-sm">AI-powered family alerts</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                <Target className="h-4 w-4 text-teal-500" />
                <span className="text-sm">Coordinated support system</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sample Results with Swipe Navigation */}
        <SwipeableContainer
          enableHorizontalSwipe={isMobile}
          onSwipeLeft={selectedSample < sampleResults.length - 1 ? {
            label: "Next Sample",
            icon: <ArrowRight className="h-4 w-4" />,
            color: "#3b82f6",
            action: () => handleSampleSwipe('left')
          } : undefined}
          onSwipeRight={selectedSample > 0 ? {
            label: "Previous Sample",
            icon: <ArrowRight className="h-4 w-4 rotate-180" />,
            color: "#3b82f6",
            action: () => handleSampleSwipe('right')
          } : undefined}
          className="border rounded-lg"
        >
          <Card className="border-none">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Professional ACT Framework Results
                <Badge variant="outline" className="text-xs">
                  {selectedSample + 1}/{sampleResults.length}
                </Badge>
              </CardTitle>
              <p className="text-muted-foreground">Real-world example from a family conversation</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`border rounded-lg p-4 bg-gradient-to-r ${sampleResults[selectedSample].color} animate-fade-in`}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-2">
                    {sampleResults[selectedSample].category === 'family' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {sampleResults[selectedSample].category === 'medical' && <Clock className="h-5 w-5 text-orange-500" />}
                    {sampleResults[selectedSample].category === 'planning' && <Users className="h-5 w-5 text-purple-500" />}
                    
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">{sampleResults[selectedSample].type}</p>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-blue-600">
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">"{sampleResults[selectedSample].content}"</p>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={sampleResults[selectedSample].category === 'medical' ? 'destructive' : 'secondary'} 
                        className="text-xs"
                      >
                        {sampleResults[selectedSample].importance}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Swipe for more examples →
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ACT Framework Preview */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 rounded text-xs">
                  <p className="font-medium text-blue-800">AWARENESS</p>
                  <p className="text-blue-600">What happened?</p>
                </div>
                <div className="p-2 bg-green-50 rounded text-xs">
                  <p className="font-medium text-green-800">CHANGE</p>
                  <p className="text-green-600">What will you do?</p>
                </div>
                <div className="p-2 bg-purple-50 rounded text-xs">
                  <p className="font-medium text-purple-800">TAKE ACTION</p>
                  <p className="text-purple-600">How will you track it?</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </SwipeableContainer>

        {/* Conversion Psychology Upgrade CTA */}
        <SwipeableContainer
          enableHorizontalSwipe={isMobile}
          onSwipeLeft={{
            label: "Upgrade Now",
            icon: <Crown className="h-4 w-4" />,
            color: "#8b5cf6",
            action: handleUpgradeClick
          }}
          onSwipeRight={tier === 'free' ? {
            label: "Delete Warning",
            icon: <Trash2 className="h-4 w-4" />,
            color: "#ef4444",
            action: () => toast.error(`⚠️ Your recordings will be permanently deleted in ${freeTierLimits.daysToDelete} days!`)
          } : undefined}
          className="border-2 border-purple-200 rounded-lg"
        >
          <Card className="border-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Your Family Trusts You to Remember</CardTitle>
              <p className="text-muted-foreground">Don't let memory failures damage your most important relationships</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 text-red-600">Free (Current)</h3>
                  <ul className="text-sm space-y-1 text-left">
                    <li>• Only 3 recordings</li>
                    <li>• {freeTierLimits.daysToDelete}-day deletion</li>
                    <li>• No family sharing</li>
                    <li>• Basic commitment tracking</li>
                  </ul>
                  {tier === 'free' && (
                    <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700">
                      ⏰ Recordings expire soon!
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Taste & See
                  </h3>
                  <ul className="text-sm space-y-1 text-left">
                    <li>• Unlimited 60min sessions</li>
                    <li>• Support Circle sharing</li>
                    <li>• Professional ACT framework</li>
                    <li>• Calendar integration</li>
                  </ul>
                  <Badge className="mt-2 bg-blue-600">Most Popular</Badge>
                </div>
                
                <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Pro
                  </h3>
                  <ul className="text-sm space-y-1 text-left">
                    <li>• Unlimited everything</li>
                    <li>• Family reliability dashboard</li>
                    <li>• Crisis prevention alerts</li>
                    <li>• Advanced relationship insights</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-medium text-purple-800 mb-2">
                  💡 Users complete 340% more commitments with Memory Bridge
                </p>
                <p className="text-xs text-purple-600">
                  "My family finally trusts me to follow through" - Sarah M.
                </p>
              </div>
              
              <Button
                onClick={handleUpgradeClick}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 w-full md:w-auto"
              >
                <Crown className="h-5 w-5 mr-2" />
                Unlock Family Trust
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                £9.99/month • 7-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </SwipeableContainer>
      </div>
    </div>
  );
}