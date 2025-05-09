
import React from "react";
import { DailyCheckin } from "@/components/dashboard/DailyCheckin";
import { SymptomTracker } from "@/components/dashboard/SymptomTracker";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2 lg:col-span-1">
        <DailyCheckin />
      </div>
      <div onClick={() => handleCardClick("/tracking")} className="cursor-pointer">
        <SymptomTracker />
      </div>
      <div onClick={() => handleCardClick("/community")} className="cursor-pointer">
        <CommunityCard />
      </div>
      <div onClick={() => handleCardClick("/calendar")} className="cursor-pointer md:col-span-2 lg:col-span-1">
        <div className="h-full">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingEvents date={new Date()} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
