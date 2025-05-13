
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useGratitude } from "@/hooks/use-gratitude";
import { format, subDays } from "date-fns";
import { HeartHandshake, BarChart2, Clock, Users } from "lucide-react";
import { GratitudeWordCloud } from "./GratitudeWordCloud";

export function GratitudeDashboard() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const { entries, getMostCommonTags, getAverageMoodByDay } = useGratitude();
  
  // Calculate insights and statistics
  const totalEntries = entries.length;
  const lastWeekEntries = entries.filter(
    entry => {
      const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
      return entryDate >= subDays(new Date(), 7);
    }
  ).length;
  
  // Format data for mood correlation chart
  const moodData = getAverageMoodByDay();
  const recentMoodData = moodData.slice(-14).map(item => ({
    ...item,
    date: format(new Date(item.date), "MMM d")
  }));
  
  // Format data for entry distribution by prompt type
  const promptTypes = ["fitness", "mindfulness", "social", "general"];
  const promptTypeData = promptTypes.map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: entries.filter(entry => entry.promptType === type).length
  })).filter(item => item.value > 0);
  
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];
  
  // Calculate average mood score
  const averageMoodScore = entries.length > 0 
    ? entries.reduce((total, entry) => total + entry.moodScore, 0) / entries.length
    : 0;
  
  // Find most frequent time for gratitude
  const mostFrequentTime = entries.length > 0 
    ? (() => {
        const times = {
          Morning: 0,
          Afternoon: 0,
          Evening: 0
        };
        
        entries.forEach(entry => {
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          const hour = entryDate.getHours();
          if (hour >= 5 && hour < 12) {
            times.Morning++;
          } else if (hour >= 12 && hour < 18) {
            times.Afternoon++;
          } else {
            times.Evening++;
          }
        });
        
        return Object.entries(times).reduce((max, [time, count]) => 
          count > max.count ? { time, count } : max, 
          { time: "N/A", count: 0 }
        ).time;
      })()
    : "N/A";

  return (
    <div className="space-y-6">
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
      
      <Tabs defaultValue="mood" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mood">Mood Correlation</TabsTrigger>
          <TabsTrigger value="themes">Common Themes</TabsTrigger>
          <TabsTrigger value="activities">Activity Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood and Gratitude Correlation</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {recentMoodData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recentMoodData}>
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
        </TabsContent>
        
        <TabsContent value="themes">
          <Card>
            <CardHeader>
              <CardTitle>Common Gratitude Themes</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {entries.length > 0 ? (
                <GratitudeWordCloud tags={getMostCommonTags(30)} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No gratitude entries yet. Add some to see common themes.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Gratitude by Activity Type</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {promptTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={promptTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {promptTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
