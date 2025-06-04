
import React from "react";
import { DailyCheckin } from "../DailyCheckin";
import { TodaysActions } from "../TodaysActions";
import { UpcomingReminders } from "../UpcomingReminders";
import { AssessmentHistoryWidget } from "../widgets/AssessmentHistoryWidget";
import { ActiveGoalsWidget } from "../widgets/ActiveGoalsWidget";

export function NeedToKnowNowView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TodaysActions />
      <ActiveGoalsWidget />
      <DailyCheckin />
      <UpcomingReminders />
      <AssessmentHistoryWidget />
    </div>
  );
}
