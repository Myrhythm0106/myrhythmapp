
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "./DashboardHeader";
import { TodayFocus } from "./TodayFocus";
import { UpcomingToday } from "./UpcomingToday";
import { RecentWins } from "./RecentWins";
import { TopPriorities } from "./TopPriorities";
import { MoodEnergySnapshot } from "./MoodEnergySnapshot";
import { BrainGameQuickStart } from "./BrainGameQuickStart";
import { TrialStatusCard } from "./TrialStatusCard";
import { DemoNavigation } from "../demo/DemoNavigation";
import { MorningRitualView } from "./views/MorningRitualView";
import { DailyIChooseWidget } from "./DailyIChooseWidget";
import { SmartNotificationEngine } from "./SmartNotificationEngine";
import { AssessmentUpgradeReminder } from "./AssessmentUpgradeReminder";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Star } from "lucide-react";

export function DashboardContent() {
  const [searchParams] = useSearchParams();
  const [showMorningRitual, setShowMorningRitual] = useState(false);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [dailyIntention, setDailyIntention] = useState('');
  const { metrics, getNextUnlock } = useUserProgress();

  useEffect(() => {
    // Check for onboarding completion
    if (searchParams.get('onboarding_complete') === 'true') {
      toast.success("🎉 Welcome to MyRhythm! Your personalized journey begins now.");
    }
    
    // Check for trial started
    if (searchParams.get('trial_started') === 'true') {
      toast.success("🚀 Your 7-day free trial has started! Explore all features.");
    }

    // Check if morning ritual is completed today
    const today = new Date().toDateString();
    const morningRitual = localStorage.getItem(`morning_ritual_${today}`);
    
    if (!morningRitual) {
      const hour = new Date().getHours();
      // Show morning ritual if it's morning and not completed
      if (hour >= 6 && hour <= 11) {
        setShowMorningRitual(true);
      }
    } else {
      const ritualData = JSON.parse(morningRitual);
      setEnergyLevel(ritualData.energyLevel);
      setDailyIntention(ritualData.intention);
    }
  }, [searchParams]);

  const handleUpgradeClick = () => {
    toast.success("Upgrade to Premium for unlimited #IChoose statements! 🚀");
  };

  const nextUnlock = getNextUnlock();

  // If morning ritual not completed and it's morning time, show morning ritual
  if (showMorningRitual) {
    return (
      <div className="space-y-6">
        <MorningRitualView />
        <SmartNotificationEngine 
          energyLevel={energyLevel || undefined}
          dailyIntention={dailyIntention}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      {/* Assessment Upgrade Reminder */}
      <AssessmentUpgradeReminder />
      
      {/* Progress & Unlock Status */}
      {metrics.engagementLevel !== 'advanced' && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Your Progress</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {metrics.readinessScore}/100 points
                </Badge>
              </div>
              
              {nextUnlock && (
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Target className="h-4 w-4" />
                    <span>Next: {nextUnlock.description}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.readinessScore}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Daily #IChoose Widget - Prominent placement */}
      <DailyIChooseWidget onUpgradeClick={handleUpgradeClick} />
      
      {/* Trial Status - Show prominently at top */}
      <TrialStatusCard />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <TodayFocus />
          <UpcomingToday />
        </div>
        
        <div className="space-y-6">
          <RecentWins />
          <TopPriorities />
          <MoodEnergySnapshot />
          <BrainGameQuickStart />
        </div>
      </div>
      
      {/* Smart Notification Engine */}
      <SmartNotificationEngine 
        energyLevel={energyLevel || undefined}
        dailyIntention={dailyIntention}
      />
      
      {/* Demo Navigation - Only show in development/demo mode */}
      {process.env.NODE_ENV === 'development' && <DemoNavigation />}
    </div>
  );
}
