
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodHistoryChart, MoodHistoryEntry } from "@/components/dashboard/daily-checkin/MoodHistoryChart";

interface WeeklyMoodViewProps {
  filteredEntries: any[];
  getChartData: (entries: any[]) => MoodHistoryEntry[];
  getMoodTrendInsight: (entries: any[]) => string;
  getWeeklyRecommendations: (entries: any[]) => string[];
}

export function WeeklyMoodView({ 
  filteredEntries, 
  getChartData, 
  getMoodTrendInsight, 
  getWeeklyRecommendations 
}: WeeklyMoodViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">7-Day Mood Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <MoodHistoryChart moodHistory={getChartData(filteredEntries)} />
        
        <div className="mt-6 space-y-2">
          <h4 className="font-medium">Weekly Insights</h4>
          {filteredEntries.length > 2 ? (
            <div className="space-y-4">
              <p>
                {getMoodTrendInsight(filteredEntries)}
              </p>
              <div className="bg-muted p-4 rounded-md">
                <h5 className="font-medium mb-2">Weekly Recommendations</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {getWeeklyRecommendations(filteredEntries)}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Log your mood for at least 3 days to see weekly insights and recommendations.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
