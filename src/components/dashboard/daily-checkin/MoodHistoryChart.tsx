
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { MoodHistoryEntry } from "./MoodTypes";

interface MoodHistoryChartProps {
  moodHistory: MoodHistoryEntry[];
}

export function MoodHistoryChart({ moodHistory }: MoodHistoryChartProps) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-2">Your Mood - Last 7 Days</h3>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moodHistory}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              fontSize={12}
            />
            <YAxis 
              domain={[0, 3]} 
              ticks={[1, 2, 3]} 
              axisLine={false}
              tickLine={false}
              width={30}
              tickFormatter={(value) => {
                switch (value) {
                  case 3: return "😊";
                  case 2: return "😐";
                  case 1: return "😔";
                  default: return "";
                }
              }}
            />
            <Tooltip 
              formatter={(value, name) => {
                const moodValue = Number(value);
                switch (moodValue) {
                  case 3: return ["Great", "Mood"];
                  case 2: return ["Okay", "Mood"];
                  case 1: return ["Struggling", "Mood"];
                  default: return ["Not recorded", "Mood"];
                }
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: "white" }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
