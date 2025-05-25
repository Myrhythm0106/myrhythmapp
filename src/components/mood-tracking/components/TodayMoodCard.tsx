
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile } from "lucide-react";
import { format } from "date-fns";

interface TodayMoodCardProps {
  latestMood: string | null;
  moodEntry: any;
}

const getMoodDisplayInfo = (mood: string) => {
  switch (mood) {
    case "great":
      return {
        color: "text-green-500",
        bgColor: "bg-green-100",
        label: "Feeling Great"
      };
    case "okay":
      return {
        color: "text-blue-500",
        bgColor: "bg-blue-100",
        label: "Feeling Okay"
      };
    case "struggling":
      return {
        color: "text-red-500",
        bgColor: "bg-red-100",
        label: "Having Difficulties"
      };
    default:
      return {
        color: "text-gray-500",
        bgColor: "bg-gray-100",
        label: "Mood Recorded"
      };
  }
};

export function TodayMoodCard({ latestMood, moodEntry }: TodayMoodCardProps) {
  if (!latestMood || !moodEntry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Mood</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <div className="space-y-2">
            <Smile className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No mood data recorded for today yet.</p>
            <p className="text-sm">Log your first mood to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const moodInfo = getMoodDisplayInfo(latestMood);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Mood</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className={`rounded-full p-4 ${moodInfo.bgColor}`}>
            <Smile className={`h-8 w-8 ${moodInfo.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-medium">{moodInfo.label}</h3>
            <p className="text-muted-foreground">
              Recorded at {format(moodEntry.date, "h:mm a")}
            </p>
            {moodEntry.note && (
              <div className="mt-3 p-3 bg-muted/50 rounded-md">
                <p className="text-sm font-medium text-muted-foreground mb-1">Your note:</p>
                <p className="italic">{moodEntry.note}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
