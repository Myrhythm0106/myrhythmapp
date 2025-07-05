
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, ArrowRight, Users, Settings, Brain, Heart, Zap } from "lucide-react";

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
          You've identified your rhythm focus area. Now let's help you understand the MyRhythm approach.
        </p>
      </div>

      {/* Three Core Concepts Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-sm">Memory1st/Brain Health</h3>
          <p className="text-xs text-muted-foreground">Your brain is like a garden - we help it heal and grow with gentle structure</p>
        </div>
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-sm">MYRHYTHM Process</h3>
          <p className="text-xs text-muted-foreground">Your personal 8-step journey to discover and live your unique rhythm</p>
        </div>
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
            <Zap className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-sm">LEAP Outcome</h3>
          <p className="text-xs text-muted-foreground">Live Empowered, Authentic & Productive - your meaningful life awaits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Option 1: User Guide - Enhanced */}
        <Card className="border-2 hover:border-primary transition-all duration-300 cursor-pointer group" onClick={onExploreGuide}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Understand Your MyRhythm Foundation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-center text-sm">
              Learn the brain-friendly approach behind MyRhythm and how it supports your unique journey.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-xs">You'll discover:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Why Memory1st/Brain Health comes first
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  How MYRHYTHM adapts to your needs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  What LEAP looks like in daily life
                </li>
              </ul>
            </div>
            
            <Button className="w-full mt-4" variant="outline" size="sm">
              <BookOpen className="h-3 w-3 mr-2" />
              Learn MyRhythm Approach
            </Button>
          </CardContent>
        </Card>

        {/* Option 2: Life Operating Model - ENHANCED */}
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
            <CardTitle className="text-lg">Build My Life Operating Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-center text-sm">
              Complete guided 15-minute setup using Memory1st principles to create your personalized MYRHYTHM system.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-xs">Brain-friendly setup includes:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Your personal rhythm & energy patterns
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Gentle calendar & routine framework
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  LEAP-focused goals & celebration system
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Support network & progress tracking
                </li>
              </ul>
            </div>
            
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90" size="sm">
              <Settings className="h-3 w-3 mr-2" />
              Start Brain-Friendly Setup
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Option 3: Goal Setting - Enhanced */}
        <Card className="border-2 hover:border-primary transition-all duration-300 cursor-pointer group" onClick={onStartGoals}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-lg">Start LEAP Goal Setting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-center text-sm">
              Jump right in and create your first meaningful LEAP goal using brain-healthy principles.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-xs">Memory1st approach:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <strong>Live:</strong> What small step can I take today?
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <strong>Empowered:</strong> What support do I need?
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <strong>Authentic & Productive:</strong> Does this align with my values?
                </li>
              </ul>
            </div>
            
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" size="sm">
              <Target className="h-3 w-3 mr-2" />
              Create LEAP Goal
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom note - Enhanced */}
      <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          <Users className="h-4 w-4 inline mr-1" />
          Don't worry - you can explore all options anytime from your dashboard.
        </p>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <Badge variant="outline" className="bg-white/70">Week 1: Finding Your Rhythm</Badge>
          <Badge variant="outline" className="bg-white/70">Month 1: Living MYRHYTHM</Badge>
          <Badge variant="outline" className="bg-white/70">Month 6: Full LEAP Life</Badge>
        </div>
      </div>
    </div>
  );
}
