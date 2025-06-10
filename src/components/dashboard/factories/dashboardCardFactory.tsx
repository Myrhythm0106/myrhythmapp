
import React from "react";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, Share2 } from "lucide-react";
import { GratitudeActivityPrompt } from "@/components/gratitude/GratitudeActivityPrompt";
import { GratitudeSnapshotCard } from "@/components/dashboard/GratitudeSnapshotCard";
import { MoodSnapshotCard } from "@/components/dashboard/MoodSnapshotCard";
import { RecentWins } from "@/components/dashboard/RecentWins";
import { WeekNaming } from "@/components/dashboard/WeekNaming";
import { SymptomTracker } from "@/components/dashboard/SymptomTracker";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";

interface DashboardCardFactoryProps {
  onRefresh: () => Promise<void>;
  onShare: () => void;
}

export function createDashboardCards({ onRefresh, onShare }: DashboardCardFactoryProps) {
  return [
    <SwipeableContainer
      key="gratitude-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={onRefresh}
      onSwipeRight={{
        label: "Share",
        icon: <Share2 className="h-4 w-4" />,
        color: "#22c55e",
        action: onShare
      }}
    >
      <GratitudeSnapshotCard />
    </SwipeableContainer>,
    
    <SwipeableContainer
      key="mood-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={onRefresh}
    >
      <MoodSnapshotCard />
    </SwipeableContainer>,
    
    <SwipeableContainer
      key="wins-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={onRefresh}
    >
      <RecentWins />
    </SwipeableContainer>,
    
    <SwipeableContainer
      key="week-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={onRefresh}
    >
      <WeekNaming />
    </SwipeableContainer>,
    
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
    
    <SwipeableContainer
      key="symptom-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={onRefresh}
    >
      <SymptomTracker />
    </SwipeableContainer>,
    
    <SwipeableContainer
      key="community-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={onRefresh}
    >
      <CommunityCard />
    </SwipeableContainer>,
    
    <SwipeableContainer
      key="upcoming-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={onRefresh}
    >
      <UpcomingEvents date={new Date()} />
    </SwipeableContainer>
  ];
}
