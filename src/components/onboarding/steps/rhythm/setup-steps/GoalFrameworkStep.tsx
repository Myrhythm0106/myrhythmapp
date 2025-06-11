
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Target, TrendingUp } from "lucide-react";

interface GoalFrameworkStepProps {
  onComplete: (data: any) => void;
  assessmentResult: any;
}

export function GoalFrameworkStep({ onComplete, assessmentResult }: GoalFrameworkStepProps) {
  const [goalData, setGoalData] = useState({
    primaryGoal: "",
    goalCategory: "",
    timeframe: "3months",
    actionCategories: ["health", "recovery"],
    progressCheckFrequency: "weekly",
    celebrationStyle: "private"
  });

  // Goal suggestions based on focus area
  const getGoalSuggestions = () => {
    const suggestions = {
      "communication": [
        "Improve my ability to express thoughts clearly",
        "Rebuild confidence in social conversations", 
        "Strengthen memory for names and details"
      ],
      "cognitive": [
        "Enhance my memory and concentration",
        "Improve problem-solving abilities",
        "Rebuild confidence in mental tasks"
      ],
      "emotional": [
        "Develop healthy coping strategies",
        "Build emotional resilience",
        "Improve mood and stress management"
      ],
      "physical": [
        "Regain physical strength and mobility",
        "Improve balance and coordination",
        "Build endurance for daily activities"
      ],
      "independence": [
        "Increase independence in daily activities",
        "Rebuild confidence in personal care",
        "Strengthen ability to manage responsibilities"
      ]
    };
    
    return suggestions[assessmentResult.focusArea as keyof typeof suggestions] || suggestions.cognitive;
  };

  const goalSuggestions = getGoalSuggestions();

  const handleContinue = () => {
    onComplete(goalData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goal Framework Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Goal */}
        <div className="space-y-3">
          <Label className="text-base font-medium">What's one meaningful goal you'd like to work toward?</Label>
          <p className="text-sm text-muted-foreground">
            Based on your assessment, here are some suggestions, or write your own:
          </p>
          
          <div className="space-y-2">
            {goalSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-2">
                <RadioGroupItem 
                  value={suggestion} 
                  id={`suggestion-${index}`}
                  checked={goalData.primaryGoal === suggestion}
                  onClick={() => setGoalData(prev => ({ ...prev, primaryGoal: suggestion }))}
                />
                <Label htmlFor={`suggestion-${index}`} className="text-sm leading-relaxed cursor-pointer">
                  {suggestion}
                </Label>
              </div>
            ))}
            <div className="flex items-start space-x-2">
              <RadioGroupItem 
                value="custom" 
                id="custom-goal"
                checked={goalData.primaryGoal && !goalSuggestions.includes(goalData.primaryGoal)}
              />
              <div className="flex-1">
                <Label htmlFor="custom-goal" className="text-sm cursor-pointer">Write my own goal:</Label>
                <Textarea
                  className="mt-1"
                  placeholder="Describe your personal goal..."
                  value={goalSuggestions.includes(goalData.primaryGoal) ? "" : goalData.primaryGoal}
                  onChange={(e) => setGoalData(prev => ({ ...prev, primaryGoal: e.target.value }))}
                  onClick={() => setGoalData(prev => ({ ...prev, primaryGoal: prev.primaryGoal && goalSuggestions.includes(prev.primaryGoal) ? "" : prev.primaryGoal }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Goal Category */}
        <div className="space-y-3">
          <Label className="text-base font-medium">What category best describes this goal?</Label>
          <Select value={goalData.goalCategory} onValueChange={(value) => setGoalData(prev => ({ ...prev, goalCategory: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="health">Health & Medical</SelectItem>
              <SelectItem value="cognitive">Cognitive & Mental</SelectItem>
              <SelectItem value="physical">Physical & Mobility</SelectItem>
              <SelectItem value="social">Social & Communication</SelectItem>
              <SelectItem value="independence">Independence & Daily Living</SelectItem>
              <SelectItem value="emotional">Emotional & Mental Health</SelectItem>
              <SelectItem value="personal">Personal & Life Goals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timeframe */}
        <div className="space-y-3">
          <Label className="text-base font-medium">What timeframe feels realistic for meaningful progress?</Label>
          <RadioGroup value={goalData.timeframe} onValueChange={(value) => setGoalData(prev => ({ ...prev, timeframe: value }))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1month" id="1month" />
              <Label htmlFor="1month">1 month - I want to see quick progress</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3months" id="3months" />
              <Label htmlFor="3months">3 months - I want steady, sustainable progress</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="6months" id="6months" />
              <Label htmlFor="6months">6 months - I want to make significant changes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ongoing" id="ongoing" />
              <Label htmlFor="ongoing">Ongoing - This is a lifestyle change</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Progress Check Frequency */}
        <div className="space-y-3">
          <Label className="text-base font-medium">How often would you like to check your progress?</Label>
          <RadioGroup value={goalData.progressCheckFrequency} onValueChange={(value) => setGoalData(prev => ({ ...prev, progressCheckFrequency: value }))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily - I like frequent check-ins</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Weekly - I prefer regular but not overwhelming updates</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly - I like to focus on the big picture</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleContinue} className="w-full">
            Continue to Support Integration
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
