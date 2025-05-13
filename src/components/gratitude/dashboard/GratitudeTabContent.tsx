
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodCorrelationChart } from "./MoodCorrelationChart";
import { ActivityPieChart } from "./ActivityPieChart";
import { GratitudeWordCloud } from "../GratitudeWordCloud";

interface MoodData {
  date: string;
  averageMood: number;
}

interface ActivityData {
  name: string;
  value: number;
}

interface WordCloudTag {
  text: string;
  value: number;
}

interface GratitudeTabContentProps {
  activeTab: "mood" | "themes" | "activities";
  moodData: MoodData[];
  activityData: ActivityData[];
  tags: WordCloudTag[];
  colors: string[];
}

export function GratitudeTabContent({ 
  activeTab, 
  moodData, 
  activityData,
  tags,
  colors
}: GratitudeTabContentProps) {
  if (activeTab === "mood") {
    return <MoodCorrelationChart moodData={moodData} />;
  }
  
  if (activeTab === "themes") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Common Gratitude Themes</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {tags.length > 0 ? (
            <GratitudeWordCloud tags={tags} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No gratitude entries yet. Add some to see common themes.
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  if (activeTab === "activities") {
    return <ActivityPieChart activityData={activityData} colors={colors} />;
  }
  
  return null;
}
