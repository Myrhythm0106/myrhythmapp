
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Info } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const userData = useUserData();
  
  // Function to handle the dashboard customization
  const handleCustomizeDashboard = () => {
    toast.info("Dashboard customization will be available soon!", {
      description: "We're working on making your dashboard fully customizable."
    });
  };
  
  // Function to show helpful tips
  const handleShowTips = () => {
    toast.success("Dashboard Tips", {
      description: "Focus on completing your routine items and daily focus tasks first."
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title={`Welcome back, ${userData.name}`}
        subtitle="Here's what's important for you today"
      >
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            Brain Health Focus
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowTips}
            className="text-xs h-8"
          >
            <Info className="h-3.5 w-3.5 mr-1" />
            Tips
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCustomizeDashboard}
            className="text-xs h-8"
          >
            <Settings className="h-3.5 w-3.5 mr-1" />
            Customize
          </Button>
        </div>
      </PageHeader>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Primary Focus Column - The most essential tools */}
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
          
          {/* Integration hint card */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm">
              <span className="font-medium">Did you know?</span> Recording gratitude moments 
              can improve your mood over time. Try adding at least one gratitude note daily.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
