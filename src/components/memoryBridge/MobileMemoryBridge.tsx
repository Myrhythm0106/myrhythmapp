import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { MobileInteractionGuide } from '@/components/dashboard/components/MobileInteractionGuide';
import { MobileExtractedActionsReview } from './mobile/MobileExtractedActionsReview';
import { MobileFamilyIntegration } from './mobile/MobileFamilyIntegration';
import { ConversationLifelines } from './ConversationLifelines';
import { CrisisPreventionSystem } from './CrisisPreventionSystem';
import { MemoryBridgeRecorder } from './MemoryBridgeRecorder';
import { MemoryBridgeFloatingButton } from './MemoryBridgeFloatingButton';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Brain, 
  Users, 
  MessageCircle, 
  Shield, 
  List, 
  Mic,
  Crown,
  Heart,
  Zap,
  Target,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const sections = [
  { id: 'actions', title: 'Actions', icon: List, component: MobileExtractedActionsReview },
  { id: 'family', title: 'Family', icon: Users, component: MobileFamilyIntegration },
  { id: 'lifelines', title: 'Lifelines', icon: MessageCircle, component: ConversationLifelines },
  { id: 'crisis', title: 'Prevention', icon: Shield, component: CrisisPreventionSystem },
  { id: 'record', title: 'Record', icon: Mic, component: MemoryBridgeRecorder }
];

export function MobileMemoryBridge() {
  const { extractedActions, currentMeeting, isRecording } = useMemoryBridge();
  const { hasFeature, tier } = useSubscription();
  const isMobile = useIsMobile();
  const [currentSection, setCurrentSection] = useState(0);
  
  const hasMemoryBridgeAccess = hasFeature('processRecording') || tier === 'premium' || tier === 'family';
  
  const stats = {
    totalCommitments: extractedActions.length,
    completedCommitments: extractedActions.filter(a => a.status === 'completed').length,
    pendingCommitments: extractedActions.filter(a => a.status === 'pending').length,
    highPriorityCommitments: extractedActions.filter(a => a.priority_level > 7).length
  };

  const handleRefresh = async () => {
    // Implement refresh logic here
    console.log('Refreshing Memory Bridge data...');
  };

  const handleSwipeLeft = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  if (!hasMemoryBridgeAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-4">
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Memory Bridge Premium
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Transform how you preserve relationships
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="text-center p-3 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
                  <Heart className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                  <h3 className="font-semibold text-sm text-purple-900">Never Forget</h3>
                  <p className="text-xs text-purple-700">AI captures every promise</p>
                </div>
                <div className="text-center p-3 border rounded-lg bg-gradient-to-br from-blue-50 to-teal-50">
                  <Users className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                  <h3 className="font-semibold text-sm text-blue-900">Family Integration</h3>
                  <p className="text-xs text-blue-700">Share with support circle</p>
                </div>
                <div className="text-center p-3 border rounded-lg bg-gradient-to-br from-teal-50 to-green-50">
                  <Shield className="h-6 w-6 mx-auto mb-1 text-teal-600" />
                  <h3 className="font-semibold text-sm text-teal-900">Crisis Prevention</h3>
                  <p className="text-xs text-teal-700">Prevent relationship stress</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  £19.99/month • 7-day free trial
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      <SwipeableContainer
        onSwipeLeft={currentSection < sections.length - 1 ? { 
          label: 'Next', 
          icon: <ChevronRight className="h-4 w-4" />, 
          color: '#6366f1',
          action: handleSwipeLeft
        } : undefined}
        onSwipeRight={currentSection > 0 ? { 
          label: 'Previous', 
          icon: <ChevronLeft className="h-4 w-4" />, 
          color: '#6366f1',
          action: handleSwipeRight
        } : undefined}
        onPullToRefresh={handleRefresh}
        enableHorizontalSwipe={true}
        enablePullToRefresh={true}
        className="min-h-screen"
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Memory Bridge
              </h1>
              <p className="text-sm text-muted-foreground">Never forget commitments</p>
            </div>
            
            <div className="flex items-center gap-2">
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse text-xs">
                  <Mic className="h-3 w-3 mr-1" />
                  Recording
                </Badge>
              )}
              
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>

          {/* Be Empowered Message */}
          <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold text-purple-900 mb-1">Be Empowered</h3>
                <p className="text-sm text-purple-700">
                  Your AI companion is preserving every important moment and commitment
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Today I am in Control */}
          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold text-green-900 mb-1">Today I am in Control</h3>
                <p className="text-sm text-green-700">
                  {stats.pendingCommitments} commitments to honor • {stats.completedCommitments} completed today
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Action Zone */}
          <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-orange-900 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Action Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <Mic className="h-3 w-3 mr-1" />
                  Start Recording
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <List className="h-3 w-3 mr-1" />
                  Review Actions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{stats.totalCommitments}</div>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{stats.completedCommitments}</div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">{stats.pendingCommitments}</div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{stats.highPriorityCommitments}</div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section Navigation */}
          <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
            <div className="flex items-center gap-2">
              {React.createElement(sections[currentSection].icon, { className: "h-5 w-5 text-primary" })}
              <span className="font-medium">{sections[currentSection].title}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {currentSection + 1} of {sections.length}
            </div>
          </div>

          {/* Current Section Content */}
          <div className="pb-6">
            <CurrentSectionComponent />
          </div>

          {/* Mobile Interaction Guide */}
          {isMobile && (
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground mb-2 font-medium">
                ✨ Enhanced Mobile Experience
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>👈👉 Swipe sections</div>
                <div>⬇️ Pull to refresh</div>
                <div>👆 Tap for details</div>
                <div>🔄 Auto-updates</div>
              </div>
            </div>
          )}
        </div>
      </SwipeableContainer>

      {/* Floating Action Button */}
      <MemoryBridgeFloatingButton />
    </div>
  );
}