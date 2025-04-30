
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data
const dailyData = [
  { day: "Mon", headache: 3, fatigue: 4, anxiety: 2 },
  { day: "Tue", headache: 4, fatigue: 3, anxiety: 2 },
  { day: "Wed", headache: 2, fatigue: 2, anxiety: 1 },
  { day: "Thu", headache: 5, fatigue: 4, anxiety: 3 },
  { day: "Fri", headache: 3, fatigue: 3, anxiety: 2 },
  { day: "Sat", headache: 2, fatigue: 2, anxiety: 2 },
  { day: "Sun", headache: 1, fatigue: 1, anxiety: 1 },
];

const weeklyData = [
  { week: "Week 1", headache: 3.2, fatigue: 3.5, anxiety: 2.1 },
  { week: "Week 2", headache: 2.8, fatigue: 3.1, anxiety: 1.9 },
  { week: "Week 3", headache: 2.4, fatigue: 2.6, anxiety: 1.7 },
  { week: "Week 4", headache: 2.0, fatigue: 2.3, anxiety: 1.5 },
];

const monthlyData = [
  { month: "Jan", headache: 3.5, fatigue: 3.8, anxiety: 2.5 },
  { month: "Feb", headache: 3.2, fatigue: 3.5, anxiety: 2.3 },
  { month: "Mar", headache: 2.9, fatigue: 3.2, anxiety: 2.1 },
  { month: "Apr", headache: 2.6, fatigue: 2.9, anxiety: 1.9 },
  { month: "May", headache: 2.3, fatigue: 2.6, anxiety: 1.7 },
];

export function SymptomInsights() {
  const [timeframe, setTimeframe] = React.useState<"daily" | "weekly" | "monthly">("daily");
  const [symptoms, setSymptoms] = React.useState<string[]>(["headache", "fatigue", "anxiety"]);
  
  const getChartData = () => {
    switch (timeframe) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };
  
  const getXAxisKey = () => {
    switch (timeframe) {
      case "daily":
        return "day";
      case "weekly":
        return "week";
      case "monthly":
        return "month";
      default:
        return "day";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Period</label>
          <Select 
            value={timeframe}
            onValueChange={(value) => setTimeframe(value as "daily" | "weekly" | "monthly")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily (Last 7 Days)</SelectItem>
              <SelectItem value="weekly">Weekly (Last 4 Weeks)</SelectItem>
              <SelectItem value="monthly">Monthly (Last 5 Months)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Symptom Severity Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={getXAxisKey()} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                {symptoms.includes("headache") && (
                  <Line 
                    type="monotone" 
                    dataKey="headache" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="Headache"
                  />
                )}
                {symptoms.includes("fatigue") && (
                  <Line 
                    type="monotone" 
                    dataKey="fatigue" 
                    stroke="#82ca9d" 
                    name="Fatigue"
                  />
                )}
                {symptoms.includes("anxiety") && (
                  <Line 
                    type="monotone" 
                    dataKey="anxiety" 
                    stroke="#ffc658" 
                    name="Anxiety"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Insights</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              <li className="text-sm">
                <span className="font-medium">Headache triggers:</span> Your headaches tend to be more severe on Thursdays, possibly related to work stress.
              </li>
              <li className="text-sm">
                <span className="font-medium">Fatigue patterns:</span> Fatigue is highest at the beginning of the week and improves over the weekend.
              </li>
              <li className="text-sm">
                <span className="font-medium">Overall trend:</span> Your symptom severity has been gradually decreasing over the monitored period.
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              <li className="text-sm">
                Consider stress management techniques for Thursday workdays.
              </li>
              <li className="text-sm">
                Maintain your weekend rest patterns, as they appear to be effective.
              </li>
              <li className="text-sm">
                Track sleep quality to identify correlations with fatigue levels.
              </li>
              <li className="text-sm">
                Continue with your current treatment plan, as symptoms show improvement over time.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
