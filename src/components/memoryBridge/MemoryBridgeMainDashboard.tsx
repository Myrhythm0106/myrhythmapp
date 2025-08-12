import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FamilyIntegrationDashboard } from './FamilyIntegrationDashboard';
import { ConversationLifelines } from './ConversationLifelines';
import { CrisisPreventionSystem } from './CrisisPreventionSystem';
import { ExtractedActionsReview } from './ExtractedActionsReview';
import { MemoryBridgeRecorder } from './MemoryBridgeRecorder';
import { MemoryBridgeFloatingButton } from './MemoryBridgeFloatingButton';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { 
  Brain, 
  Users, 
  MessageCircle, 
  Shield, 
  List, 
  Mic,
  Crown,
  ArrowRight,
  Heart,
  Zap,
  Target
} from 'lucide-react';

export function MemoryBridgeMainDashboard() {
  const { extractedActions, currentMeeting, isRecording } = useMemoryBridge();
  const { hasFeature, tier } = useSubscription();
  const [activeTab, setActiveTab] = useState('actions');
  
  const hasMemoryBridgeAccess = tier === 'smart_pro' || tier === 'family_smart';
  
  const stats = {
    totalCommitments: extractedActions.length,
    completedCommitments: extractedActions.filter(a => a.status === 'completed').length,
    pendingCommitments: extractedActions.filter(a => a.status === 'pending').length,
    highPriorityCommitments: extractedActions.filter(a => a.priority_level > 7).length
  };

  if (!hasMemoryBridgeAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Memory Bridge Premium
              </CardTitle>
              <p className="text-lg text-muted-foreground">
                Transform how you preserve relationships and keep commitments
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">Never Forget</h3>
                  <p className="text-sm text-purple-700">AI captures every promise and commitment</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-teal-50">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Family Integration</h3>
                  <p className="text-sm text-blue-700">Share insights with your support circle</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-teal-50 to-green-50">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                  <h3 className="font-semibold text-teal-900">Crisis Prevention</h3>
                  <p className="text-sm text-teal-700">Prevent relationship stress before it happens</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold mb-3 text-purple-900">What You Get:</h3>
                <ul className="space-y-2 text-purple-800">
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    Unlimited AI-powered meeting recordings
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    Automatic commitment extraction and analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    Family dashboard with smart alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-purple-600" />
                    Conversation lifelines and context prompts
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    Crisis prevention and relationship protection
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Memory Bridge Premium
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  £19.99/month • Cancel anytime • 7-day free trial
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              Memory Bridge
            </h1>
            <p className="text-muted-foreground">Preserve relationships, never forget commitments</p>
          </div>
          
          <div className="flex items-center gap-4">
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <Mic className="h-3 w-3 mr-1" />
                Recording Active
              </Badge>
            )}
            
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
              <Crown className="h-3 w-3 mr-1" />
              Premium Active
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalCommitments}</div>
                <p className="text-sm text-muted-foreground">Total Commitments</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedCommitments}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.pendingCommitments}</div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.highPriorityCommitments}</div>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Family
            </TabsTrigger>
            <TabsTrigger value="lifelines" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Lifelines
            </TabsTrigger>
            <TabsTrigger value="crisis" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Prevention
            </TabsTrigger>
            <TabsTrigger value="record" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Record
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-6">
            <ExtractedActionsReview 
              meetingId="sample-meeting"
              actions={[
                {
                  id: '1',
                  type: 'awareness',
                  title: 'Family Communication',
                  content: 'I need to be more present during family conversations',
                  priority: 'high',
                  category: 'family',
                  emotionalWeight: 4,
                  status: 'pending'
                },
                {
                  id: '2', 
                  type: 'change',
                  title: 'Weekly Check-ins',
                  content: 'Start calling Mom every Sunday evening',
                  priority: 'high',
                  category: 'family',
                  deadline: 'This Sunday',
                  emotionalWeight: 5,
                  status: 'pending'
                },
                {
                  id: '3',
                  type: 'action',
                  title: 'Doctor Appointment',
                  content: 'Schedule follow-up appointment by Friday',
                  priority: 'high',
                  category: 'medical',
                  deadline: 'Friday',
                  emotionalWeight: 3,
                  status: 'pending'
                }
              ]}
              onActionConfirm={(actionId, status) => console.log('Action confirmed:', actionId, status)}
              onShareWithFamily={(actionId) => console.log('Share with family:', actionId)}
              tier="free"
            />
          </TabsContent>

          <TabsContent value="family" className="space-y-6">
            <FamilyIntegrationDashboard />
          </TabsContent>

          <TabsContent value="lifelines" className="space-y-6">
            <ConversationLifelines />
          </TabsContent>

          <TabsContent value="crisis" className="space-y-6">
            <CrisisPreventionSystem />
          </TabsContent>

           <TabsContent value="record" className="space-y-6">
            <MemoryBridgeRecorder onRecordingComplete={(result) => console.log('Recording completed:', result)} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <MemoryBridgeFloatingButton />
    </div>
  );
}