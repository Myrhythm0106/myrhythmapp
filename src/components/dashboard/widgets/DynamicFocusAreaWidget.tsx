
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Heart, Target, Users, Brain, ArrowRight, Clock, Sparkles, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/use-user-data";
import { getCurrentFocusArea, focusAreas, FocusArea } from "@/utils/rhythmAnalysis";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { AssessmentResultsDisplay } from "../../onboarding/steps/rhythm/AssessmentResultsDisplay";
import { getCurrentAssessmentResult } from "@/utils/rhythmAnalysis";

const focusAreaIcons: Record<FocusArea, React.ComponentType<{ className?: string }>> = {
  memory: Brain,
  structure: Calendar,
  emotional: Heart,
  achievement: Target,
  community: Users,
  growth: Brain
};

export function DynamicFocusAreaWidget() {
  const navigate = useNavigate();
  const userData = useUserData();
  const currentFocusArea = getCurrentFocusArea();
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  
  const currentAssessment = getCurrentAssessmentResult();
  
  if (!currentFocusArea) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Complete your rhythm assessment to discover your personalized focus area.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/onboarding?step=5")}
              className="mt-2"
            >
              Take Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const focusInfo = focusAreas[currentFocusArea];
  const FocusIcon = focusAreaIcons[currentFocusArea];
  
  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handlePrimaryAction = () => {
    // Navigate based on focus area
    const navigationMap: Record<FocusArea, string> = {
      memory: "/memory",
      structure: "/calendar",
      emotional: "/mood",
      achievement: "/calendar?view=goals",
      community: "/community",
      growth: "/brain-games"
    };
    
    navigate(navigationMap[currentFocusArea]);
  };

  // Calculate days until next assessment review (6 months)
  const focusAreaData = JSON.parse(localStorage.getItem("myrhythm_focus_area") || "{}");
  const nextReviewDate = new Date(focusAreaData.nextReviewDate || Date.now() + 180 * 24 * 60 * 60 * 1000);
  const daysUntilReview = Math.ceil((nextReviewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <>
      <Card className="overflow-hidden">
        <div className={`relative overflow-hidden rounded-t-lg bg-gradient-to-r ${focusInfo.gradient} p-4 text-white`}>
          <div className="absolute -right-4 -top-4 opacity-20">
            <FocusIcon className="h-20 w-20" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <FocusIcon className="h-5 w-5" />
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                {focusInfo.phase}
              </Badge>
            </div>
            <h2 className="text-lg font-semibold mb-1">
              {greetingTime()}, {userData.name}!
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-sm opacity-90">
                Your rhythm suggests focusing on: <strong>{focusInfo.title}</strong>
              </p>
              {currentAssessment && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-6 text-white hover:text-white/80"
                  onClick={() => setIsAssessmentDialogOpen(true)}
                >
                  <FileText className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {focusInfo.description}
            </p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Today's Focus Actions:</h4>
              <div className="space-y-1">
                {focusInfo.primaryActions.slice(0, 2).map((action, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Button
                onClick={handlePrimaryAction}
                className={`bg-gradient-to-r ${focusInfo.gradient} hover:opacity-90 text-white flex-1 mr-2`}
              >
                Start Today's Focus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile?section=rhythm")}
                className="px-3"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="h-3 w-3" />
                <span className="font-medium">Evolving Journey</span>
              </div>
              <p>Your focus area will be reassessed in {daysUntilReview} days as your rhythm evolves.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentAssessment && (
        <Dialog open={isAssessmentDialogOpen} onOpenChange={setIsAssessmentDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Your Assessment Results</DialogTitle>
            </DialogHeader>
            <AssessmentResultsDisplay assessmentResult={currentAssessment} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
