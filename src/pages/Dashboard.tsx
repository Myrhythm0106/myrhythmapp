
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { TodayFocus } from "@/components/dashboard/TodayFocus";
import { UpcomingToday } from "@/components/dashboard/UpcomingToday";
import { RoutineCheckIn } from "@/components/dashboard/RoutineCheckIn";
import { BrainGameQuickStart } from "@/components/dashboard/BrainGameQuickStart";
import { MoodEnergySnapshot } from "@/components/dashboard/MoodEnergySnapshot";
import { GratitudePromptCard } from "@/components/dashboard/GratitudePromptCard";
import { RecentWinsCard } from "@/components/dashboard/RecentWinsCard";
import { useUserData } from "@/hooks/use-user-data";

const Dashboard = () => {
  const userData = useUserData();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title={`Welcome back, ${userData.name}`}
        subtitle="Here's what's important for you today"
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Primary Focus Column */}
        <div className="space-y-6 lg:col-span-1">
          <TodayFocus />
          <UpcomingToday />
          <RoutineCheckIn />
        </div>
        
        {/* Center Column - Brain & Mood */}
        <div className="space-y-6 lg:col-span-1">
          <BrainGameQuickStart />
          <MoodEnergySnapshot />
        </div>
        
        {/* Right Column - Gratitude & Wins */}
        <div className="space-y-6 lg:col-span-1">
          <GratitudePromptCard />
          <RecentWinsCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
