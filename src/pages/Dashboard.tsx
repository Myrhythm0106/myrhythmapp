
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";
import { BrainHealthDashboard } from "@/components/dashboard/BrainHealthDashboard";
import { TransformationProgress } from "@/components/dashboard/TransformationProgress";
import { StickyActionBar } from "@/components/dashboard/StickyActionBar";
import { MotivationalStatement } from "@/components/dashboard/MotivationalStatement";
import { DashboardViewSelector } from "@/components/dashboard/DashboardViewSelector";
import { NeedToKnowNowView } from "@/components/dashboard/views/NeedToKnowNowView";
import { KeepInMindView } from "@/components/dashboard/views/KeepInMindView";
import { useUserData } from "@/hooks/use-user-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Info, UserPlus, Brain, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const userData = useUserData();
  const { user } = useAuth();
  const [dashboardView, setDashboardView] = useState<"now" | "week">("now");
  const [showTransformationProgress, setShowTransformationProgress] = useState(false);
  
  // Get layout preference from localStorage - default to new brain-health layout
  const layoutPreference = localStorage.getItem('dashboardLayout') || 'brain-health';
  const [currentLayout, setCurrentLayout] = useState<'standard' | 'customizable' | 'brain-health'>(
    layoutPreference as any || 'brain-health'
  );

  // Function to switch layouts
  const switchLayout = (layout: 'standard' | 'customizable' | 'brain-health') => {
    setCurrentLayout(layout);
    localStorage.setItem('dashboardLayout', layout);
    toast.success(`Switched to ${layout === 'brain-health' ? 'Memory1st' : layout} dashboard`);
  };

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

  // Render new Brain Health Dashboard by default
  if (currentLayout === 'brain-health') {
    return (
      <div className="relative">
        {/* Layout Switcher */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTransformationProgress(!showTransformationProgress)}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Info className="h-4 w-4 mr-1" />
            Progress
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchLayout('standard')}
            className="bg-white/90 backdrop-blur-sm"
          >
            <LayoutDashboard className="h-4 w-4 mr-1" />
            Classic
          </Button>
        </div>

        {/* Transformation Progress Overlay */}
        {showTransformationProgress && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
              <TransformationProgress />
              <Button
                variant="outline"
                onClick={() => setShowTransformationProgress(false)}
                className="mt-4 w-full bg-white"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        <BrainHealthDashboard />
      </div>
    );
  }

  // Render customizable dashboard if selected
  if (currentLayout === 'customizable') {
    return (
      <div className="space-y-6 animate-fade-in relative">
        <div className="flex justify-end p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchLayout('brain-health')}
          >
            <Brain className="h-4 w-4 mr-1" />
            Memory1st
          </Button>
        </div>
        <CustomizableDashboard />
        <StickyActionBar />
      </div>
    );
  }

  // Original dashboard layout
  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-end p-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => switchLayout('brain-health')}
        >
          <Brain className="h-4 w-4 mr-1" />
          Memory1st
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => switchLayout('customizable')}
        >
          <Settings className="h-4 w-4 mr-1" />
          Custom
        </Button>
      </div>

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
