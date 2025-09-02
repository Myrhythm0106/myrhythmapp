import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  Share2, 
  Heart,
  Sparkles 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CoachGuideHeaderProps {
  userProgress?: {
    currentStreak: number;
    completedToday: boolean;
  };
}

export function CoachGuideHeader({ userProgress }: CoachGuideHeaderProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="border-b border-border/40 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">Your Empowerment Guide</h1>
              {userProgress?.currentStreak && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {userProgress.currentStreak} day streak!
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userProgress?.completedToday && (
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                ✓ Today's check-in complete
              </Badge>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGoToDashboard}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Dashboard
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Progress
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Guide
            </Button>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Your personal empowerment coach is here to guide you every step of the way. 
            Together, we'll build the routines and habits that support your empowerment journey.
          </p>
        </div>
      </div>
    </div>
  );
}