
import React from "react";
import { DailyCheckin } from "../DailyCheckin";
import { TodaysActions } from "../TodaysActions";
import { UpcomingReminders } from "../UpcomingReminders";
import { AssessmentHistoryWidget } from "../widgets/AssessmentHistoryWidget";
import { ActiveGoalsWidget } from "../widgets/ActiveGoalsWidget";
import { DynamicFocusAreaWidget } from "../widgets/DynamicFocusAreaWidget";
import { WelcomeCard } from "../WelcomeCard";
import { useUserData } from "@/hooks/use-user-data";
import { getCurrentFocusArea } from "@/utils/rhythmAnalysis";

export function NeedToKnowNowView() {
  const userData = useUserData();
  const currentFocusArea = getCurrentFocusArea();
  const hasCompletedSetup = localStorage.getItem("myrhythm_initial_setup_complete") === "true";
  
  // If user has completed assessment but not the personalization flow, prioritize focus area
  if (currentFocusArea && !hasCompletedSetup) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DynamicFocusAreaWidget />
        </div>
        <TodaysActions />
        <ActiveGoalsWidget />
        <DailyCheckin />
        <UpcomingReminders />
        <AssessmentHistoryWidget />
      </div>
    );
  }

  // If user has completed full setup, show personalized layout
  if (hasCompletedSetup && currentFocusArea) {
    const savedWidgets = JSON.parse(localStorage.getItem("myrhythm_dashboard_widgets") || "[]");
    const enabledWidgetIds = savedWidgets.map((w: any) => w.id);
    
    return (
      <div className="space-y-6">
        <DynamicFocusAreaWidget />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enabledWidgetIds.includes("todaysActions") && <TodaysActions />}
          {enabledWidgetIds.includes("activeGoals") && <ActiveGoalsWidget />}
          {enabledWidgetIds.includes("dailyCheckin") && <DailyCheckin />}
          {enabledWidgetIds.includes("upcomingReminders") && <UpcomingReminders />}
          {enabledWidgetIds.includes("assessmentHistory") && <AssessmentHistoryWidget />}
        </div>
      </div>
    );
  }

  // Default layout for new users or those without assessment
  return (
    <div className="space-y-6">
      <WelcomeCard name={userData.name} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TodaysActions />
        <ActiveGoalsWidget />
        <DailyCheckin />
        <UpcomingReminders />
        <AssessmentHistoryWidget />
      </div>
    </div>
  );
}
