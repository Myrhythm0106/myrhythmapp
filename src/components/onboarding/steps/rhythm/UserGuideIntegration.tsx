import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Clock } from "lucide-react";
import { UserType } from "@/types/user";

interface UserGuideIntegrationProps {
  onComplete: (data: any) => void;
  assessmentResult: any;
}

export function UserGuideIntegration({ onComplete, assessmentResult }: UserGuideIntegrationProps) {
  const [userGuideData, setUserGuideData] = useState({
    viewedIntro: false,
    completedGuide: false,
    setGoals: false,
    reviewedCalendar: false
  });

  const handleContinue = () => {
    onComplete(userGuideData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          User Guide & Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Intro Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Welcome to Your Personalized Guide</h3>
          <p>
            We've compiled a quick guide to help you get the most out of your MyRhythm experience.
          </p>
          <Button variant="outline" className="w-full justify-start">
            <BookOpen className="h-4 w-4 mr-2" />
            View Quick Start Guide
          </Button>
        </div>

        {/* Goal Setting */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Set Your First Goal</h3>
          <p>
            Based on your assessment, setting a small, achievable goal can help you build momentum.
          </p>
          <Button variant="outline" className="w-full justify-start">
            <Target className="h-4 w-4 mr-2" />
            Create a Goal
          </Button>
        </div>

        {/* Calendar Integration */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Explore Your Calendar</h3>
          <p>
            See how your recommended activities fit into your daily schedule.
          </p>
          <Button variant="outline" className="w-full justify-start">
            <Clock className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
        </div>

        {/* Progress Badge */}
        <div className="pt-4 border-t">
          <Badge variant="secondary">
            Complete these steps to unlock more features!
          </Badge>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleContinue} className="w-full">
            Continue to Support Integration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
