import React, { useState } from "react";
import { PeriodSwitcher } from "./PeriodSwitcher";
import { MetricColumn } from "./MetricColumn";
import { MetricCard } from "./MetricCard";
import { useDashboardInsights, TimeFrame } from "@/hooks/useDashboardInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, Brain } from "lucide-react";
import { PriorityProgressTracker } from "../PriorityProgressTracker";
import { PriorityAlignmentCard } from "../PriorityAlignmentCard";
import { TimeScope } from "@/contexts/PriorityContext";

export function DashboardPeriodView() {
  const [currentPeriod, setCurrentPeriod] = useState<TimeFrame>('month');
  const insights = useDashboardInsights(currentPeriod);
  
  // Convert TimeFrame to TimeScope for priority context
  const currentScope: TimeScope = currentPeriod === 'day' ? 'daily' : 
                                   currentPeriod === 'week' ? 'weekly' :
                                   currentPeriod === 'month' ? 'monthly' : 'yearly';

  if (insights.isLoading) {
    return (
      <Card className="premium-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-brain-health-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading your insights...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.error) {
    return (
      <Card className="premium-card border-sunrise-amber-200">
        <CardContent className="flex items-center gap-3 py-6 text-sunrise-amber-700">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{insights.error}</span>
        </CardContent>
      </Card>
    );
  }

  const getPeriodTitle = () => {
    const titles = {
      day: "Today's Empowerment",
      week: "This Week's Journey",
      month: "Monthly Transformation",
      year: "Annual Evolution"
    };
    return titles[currentPeriod];
  };

  const getPeriodDescription = () => {
    const descriptions = {
      day: "Your daily progress at a glance",
      week: "Building momentum, one week at a time",
      month: "Celebrating meaningful growth",
      year: "Witnessing your incredible transformation"
    };
    return descriptions[currentPeriod];
  };

  // Organize metrics into meaningful groups
  const coreMetrics = [insights.capture, insights.calendar];
  const connectionMetrics = [insights.supportCircle, insights.tracking];
  const progressMetrics = [insights.goals, insights.clarityIndex];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Period Header */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-6 w-6 text-brain-health-500" />
            <h2 className="text-3xl font-bold gradient-text-brand">
              {getPeriodTitle()}
            </h2>
          </div>
          <p className="text-brain-health-600 text-lg">
            {getPeriodDescription()}
          </p>
        </div>
        
        <PeriodSwitcher
          currentPeriod={currentPeriod}
          onPeriodChange={setCurrentPeriod}
          className="justify-center"
        />
      </div>

      {/* Clarity Index Spotlight */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <MetricCard 
            metric={insights.clarityIndex} 
            size="lg" 
            showDescription={true}
          />
        </div>
      </div>

      {/* Priority Progress Tracker - Full Width */}
      <PriorityProgressTracker />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Core Activities Column */}
        <MetricColumn
          title="Core Activities"
          metrics={coreMetrics}
        />
        
        {/* Connection & Wellbeing Column */}
        <MetricColumn
          title="Connection & Wellbeing"
          metrics={connectionMetrics}
        >
          <PriorityAlignmentCard currentTimeframe={currentScope} />
        </MetricColumn>
        
        {/* Progress & Growth Column */}
        <MetricColumn
          title="Progress & Growth"
          metrics={progressMetrics}
        />
        
      </div>

      {/* Empowering Footer Message */}
      <Card className="premium-card bg-gradient-to-br from-beacon-50 to-brain-health-50 border-beacon-200">
        <CardContent className="text-center py-6">
          <p className="text-brain-health-700 font-medium">
            Every data point represents your courage to grow. 
            <span className="gradient-text-brand font-semibold"> Keep building your remarkable story.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}