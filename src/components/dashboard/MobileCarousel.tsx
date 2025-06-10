
import React from "react";
import { DailyCheckin } from "@/components/dashboard/DailyCheckin";
import { SymptomTracker } from "@/components/dashboard/SymptomTracker";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import { SwipeableCarousel } from "@/components/dashboard/SwipeableCarousel";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, RefreshCw, Share2 } from "lucide-react";
import { GratitudeActivityPrompt } from "@/components/gratitude/GratitudeActivityPrompt";
import { GratitudeSnapshotCard } from "@/components/dashboard/GratitudeSnapshotCard";
import { MoodSnapshotCard } from "@/components/dashboard/MoodSnapshotCard";
import { RecentWins } from "@/components/dashboard/RecentWins";
import { WeekNaming } from "@/components/dashboard/WeekNaming";
import { toast } from "sonner";

export function MobileCarousel() {
  const handleRefreshDashboard = async () => {
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Dashboard refreshed! ✨", { duration: 2000 });
  };

  const handleShareDashboard = () => {
    toast.success("Dashboard sharing options opened", { duration: 2000 });
  };

  const dashboardCards = [
    <SwipeableContainer
      key="gratitude-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={handleRefreshDashboard}
      onSwipeRight={{
        label: "Share",
        icon: <Share2 className="h-4 w-4" />,
        color: "#22c55e",
        action: handleShareDashboard
      }}
    >
      <GratitudeSnapshotCard />
    </SwipeableContainer>,
    
    <SwipeableContainer
      key="mood-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={handleRefreshDashboard}
    >
      <MoodSnapshotCard />
    </SwipeableContainer>,
    
    <SwipeableContainer
      key="wins-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={handleRefreshDashboard}
    >
      <RecentWins />
    </SwipeableContainer>,
    
    <SwipeableContainer
      key="week-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={handleRefreshDashboard}
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
      onPullToRefresh={handleRefreshDashboard}
    >
      <SymptomTracker />
    </SwipeableContainer>,
    
    <SwipeableContainer
      key="community-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={handleRefreshDashboard}
    >
      <CommunityCard />
    </SwipeableContainer>,
    
    <SwipeableContainer
      key="upcoming-swipeable"
      enablePullToRefresh={true}
      onPullToRefresh={handleRefreshDashboard}
    >
      <UpcomingEvents date={new Date()} />
    </SwipeableContainer>
  ];

  return (
    <div className="space-y-4">
      <SwipeableCarousel 
        items={dashboardCards} 
        title="Your Wellness Dashboard"
        enableAutoScroll={false}
      />
      
      {/* Mobile interaction guide */}
      <div className="bg-muted/30 rounded-lg p-3 text-center">
        <p className="text-sm text-muted-foreground mb-2 font-medium">
          ✨ Enhanced Mobile Experience
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>📱 Swipe to navigate</div>
          <div>⬇️ Pull to refresh</div>
          <div>👆 Tap for details</div>
          <div>🔄 Auto-updates</div>
        </div>
      </div>
    </div>
  );
}
