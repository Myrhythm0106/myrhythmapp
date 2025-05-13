
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useGratitude } from "@/hooks/use-gratitude";
import { GratitudeStatCards } from "./dashboard/GratitudeStatCards";
import { GratitudeTabContent } from "./dashboard/GratitudeTabContent";
import { 
  calculateAverageMoodScore,
  findMostFrequentTime,
  countEntriesLastWeek
} from "./dashboard/utils/gratitudeInsightUtils";

export function GratitudeDashboard() {
  const [activeTab, setActiveTab] = useState<"mood" | "themes" | "activities">("mood");
  const { entries, getMostCommonTags, getAverageMoodByDay } = useGratitude();
  
  // Calculate insights and statistics
  const totalEntries = entries.length;
  const lastWeekEntries = countEntriesLastWeek(entries);
  const averageMoodScore = calculateAverageMoodScore(entries);
  const mostFrequentTime = findMostFrequentTime(entries);
  
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

  return (
    <div className="space-y-6">
      <GratitudeStatCards 
        totalEntries={totalEntries}
        lastWeekEntries={lastWeekEntries}
        averageMoodScore={averageMoodScore}
        mostFrequentTime={mostFrequentTime}
      />
      
      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="mood">Mood Correlation</TabsTrigger>
          <TabsTrigger value="themes">Common Themes</TabsTrigger>
          <TabsTrigger value="activities">Activity Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <GratitudeTabContent 
            activeTab={activeTab}
            moodData={recentMoodData}
            activityData={promptTypeData}
            tags={getMostCommonTags(30)}
            colors={COLORS}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
