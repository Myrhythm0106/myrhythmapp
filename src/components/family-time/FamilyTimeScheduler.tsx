
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { FamilyCircleManager, FamilyMember } from "./components/FamilyCircleManager";
import { ActivityCard, FamilyTimeActivity } from "./components/ActivityCard";
import { familyActivities } from "./data/familyActivities";

export function FamilyTimeScheduler() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", name: "Partner/Spouse", relationship: "spouse" },
    { id: "2", name: "Child", relationship: "child" }
  ]);

  const addFamilyMember = (memberData: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      ...memberData
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const scheduleFamilyTime = (activity: FamilyTimeActivity) => {
    toast.success("Family Time Scheduled! ❤️", {
      description: `"${activity.title}" is ready for your family. Duration: ${activity.duration} minutes.`,
      duration: 5000,
      action: (
        <Button size="sm" onClick={() => startFamilyTime(activity)}>
          Start Now
        </Button>
      )
    });
  };

  const startFamilyTime = (activity: FamilyTimeActivity) => {
    toast.info(`Family Time Started: ${activity.title}`, {
      description: activity.description,
      duration: 8000
    });

    setTimeout(() => {
      toast.success("Family Time Complete! 🎉", {
        description: "How did it go? Your family bonds grow stronger with each interaction!",
        duration: 6000,
        action: (
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => recordFamilyTime(activity.id, "great")}>
              😊 Amazing
            </Button>
            <Button size="sm" variant="outline" onClick={() => recordFamilyTime(activity.id, "good")}>
              👍 Good
            </Button>
          </div>
        )
      });
    }, activity.duration * 60 * 1000);
  };

  const recordFamilyTime = (activityId: string, quality: "great" | "good") => {
    console.log(`Family time recorded: ${activityId} - ${quality}`);
    toast.success("Family time logged! 💕", {
      description: "These moments matter for your recovery and family relationships.",
      duration: 4000
    });
  };

  return (
    <div className="space-y-6">
      <FamilyCircleManager 
        familyMembers={familyMembers}
        onAddMember={addFamilyMember}
      />

      <Card className="border-memory-emerald-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-memory-emerald-600" />
            Family Time Activities
          </CardTitle>
          <p className="text-sm text-gray-600">
            Brain-friendly activities to strengthen family bonds
          </p>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {familyActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onSchedule={scheduleFamilyTime}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
