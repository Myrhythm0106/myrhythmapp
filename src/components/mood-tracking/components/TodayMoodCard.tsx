
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile } from "lucide-react";
import { format } from "date-fns";

interface TodayMoodCardProps {
  latestMood: string | null;
  moodEntry: any;
}

export function TodayMoodCard({ latestMood, moodEntry }: TodayMoodCardProps) {
  if (!latestMood || !moodEntry) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No mood data recorded for today yet.</p>
          <p className="mt-2">Log your first mood to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Mood</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className={`rounded-full p-4 ${
            latestMood === "great" ? "bg-green-100" : 
            latestMood === "okay" ? "bg-blue-100" : "bg-red-100"
          }`}>
            <Smile className={`h-8 w-8 ${
              latestMood === "great" ? "text-green-500" : 
              latestMood === "okay" ? "text-blue-500" : "text-red-500"
            }`} />
          </div>
          <div>
            <h3 className="text-xl font-medium capitalize">{latestMood}</h3>
            <p className="text-muted-foreground">
              Recorded at {format(moodEntry.date, "h:mm a")}
            </p>
            {moodEntry.note && (
              <p className="mt-2 italic">{moodEntry.note}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
