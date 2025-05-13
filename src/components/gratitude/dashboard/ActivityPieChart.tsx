
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip
} from "recharts";

interface ActivityData {
  name: string;
  value: number;
}

interface ActivityPieChartProps {
  activityData: ActivityData[];
  colors: string[];
}

export function ActivityPieChart({ activityData, colors }: ActivityPieChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gratitude by Activity Type</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {activityData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activityData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No activity data available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
