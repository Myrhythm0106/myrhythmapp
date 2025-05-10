
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export function RecentWins() {
  // In a real app, we would dynamically determine recent achievements
  // For now, we'll use a static example
  const recentAchievement = {
    title: "Completed Morning Routine 3 Days in a Row!",
    description: "Keep up the great work! Your consistency is building strong habits.",
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Recent Win
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium text-lg">{recentAchievement.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{recentAchievement.description}</p>
      </CardContent>
    </Card>
  );
}
