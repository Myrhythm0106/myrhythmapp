
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodHistoryChart, MoodHistoryEntry } from "@/components/dashboard/daily-checkin/MoodHistoryChart";

interface MonthlyMoodViewProps {
  filteredEntries: any[];
  getChartData: (entries: any[]) => MoodHistoryEntry[];
  getAverageMoodLabel: (entries: any[]) => string;
  getMonthlyInsight: (entries: any[]) => string;
}

export function MonthlyMoodView({
  filteredEntries,
  getChartData,
  getAverageMoodLabel,
  getMonthlyInsight
}: MonthlyMoodViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <MoodHistoryChart moodHistory={getChartData(filteredEntries)} />
        
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Monthly Statistics</h4>
            {filteredEntries.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Great days:</span>
                  <span className="font-medium">
                    {filteredEntries.filter(e => e.mood === "great").length} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Okay days:</span>
                  <span className="font-medium">
                    {filteredEntries.filter(e => e.mood === "okay").length} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Struggling days:</span>
                  <span className="font-medium">
                    {filteredEntries.filter(e => e.mood === "struggling").length} days
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span>Average mood:</span>
                  <span className="font-medium">
                    {getAverageMoodLabel(filteredEntries)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No data for this month yet.</p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Monthly Insights</h4>
            {filteredEntries.length > 7 ? (
              <p>{getMonthlyInsight(filteredEntries)}</p>
            ) : (
              <p className="text-muted-foreground">
                Track your mood for at least a week to see monthly insights.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
