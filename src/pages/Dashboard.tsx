
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
import { Settings, Info, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const userData = useUserData();
  const { user } = useAuth();
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

  // Get user's display name with fallback
  const displayName = userData.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';

  // Render customizable dashboard if selected
  if (layoutPreference === 'customizable') {
    return (
      <div className="space-y-6 animate-fade-in relative">
        <CustomizableDashboard />
        <StickyActionBar />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <PageHeader 
        title={`Welcome back, ${displayName}`} 
        subtitle="Stay focused on what matters most to your recovery"
      >
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex items-center gap-2">
            <DashboardViewSelector 
              currentView={dashboardView} 
              onViewChange={setDashboardView} 
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShowTips} 
              className="h-8 w-8 p-0 hover:bg-muted/50"
              title="Show helpful tips"
            >
              <Info className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCustomizeDashboard} 
              className="text-xs h-8 w-fit"
            >
              <Settings className="h-3.5 w-3.5 mr-1" />
              Customize
            </Button>
            
            {/* Welcome badge for new users */}
            <Badge variant="secondary" className="text-xs">
              <UserPlus className="h-3 w-3 mr-1" />
              Professional Edition
            </Badge>
          </div>
        </div>
      </PageHeader>
      
      <MotivationalStatement />
      
      {dashboardView === "now" ? <NeedToKnowNowView /> : <KeepInMindView />}

      <StickyActionBar />
    </div>
  );
};

export default Dashboard;
