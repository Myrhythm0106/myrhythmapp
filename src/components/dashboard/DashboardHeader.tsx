
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onShowTutorial: () => void;
}

export function DashboardHeader({ onShowTutorial }: DashboardHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <PageHeader
        title="Dashboard"
        subtitle="Your personalized brain health hub"
      />
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
  );
}
