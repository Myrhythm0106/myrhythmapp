
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
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

export function DashboardContent() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for onboarding completion
    if (searchParams.get('onboarding_complete') === 'true') {
      toast.success("🎉 Welcome to MyRhythm! Your personalized journey begins now.");
    }
    
    // Check for trial started
    if (searchParams.get('trial_started') === 'true') {
      toast.success("🚀 Your 7-day free trial has started! Explore all features.");
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
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
    </div>
  );
}
