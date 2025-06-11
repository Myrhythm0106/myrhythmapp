
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, ArrowRight, Users, Settings } from "lucide-react";

interface PostAssessmentChoiceScreenProps {
  onExploreGuide: () => void;
  onStartGoals: () => void;
  onLifeManagementSetup: () => void;
  assessmentResult: any;
}

export function PostAssessmentChoiceScreen({ 
  onExploreGuide, 
  onStartGoals,
  onLifeManagementSetup,
  assessmentResult 
}: PostAssessmentChoiceScreenProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">Your Assessment is Complete! 🎉</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You've identified your rhythm focus area. Now choose how you'd like to begin your MyRhythm journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Option 1: User Guide */}
        <Card className="border-2 hover:border-primary transition-all duration-300 cursor-pointer group" onClick={onExploreGuide}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Explore the User Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-center text-sm">
              Learn how MyRhythm works and discover all available tools.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-xs">You'll discover:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Dashboard navigation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Calendar features
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Goal setting best practices
                </li>
              </ul>
            </div>
            
            <Button className="w-full mt-4" variant="outline" size="sm">
              <BookOpen className="h-3 w-3 mr-2" />
              Start Learning
            </Button>
          </CardContent>
        </Card>

        {/* Option 4: Life Management Foundation - NEW */}
        <Card className="border-2 border-primary bg-primary/5 hover:border-primary/80 transition-all duration-300 cursor-pointer group relative overflow-hidden" onClick={onLifeManagementSetup}>
          <div className="absolute top-2 right-2">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
              Recommended
            </span>
          </div>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-lg">Build My Life Management Foundation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-center text-sm">
              Complete guided 15-minute setup to get your personalized life management system ready.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-xs">We'll set up:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Personal preferences & routine
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Essential calendar & appointments
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Goal framework & actions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Support circle & dashboard
                </li>
              </ul>
            </div>
            
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90" size="sm">
              <Settings className="h-3 w-3 mr-2" />
              Start Foundation Setup
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Option 2: Goal Setting */}
        <Card className="border-2 hover:border-primary transition-all duration-300 cursor-pointer group" onClick={onStartGoals}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-lg">Start Setting Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-center text-sm">
              Jump right in and create your first meaningful goals.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-xs">Guided process:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <strong>Goal:</strong> What am I aiming for?
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <strong>Actions:</strong> Steps to take
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <strong>Measures:</strong> How to track success
                </li>
              </ul>
            </div>
            
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" size="sm">
              <Target className="h-3 w-3 mr-2" />
              Create First Goal
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom note */}
      <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <Users className="h-4 w-4 inline mr-1" />
          Don't worry - you can always change your choice later and access all features anytime from your dashboard.
        </p>
      </div>
    </div>
  );
}
