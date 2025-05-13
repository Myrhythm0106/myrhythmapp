
import React from "react";
import { DailyCheckin } from "@/components/dashboard/DailyCheckin";
import { SymptomTracker } from "@/components/dashboard/SymptomTracker";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import { FocusGoals } from "@/components/dashboard/FocusGoals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GratitudeActivityPrompt } from "@/components/gratitude/GratitudeActivityPrompt";
import { HeartHandshake } from "lucide-react";

interface DashboardContentProps {
  isMobile: boolean;
}

export function DashboardContent({ isMobile }: DashboardContentProps) {
  const navigate = useNavigate();
  
  const handleCardClick = (path: string) => {
    navigate(path);
  };

  if (isMobile) {
    return null; // Mobile layout will be handled by SwipeableCarousel in parent component
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 overflow-hidden">
      <div className="md:col-span-2 lg:col-span-1">
        <DailyCheckin />
      </div>
      <div onClick={() => handleCardClick("/tracking")} className="cursor-pointer">
        <SymptomTracker />
      </div>
      <div onClick={() => handleCardClick("/community")} className="cursor-pointer">
        <CommunityCard />
      </div>
      <div onClick={() => handleCardClick("/gratitude")} className="cursor-pointer">
        <Card className="h-full">
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
      </div>
      <div onClick={() => handleCardClick("/calendar?view=goals")} className="cursor-pointer md:col-span-2 lg:col-span-1">
        <FocusGoals />
      </div>
      <div onClick={() => handleCardClick("/calendar")} className="cursor-pointer md:col-span-2 lg:col-span-1">
        <div className="h-full">
          <Card className="h-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <UpcomingEvents date={new Date()} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
