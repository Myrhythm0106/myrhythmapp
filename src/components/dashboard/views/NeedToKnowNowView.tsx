import React from "react";
import { DailyCheckin } from "../DailyCheckin";
import { TodaysActions } from "../TodaysActions";
import { UpcomingReminders } from "../UpcomingReminders";
import { AssessmentHistoryWidget } from "../widgets/AssessmentHistoryWidget";
import { ActiveGoalsWidget } from "../widgets/ActiveGoalsWidget";
import { DynamicFocusAreaWidget } from "../widgets/DynamicFocusAreaWidget";
import { WelcomeCard } from "../WelcomeCard";
import { PlanningSpotlight } from "../../planning/PlanningSpotlight";
import { PlanningOverview } from "../../planning/PlanningOverview";
import { useUserData } from "@/hooks/use-user-data";
import { getCurrentFocusArea } from "@/utils/rhythmAnalysis";

export function NeedToKnowNowView() {
  const userData = useUserData();
  const currentFocusArea = getCurrentFocusArea(userData.userType);
  const hasCompletedSetup = localStorage.getItem("myrhythm_initial_setup_complete") === "true";
  
  return (
    <div className="space-y-8">
      {/* Command Center Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded"></div>
          Your Command Center
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TodaysActions />
          <DailyCheckin />
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-teal-500 rounded"></div>
          Your Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActiveGoalsWidget />
          <AssessmentHistoryWidget />
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-green-500 rounded"></div>
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <UpcomingReminders />
        </div>
      </div>

      {/* Today's Focus Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-purple-500 rounded"></div>
          Today's Focus
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {currentFocusArea && <DynamicFocusAreaWidget />}
          <PlanningSpotlight />
          {!hasCompletedSetup && <WelcomeCard name={userData.name} />}
        </div>
      </div>
    </div>
  );
}
