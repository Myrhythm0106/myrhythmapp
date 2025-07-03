
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, Pill, Calendar, Target } from "lucide-react";
import { SpeechButton } from "@/components/ui/SpeechButton";
import { TBIReminderCard } from "@/components/reminders/TBIReminderCard";

export function EnhancedUpcomingReminders() {
  const reminders = [
    {
      id: "1",
      title: "Take morning medication",
      description: "Take your prescribed medication with food and water",
      type: "medication" as const,
      time: "9:00 AM",
      priority: "critical" as const,
      benefit: "supports your recovery and helps manage symptoms",
      goalConnection: "Daily health maintenance routine",
      isSticky: true
    },
    {
      id: "2", 
      title: "Walk to mailbox practice",
      description: "Practice walking to the front door first, then to the mailbox",
      type: "activity" as const,
      time: "2:00 PM",
      priority: "high" as const,
      benefit: "builds your strength and confidence for independent movement",
      goalConnection: "Walk to mailbox independently",
      visualAid: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=200&fit=crop"
    },
    {
      id: "3",
      title: "Evening wind-down routine",
      description: "Dim lights, prepare for sleep, take evening medication if needed",
      type: "activity" as const,
      time: "7:00 PM", 
      priority: "medium" as const,
      benefit: "helps you get better quality sleep for recovery",
      goalConnection: "Improve sleep quality"
    }
  ];

  const handleComplete = (id: string) => {
    console.log("Reminder completed:", id);
  };

  const handleSnooze = (id: string) => {
    console.log("Reminder snoozed:", id);
  };

  const handleWorkingOnIt = (id: string) => {
    console.log("Working on reminder:", id);
  };

  const criticalCount = reminders.filter(r => r.priority === "critical").length;
  const completionRate = 75; // This would come from actual data

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bell className="h-6 w-6 text-primary" />
              Today's Reminders
              {criticalCount > 0 && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  {criticalCount} Critical
                </Badge>
              )}
            </CardTitle>
            <SpeechButton 
              text="You have reminders to check. Let's go through them together."
              variant="outline"
              showLabel={true}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Daily Progress</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <Progress 
              value={completionRate} 
              showPulse={completionRate > 70}
              className="h-3"
              indicatorClassName="bg-gradient-to-r from-green-500 to-green-600"
            />
            <p className="text-xs text-muted-foreground">
              🎯 Great progress! {100 - completionRate}% more to reach today's goal
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Reminder Cards */}
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <TBIReminderCard
            key={reminder.id}
            reminder={reminder}
            onComplete={handleComplete}
            onSnooze={handleSnooze}
            onWorkingOnIt={handleWorkingOnIt}
          />
        ))}
      </div>

      {/* Encouragement Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">🌟</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            You're doing amazing!
          </h3>
          <p className="text-gray-600">
            Every small step counts toward your recovery. Take your time and celebrate each achievement! 💪
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
