import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Target, 
  Users, 
  Calendar,
  BookOpen,
  Settings,
  Brain,
  Heart,
  Zap
} from "lucide-react";
import { UserType } from "@/types/user";

interface PostAssessmentWelcomeDashboardProps {
  userType: UserType;
  assessmentResult: any;
  onContinue: () => void;
}

export function PostAssessmentWelcomeDashboard({ 
  userType, 
  assessmentResult, 
  onContinue 
}: PostAssessmentWelcomeDashboardProps) {
  
  const getPersonalizedMessage = () => {
    const profile = assessmentResult?.myrhythmProfile;
    if (!profile) return "Welcome to your personalized MYRHYTHM journey!";
    
    return `Great! We've identified that you're focusing on ${profile.primaryChallenge} with ${profile.energyPeak} energy patterns.`;
  };

  const getTimelineSteps = () => [
    {
      week: "Week 1",
      title: "Foundation Setup",
      description: "Complete your Life Operating Model setup",
      duration: "15 minutes",
      status: "current"
    },
    {
      week: "Week 2-3", 
      title: "Building Your Rhythm",
      description: "Establish daily patterns and goal-setting",
      duration: "5-10 min/day",
      status: "upcoming"
    },
    {
      week: "Week 4+",
      title: "Living MYRHYTHM",
      description: "Full integration and LEAP lifestyle",
      duration: "Natural flow",
      status: "upcoming"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Celebration Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              🎉 Assessment Complete!
            </h1>
            <p className="text-lg text-muted-foreground">
              {getPersonalizedMessage()}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-3 bg-background/50 rounded-lg">
              <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Memory1st Foundation</h3>
              <p className="text-xs text-muted-foreground">Brain-friendly approach established</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Heart className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Personal MYRHYTHM</h3>
              <p className="text-xs text-muted-foreground">Your unique patterns identified</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">LEAP Ready</h3>
              <p className="text-xs text-muted-foreground">Path to meaningful life mapped</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            What Happens Next: Your 30-Day Journey
          </CardTitle>
          <p className="text-muted-foreground">
            We'll guide you step-by-step through building your Life Operating Model. No guesswork, just gentle progress.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getTimelineSteps().map((step, index) => (
              <div key={index} className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                step.status === 'current' 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'bg-muted/30'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.status === 'current' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.status === 'current' ? '🎯' : index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={step.status === 'current' ? 'default' : 'secondary'} className="text-xs">
                      {step.week}
                    </Badge>
                    <span className="text-sm font-semibold">{step.title}</span>
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{step.duration}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {step.status === 'current' && (
                    <p className="text-xs text-primary font-medium mt-1">→ Starting now</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Step Action */}
      <Card className="border-2 border-primary bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Ready for Step 1: Life Operating Model Setup
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                We'll walk you through setting up your calendar, focus time, and support network using brain-friendly principles. Takes about 15 minutes.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Calendar sync
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Focus timer
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Support circle
                </div>
              </div>
            </div>
            <Button 
              onClick={onContinue}
              className="bg-primary hover:bg-primary/90 px-6"
              size="lg"
            >
              Start Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Need to understand the approach first?</p>
                <p className="text-xs text-muted-foreground">Learn about Memory1st principles and MYRHYTHM methodology</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Read Guide
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-background border rounded-full px-4 py-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="text-sm text-muted-foreground">Assessment Complete</span>
          <div className="w-2 h-2 bg-muted rounded-full"></div>
          <span className="text-sm text-muted-foreground">Setup Next</span>
          <div className="w-2 h-2 bg-muted rounded-full"></div>
          <span className="text-sm text-muted-foreground">Live MYRHYTHM</span>
        </div>
      </div>
    </div>
  );
}