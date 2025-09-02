
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Compass } from "lucide-react";
import { JourneyHubModal } from "@/components/journey/JourneyHubModal";

interface DashboardHeaderProps {
  onShowTutorial?: () => void;
  currentDate?: string;
  userName?: string;
}

export function DashboardHeader({ 
  onShowTutorial = () => console.log("Tutorial clicked"), 
  currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  userName 
}: DashboardHeaderProps) {
  const [isJourneyHubOpen, setIsJourneyHubOpen] = useState(false);
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200/50 shadow-sm p-6 mb-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-primary">MyRhythm</h1>
          <p className="text-lg text-muted-foreground">{currentDate}</p>
          {userName && (
            <p className="text-xl font-medium">Hello, {userName}</p>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsJourneyHubOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border-brain-health-300 text-brain-health-700 hover:from-brain-health-100 hover:to-clarity-teal-100"
          aria-label="Open journey hub"
        >
          <Compass className="h-4 w-4" />
          Journey Hub
        </Button>
      </div>
      
      <JourneyHubModal 
        isOpen={isJourneyHubOpen} 
        onClose={() => setIsJourneyHubOpen(false)} 
      />
    </div>
  );
}
