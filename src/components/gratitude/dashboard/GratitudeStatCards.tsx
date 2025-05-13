
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, BarChart2, Clock } from "lucide-react";
import { GratitudeEntry } from "@/components/gratitude/GratitudePrompt";

interface GratitudeStatCardsProps {
  totalEntries: number;
  lastWeekEntries: number;
  averageMoodScore: number;
  mostFrequentTime: string;
}

export function GratitudeStatCards({
  totalEntries,
  lastWeekEntries,
  averageMoodScore,
  mostFrequentTime,
}: GratitudeStatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            Total Gratitude Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalEntries}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {lastWeekEntries} in the last week
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Average Mood Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {averageMoodScore > 0 ? averageMoodScore.toFixed(1) : "N/A"}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            On a scale of 1-5
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Time Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{mostFrequentTime}</div>
          <div className="text-sm text-muted-foreground mt-1">
            Most frequent time for gratitude
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
