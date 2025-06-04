
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Clock } from "lucide-react";
import { FocusArea, focusAreas } from "@/utils/rhythmAnalysis";

interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  difficulty: "easy" | "medium" | "hard";
  actions: string[];
}

const goalTemplates: Record<FocusArea, GoalTemplate[]> = {
  structure: [
    {
      id: "daily-routine",
      title: "Establish Daily Morning Routine",
      description: "Create a consistent morning routine to start each day with structure",
      timeframe: "2 weeks",
      difficulty: "easy",
      actions: ["Set consistent wake time", "Plan 3-step morning routine", "Track completion daily"]
    },
    {
      id: "medication-adherence",
      title: "Improve Medication Consistency",
      description: "Take medications at the same time daily with 95% adherence",
      timeframe: "1 month",
      difficulty: "medium",
      actions: ["Set medication reminders", "Use pill organizer", "Track daily adherence"]
    },
    {
      id: "appointment-management",
      title: "Never Miss Important Appointments",
      description: "Use calendar system to attend all scheduled appointments",
      timeframe: "Ongoing",
      difficulty: "easy",
      actions: ["Add all appointments to calendar", "Set 24-hour reminders", "Prepare night before"]
    }
  ],
  emotional: [
    {
      id: "mood-tracking",
      title: "Track Daily Emotional Patterns",
      description: "Monitor mood daily to identify patterns and triggers",
      timeframe: "1 month",
      difficulty: "easy",
      actions: ["Check in with mood daily", "Note triggers and patterns", "Review weekly trends"]
    },
    {
      id: "gratitude-practice",
      title: "Build Daily Gratitude Habit",
      description: "Practice gratitude to improve emotional wellbeing",
      timeframe: "3 weeks",
      difficulty: "easy",
      actions: ["Write 3 gratitudes daily", "Reflect on positive moments", "Share gratitude with others"]
    },
    {
      id: "stress-management",
      title: "Develop Healthy Stress Responses",
      description: "Learn and practice techniques to manage overwhelming feelings",
      timeframe: "6 weeks",
      difficulty: "medium",
      actions: ["Learn breathing techniques", "Practice mindfulness", "Identify stress triggers"]
    }
  ],
  achievement: [
    {
      id: "independence-goal",
      title: "Increase Daily Independence",
      description: "Gradually take on more daily tasks independently",
      timeframe: "2 months",
      difficulty: "medium",
      actions: ["Choose one new independent task weekly", "Practice with support", "Track progress"]
    },
    {
      id: "skill-rebuilding",
      title: "Rebuild a Lost Skill",
      description: "Work on recovering a skill that was affected by your injury",
      timeframe: "3 months",
      difficulty: "hard",
      actions: ["Break skill into small steps", "Practice daily", "Celebrate small wins"]
    },
    {
      id: "confidence-building",
      title: "Build Confidence Through Small Wins",
      description: "Achieve small daily accomplishments to rebuild self-confidence",
      timeframe: "1 month",
      difficulty: "easy",
      actions: ["Set daily achievable tasks", "Celebrate completions", "Keep success journal"]
    }
  ],
  community: [
    {
      id: "support-network",
      title: "Build Strong Support Network",
      description: "Connect with others who understand your journey",
      timeframe: "2 months",
      difficulty: "medium",
      actions: ["Join support group", "Connect with one new person weekly", "Maintain regular contact"]
    },
    {
      id: "help-others",
      title: "Support Someone Else's Journey",
      description: "Find ways to help others in similar situations",
      timeframe: "Ongoing",
      difficulty: "medium",
      actions: ["Share your experience", "Mentor someone new", "Volunteer when able"]
    },
    {
      id: "family-connection",
      title: "Strengthen Family Relationships",
      description: "Improve communication and connection with family members",
      timeframe: "6 weeks",
      difficulty: "medium",
      actions: ["Schedule regular family time", "Practice open communication", "Express appreciation"]
    }
  ],
  growth: [
    {
      id: "cognitive-training",
      title: "Improve Cognitive Function",
      description: "Use brain training exercises to enhance mental abilities",
      timeframe: "2 months",
      difficulty: "medium",
      actions: ["Complete daily brain games", "Try new mental challenges", "Track improvements"]
    },
    {
      id: "learn-new-skill",
      title: "Learn Something New",
      description: "Take on a new hobby or skill to promote neuroplasticity",
      timeframe: "3 months",
      difficulty: "medium",
      actions: ["Choose interesting new skill", "Practice regularly", "Find learning resources"]
    },
    {
      id: "self-reflection",
      title: "Develop Self-Awareness",
      description: "Regular reflection to understand your progress and needs",
      timeframe: "Ongoing",
      difficulty: "easy",
      actions: ["Weekly self-reflection", "Journal insights", "Adjust strategies as needed"]
    }
  ]
};

interface FocusAreaGoalTemplatesProps {
  focusArea: FocusArea;
  onGoalsSelected: (goals: any[]) => void;
  selectedGoals: any[];
}

export function FocusAreaGoalTemplates({ focusArea, onGoalsSelected, selectedGoals }: FocusAreaGoalTemplatesProps) {
  const templates = goalTemplates[focusArea];
  const focusInfo = focusAreas[focusArea];
  
  const handleGoalToggle = (template: GoalTemplate, checked: boolean) => {
    if (checked) {
      const newGoal = {
        id: `goal-${Date.now()}-${template.id}`,
        title: template.title,
        description: template.description,
        target: template.description,
        focusArea: focusArea,
        timeframe: template.timeframe,
        difficulty: template.difficulty,
        actions: template.actions,
        progress: 0,
        createdAt: new Date().toISOString(),
        template: template.id
      };
      onGoalsSelected([...selectedGoals, newGoal]);
    } else {
      onGoalsSelected(selectedGoals.filter(goal => goal.template !== template.id));
    }
  };

  const isGoalSelected = (templateId: string) => {
    return selectedGoals.some(goal => goal.template === templateId);
  };

  const getDifficultyColor = (difficulty: "easy" | "medium" | "hard") => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Choose Your Starting Goals</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your <strong>{focusInfo.title}</strong> focus, here are some goals that align perfectly with your current rhythm. 
          Select the ones that resonate with you - you can always add more later.
        </p>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => {
          const isSelected = isGoalSelected(template.id);
          
          return (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleGoalToggle(template, checked as boolean)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{template.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{template.description}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {template.timeframe}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">First Actions:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {template.actions.slice(0, 3).map((action, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Plus className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Want to create your own goal?</span>
        </div>
        <p className="text-xs text-blue-700">
          After setup, you can create custom goals in the Calendar & Goals section that perfectly match your unique needs.
        </p>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          Selected: <strong>{selectedGoals.length}</strong> goals
          {selectedGoals.length === 0 && " (You can skip this step and add goals later)"}
        </p>
      </div>
    </div>
  );
}
