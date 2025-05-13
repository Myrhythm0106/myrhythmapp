
import React from "react";
import { DailyCheckin } from "@/components/dashboard/DailyCheckin";
import { SymptomTracker } from "@/components/dashboard/SymptomTracker";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import { SwipeableCarousel } from "@/components/dashboard/SwipeableCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";
import { GratitudeActivityPrompt } from "@/components/gratitude/GratitudeActivityPrompt";
import { GratitudeSnapshotCard } from "@/components/dashboard/GratitudeSnapshotCard";
import { MoodSnapshotCard } from "@/components/dashboard/MoodSnapshotCard";
import { RecentWins } from "@/components/dashboard/RecentWins";
import { WeekNaming } from "@/components/dashboard/WeekNaming";

export function MobileCarousel() {
  const dashboardCards = [
    <GratitudeSnapshotCard key="gratitude" />,
    <MoodSnapshotCard key="mood" />,
    <RecentWins key="wins" />,
    <WeekNaming key="week" />,
    <Card key="gratitude-prompt" className="h-full">
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
    </Card>,
    <SymptomTracker key="symptom" />,
    <CommunityCard key="community" />,
    <UpcomingEvents key="upcoming" date={new Date()} />
  ];

  return (
    <SwipeableCarousel items={dashboardCards} title="Your Wellness Dashboard" />
  );
}
