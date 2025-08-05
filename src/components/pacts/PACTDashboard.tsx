import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemoryBridge } from '@/hooks/useMemoryBridge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { ExtractedActionsReview } from '@/components/memoryBridge/ExtractedActionsReview';
import { QuickRecordButton } from '@/components/memoryBridge/QuickRecordButton';
import { PACTSchedulingInterface } from './PACTSchedulingInterface';
import { PACTBatchOperations } from './PACTBatchOperations';
import { PACTCrossDeviceSync } from './PACTCrossDeviceSync';
import { DemoModeToggle } from '@/components/demo/DemoModeToggle';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Mic, 
  Calendar,
  Users,
  BarChart3,
  Zap,
  Target
} from 'lucide-react';

export function PACTDashboard() {
  const { extractedActions, isRecording } = useMemoryBridge();
  const { tier } = useSubscription();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    total: extractedActions.length,
    completed: extractedActions.filter(a => a.status === 'completed').length,
    pending: extractedActions.filter(a => a.status === 'pending').length,
    highPriority: extractedActions.filter(a => a.priority_level > 7).length,
    thisWeek: extractedActions.filter(a => {
      const actionDate = new Date(a.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return actionDate >= weekAgo;
    }).length
  };

  const trustScore = Math.round(
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Demo Mode Toggle */}
        <DemoModeToggle />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              PACTs Dashboard
            </h1>
            <p className="text-muted-foreground">Personal Accountability & Commitment Tracking</p>
          </div>
          
          <div className="flex items-center gap-4">
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <Mic className="h-3 w-3 mr-1" />
                Recording Active
              </Badge>
            )}
            
            <Badge 
              variant={trustScore >= 80 ? "default" : trustScore >= 60 ? "secondary" : "destructive"}
              className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800"
            >
              <Target className="h-3 w-3 mr-1" />
              Trust Score: {trustScore}%
            </Badge>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
                <p className="text-sm text-purple-700">Total PACTs</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-sm text-green-700">Completed</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                <p className="text-sm text-orange-700">Pending</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
                <p className="text-sm text-red-700">High Priority</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.thisWeek}</div>
                <p className="text-sm text-blue-700">This Week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Bar */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <QuickRecordButton />
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule PACT
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Batch Confirm
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>3-click access active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Review
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Batch Ops
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Cross-Device
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Recent PACTs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {extractedActions.slice(0, 5).map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{action.action_text}</p>
                          <p className="text-xs text-muted-foreground">
                            Priority: {action.priority_level}/10
                          </p>
                        </div>
                        <Badge 
                          variant={action.status === 'completed' ? "default" : 
                                  action.status === 'pending' ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {action.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    High Priority Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {extractedActions
                      .filter(a => a.priority_level > 7)
                      .slice(0, 5)
                      .map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{action.action_text}</p>
                          <p className="text-xs text-red-600">
                            Urgency Level: {action.priority_level}/10
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Schedule Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6 mt-6">
            <ExtractedActionsReview />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6 mt-6">
            <PACTSchedulingInterface />
          </TabsContent>

          <TabsContent value="batch" className="space-y-6 mt-6">
            <PACTBatchOperations />
          </TabsContent>

          <TabsContent value="sync" className="space-y-6 mt-6">
            <PACTCrossDeviceSync />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}