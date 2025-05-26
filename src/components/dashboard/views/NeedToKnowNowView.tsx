
import React from "react";
import { TodayFocus } from "@/components/dashboard/TodayFocus";
import { UpcomingToday } from "@/components/dashboard/UpcomingToday";
import { RoutineCheckIn } from "@/components/dashboard/RoutineCheckIn";
import { MoodEnergySnapshot } from "@/components/dashboard/MoodEnergySnapshot";
import { BrainGameQuickStart } from "@/components/dashboard/BrainGameQuickStart";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";

export function NeedToKnowNowView() {
  return (
    <div className="space-y-6">
      {/* Urgent/Time-sensitive items */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <TodayFocus />
          <UpcomingToday />
        </div>
        <div className="space-y-4">
          <RoutineCheckIn />
          <MoodEnergySnapshot />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BrainGameQuickStart />
        
        {/* Quick reminder card */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-md mt-1">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-900 mb-1">Quick Reminder</h3>
              <p className="text-sm text-amber-800">
                Remember to take your evening medication and complete your gratitude practice before bed.
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-700">
                <Clock className="h-3 w-3" />
                <span>Due in 4 hours</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
