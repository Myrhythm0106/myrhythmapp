
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

interface MoodData {
  date: string;
  averageMood: number;
}

interface MoodCorrelationChartProps {
  moodData: MoodData[];
}

export function MoodCorrelationChart({ moodData }: MoodCorrelationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood and Gratitude Correlation</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {moodData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="averageMood" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Average Mood"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No mood data available yet. Add gratitude entries to see patterns.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
