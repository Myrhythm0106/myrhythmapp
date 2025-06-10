
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, ArrowRight, Users } from "lucide-react";

interface PostAssessmentChoiceScreenProps {
  onExploreGuide: () => void;
  onStartGoals: () => void;
  assessmentResult: any;
}

export function PostAssessmentChoiceScreen({ 
  onExploreGuide, 
  onStartGoals, 
  assessmentResult 
}: PostAssessmentChoiceScreenProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">Your Assessment is Complete! 🎉</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You've identified your rhythm focus area. Now it's time to take the next step in your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Option 1: User Guide */}
        <Card className="border-2 hover:border-primary transition-all duration-300 cursor-pointer group" onClick={onExploreGuide}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Explore the User Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">
              Learn how MyRhythm works and discover all the tools available to support your journey.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">You'll discover:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  How to navigate your personalized dashboard
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Calendar and action planning features
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Goal setting best practices
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Community and support resources
                </li>
              </ul>
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Start Exploring
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Option 2: Goal Setting */}
        <Card className="border-2 hover:border-primary transition-all duration-300 cursor-pointer group" onClick={onStartGoals}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Start Setting Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">
              Jump right in and create your first meaningful goals with our guided process.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Our guided process:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <strong>Goal:</strong> What am I aiming for?
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <strong>Actions:</strong> What steps do I need to take?
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <strong>Measures:</strong> How do I know I've achieved it?
                </li>
              </ul>
            </div>
            
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              <Target className="h-4 w-4 mr-2" />
              Create My First Goal
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom note */}
      <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <Users className="h-4 w-4 inline mr-1" />
          Don't worry - you can always access the User Guide later from your dashboard, 
          and you can create or modify goals anytime.
        </p>
      </div>
    </div>
  );
}
