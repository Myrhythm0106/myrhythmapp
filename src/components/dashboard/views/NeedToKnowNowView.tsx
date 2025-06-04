
import React from "react";
import { DailyCheckin } from "../DailyCheckin";
import { TodaysActions } from "../TodaysActions";
import { UpcomingReminders } from "../UpcomingReminders";
import { AssessmentHistoryWidget } from "../widgets/AssessmentHistoryWidget";
import { GoalDefinitionsWidget } from "../widgets/GoalDefinitionsWidget";

export function NeedToKnowNowView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TodaysActions />
      <GoalDefinitionsWidget />
      <DailyCheckin />
      <UpcomingReminders />
      <AssessmentHistoryWidget />
    </div>
  );
}
