
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onShowTutorial: () => void;
  currentDate: string;
}

export function DashboardHeader({ onShowTutorial, currentDate }: DashboardHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary mr-2">MyRhythm</h1>
          {/* Logo would go here */}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onShowTutorial}
            className="flex items-center gap-2 premium-button"
            aria-label="View tutorial"
          >
            <Info className="h-4 w-4" />
            Help
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
      
      <PageHeader
        title="Dashboard"
        subtitle={`${currentDate} • Your personalized brain health hub`}
      />
    </div>
  );
}
