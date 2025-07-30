import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TodayQuadrant } from "./quadrants/TodayQuadrant";
import { ThisWeekQuadrant } from "./quadrants/ThisWeekQuadrant";
import { ThisMonthQuadrant } from "./quadrants/ThisMonthQuadrant";
import { ThisYearQuadrant } from "./quadrants/ThisYearQuadrant";
import { GoalsOverview } from "./GoalsOverview";
import { ClinicalViewToggle } from "../clinical/ClinicalViewToggle";
import { ClinicalMetrics } from "../clinical/ClinicalMetrics";
import { SupportCirclePresence } from "../support/SupportCirclePresence";
import { EncouragementMessages } from "../support/EncouragementMessages";
import { Calendar, Target, TrendingUp, Star, ChevronDown } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";
import { useSupportCircleMessaging } from "@/hooks/use-support-circle-messaging";

export function CommandCenterLayout() {
  const { data: metrics, refetch } = useDashboardMetrics();
  const { unreadCount } = useSupportCircleMessaging();
  const [isClinicalView, setIsClinicalView] = useState(false);
  
  // TODO: Get user role from auth context or props
  const userRole = 'clinical'; // This would come from user authentication

  // Mock clinical data - would come from actual metrics in real implementation
  const clinicalData = {
    cognitiveScore: 47,
    functionalLevel: 3,
    adherenceRate: 78,
    progressTrend: 'improving' as const,
    riskLevel: 'moderate' as const,
    lastAssessment: '2024-01-15'
  };

  // Mock support circle data - would come from database in real implementation
  const supportMembers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse/Partner',
      role: 'supporter' as const,
      isOnline: true,
      canReceiveAlerts: true
    },
    {
      id: '2', 
      name: 'Dr. Michael Chen',
      relationship: 'Neurologist',
      role: 'medical' as const,
      isOnline: false,
      lastSeen: '2 hours ago',
      canReceiveAlerts: true
    },
    {
      id: '3',
      name: 'Emma Wilson',
      relationship: 'Daughter',
      role: 'supporter' as const,
      isOnline: true,
      canReceiveAlerts: false
    }
  ];

  const encouragementMessages = [
    {
      id: '1',
      message: "I'm so proud of how you tackled your daily goals today! Your determination inspires me every day.",
      senderName: 'Sarah',
      senderRelationship: 'Spouse',
      timestamp: '2 hours ago',
      type: 'celebration' as const
    },
    {
      id: '2',
      message: "Your progress in cognitive exercises is remarkable. Keep up the excellent work!",
      senderName: 'Dr. Chen',
      senderRelationship: 'Neurologist',
      timestamp: 'Yesterday',
      type: 'milestone' as const
    }
  ];

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="space-y-8">
      {/* Clinical View Toggle */}
      <ClinicalViewToggle 
        isClinicalView={isClinicalView}
        onToggle={setIsClinicalView}
        userRole={userRole}
      />

      {/* Hub Header - Dynamic based on view */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
          {isClinicalView ? 'Patient Progress Dashboard' : 'Today I\'m In Control'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isClinicalView 
            ? 'Comprehensive clinical assessment and progress tracking for evidence-based care'
            : 'Your personal empowerment space where every small step builds your strength and confidence'
          }
        </p>
      </div>

      {/* Clinical Metrics - Only show in clinical view */}
      {isClinicalView && (
        <ClinicalMetrics data={clinicalData} />
      )}

      {/* Empowerment Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-blue-50/80 rounded-full border-2 border-emerald-200/50 shadow-lg backdrop-blur-sm">
          <Badge variant="default" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700">
            <Calendar className="h-4 w-4" />
            Right Now
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 border-teal-300 text-teal-700 hover:bg-teal-50">
            <Target className="h-4 w-4" />
            This Week
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 border-blue-300 text-blue-700 hover:bg-blue-50">
            <TrendingUp className="h-4 w-4" />
            This Month
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 border-amber-300 text-amber-700 hover:bg-amber-50">
            <Star className="h-4 w-4" />
            This Year
          </Badge>
        </div>
      </div>

      {/* Empowerment Quadrants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Power Today */}
        <Card className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border-2 border-emerald-200/60 shadow-lg hover:shadow-xl transition-all overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 bg-emerald-100 rounded-xl shadow-sm">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">
                My Power Today
              </span>
              <Badge variant="default" className="ml-auto bg-emerald-600 hover:bg-emerald-700">I'm Ready</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TodayQuadrant />
          </CardContent>
        </Card>

        {/* Building Strength This Week */}
        <Card className="bg-gradient-to-br from-teal-50/80 to-blue-50/80 border-2 border-teal-200/60 shadow-lg hover:shadow-xl transition-all overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 bg-teal-100 rounded-xl shadow-sm">
                <Target className="h-6 w-6 text-teal-600" />
              </div>
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent font-bold">
                Building My Strength
              </span>
              <Badge variant="outline" className="ml-auto border-teal-300 text-teal-700">7 Days of Growth</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThisWeekQuadrant />
          </CardContent>
        </Card>

        {/* Growing Confidence This Month */}
        <Collapsible defaultOpen={false}>
          <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-2 border-blue-200/60 shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-4 cursor-pointer hover:bg-blue-50/60 transition-colors bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                    Growing My Confidence
                  </span>
                  <Badge variant="outline" className="ml-auto mr-2 border-blue-300 text-blue-700">
                    {metrics?.monthlyMetrics.activeDays || 0}/30 Days of Progress
                  </Badge>
                  <ChevronDown className="h-4 w-4 text-blue-600 transition-transform duration-200" />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <ThisMonthQuadrant />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Transforming My Life This Year */}
        <Collapsible defaultOpen={false}>
          <Card className="bg-gradient-to-br from-amber-50/80 to-yellow-50/80 border-2 border-amber-200/60 shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-4 cursor-pointer hover:bg-amber-50/60 transition-colors bg-gradient-to-r from-amber-500/10 to-yellow-500/10">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-amber-100 rounded-xl shadow-sm">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent font-bold">
                    Transforming My Life
                  </span>
                  <Badge variant="outline" className="ml-auto mr-2 border-amber-300 text-amber-700">
                    {metrics?.yearlyMetrics.daysCompleted || 0}/365 Days of Change
                  </Badge>
                  <ChevronDown className="h-4 w-4 text-amber-600 transition-transform duration-200" />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <ThisYearQuadrant />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Support Circle Integration - Only show in empowerment view */}
      {!isClinicalView && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Support Circle Presence */}
          <SupportCirclePresence 
            members={supportMembers}
            onSendMessage={(memberId) => console.log('Send message to:', memberId)}
            onToggleAlerts={(memberId) => console.log('Toggle alerts for:', memberId)}
          />
          
          {/* Encouragement Messages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              💝 Messages of Strength
            </h3>
            <EncouragementMessages messages={encouragementMessages} />
          </div>
        </div>
      )}

      {/* Goals Overview */}
      <GoalsOverview />
    </div>
  );
}