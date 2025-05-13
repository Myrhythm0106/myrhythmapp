
import React from "react";
import { SwipeableCarousel } from "@/components/dashboard/SwipeableCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";
import { GratitudeActivityPrompt } from "@/components/gratitude/GratitudeActivityPrompt";

export function DashboardCarousel() {
  // Array of cards to display in the carousel
  const dashboardCards = [
    <Card key="gratitude" className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <HeartHandshake className="h-5 w-5 text-primary" />
          Contextual Gratitude
        </CardTitle>
      </CardHeader>
      <CardContent>
        <GratitudeActivityPrompt 
          activityType="general"
          activityName="daily reflection"
        />
      </CardContent>
    </Card>
  ];

  return (
    <SwipeableCarousel items={dashboardCards} title="Your Wellness Tools" />
  );
}
