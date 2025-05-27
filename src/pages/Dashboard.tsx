
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";
import { StickyActionBar } from "@/components/dashboard/StickyActionBar";
import { MotivationalStatement } from "@/components/dashboard/MotivationalStatement";
import { DashboardViewSelector } from "@/components/dashboard/DashboardViewSelector";
import { NeedToKnowNowView } from "@/components/dashboard/views/NeedToKnowNowView";
import { KeepInMindView } from "@/components/dashboard/views/KeepInMindView";
import { useUserData } from "@/hooks/use-user-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Info } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const userData = useUserData();
  const [dashboardView, setDashboardView] = useState<"now" | "week">("now");

  // Get layout preference from localStorage
  const layoutPreference = localStorage.getItem('dashboardLayout') || 'standard';

  // Function to handle the dashboard customization
  const handleCustomizeDashboard = () => {
    toast.info("Dashboard customization will be available soon!", {
      description: "We're working on making your dashboard fully customizable."
    });
  };

  // Function to show helpful tips
  const handleShowTips = () => {
    const tips = {
      now: "Focus on urgent tasks and immediate actions that need your attention today.",
      week: "Review your weekly patterns and plan ahead for better consistency."
    };
    toast.success("Dashboard Tips", {
      description: tips[dashboardView]
    });
  };

  // Render customizable dashboard if selected
  if (layoutPreference === 'customizable') {
    return <div className="space-y-6 animate-fade-in relative">
        <CustomizableDashboard />
        <StickyActionBar />
      </div>;
  }

  return <div className="space-y-6 animate-fade-in relative">
      <PageHeader 
        title={`Welcome back, ${userData.name}`} 
        subtitle={
          <span className="flex items-center gap-1">
            Stay focused on what matters
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShowTips} 
              className="h-4 w-4 p-0 hover:bg-muted/50 ml-1"
            >
              <Info className="h-3 w-3" />
            </Button>
          </span>
        }
      >
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex items-center gap-2">
            <DashboardViewSelector currentView={dashboardView} onViewChange={setDashboardView} />
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleCustomizeDashboard} className="text-xs h-8 w-fit">
            <Settings className="h-3.5 w-3.5 mr-1" />
            Customize
          </Button>
        </div>
      </PageHeader>
      
      <MotivationalStatement />
      
      {dashboardView === "now" ? <NeedToKnowNowView /> : <KeepInMindView />}

      <StickyActionBar />
    </div>;
};

export default Dashboard;
