
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Plus, X, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface GoalSuggestion {
  id: string;
  type: "smaller-part" | "daily-do";
  title: string;
  description: string;
  reasoning: string;
  targetStepId?: string;
}

interface GoalSufficiencyAnalyzerProps {
  goalTitle: string;
  smallSteps: any[];
  onAddSuggestion: (suggestion: GoalSuggestion) => void;
  onDismiss: () => void;
}

// Mock AI analysis function - in real app this would be more sophisticated
const analyzeGoalSufficiency = (goalTitle: string, smallSteps: any[]): { 
  isSufficient: boolean; 
  suggestions: GoalSuggestion[] 
} => {
  const suggestions: GoalSuggestion[] = [];
  
  // Simple heuristics for demo purposes
  if (goalTitle.toLowerCase().includes("walk") && smallSteps.length < 3) {
    suggestions.push({
      id: "walk-balance",
      type: "smaller-part",
      title: "Practice balance exercises",
      description: "Work on stability and confidence before walking longer distances",
      reasoning: "Balance training helps prevent falls and builds confidence for walking goals"
    });
  }
  
  if (goalTitle.toLowerCase().includes("read") && smallSteps.length < 2) {
    suggestions.push({
      id: "reading-stamina",
      type: "smaller-part", 
      title: "Build reading stamina gradually",
      description: "Start with shorter reading sessions and gradually increase duration",
      reasoning: "Building reading endurance helps achieve longer-term reading goals"
    });
  }
  
  // Check for steps with insufficient daily actions
  smallSteps.forEach(step => {
    if (step.actions.length < 2) {
      suggestions.push({
        id: `daily-${step.id}`,
        type: "daily-do",
        title: `Practice session for: ${step.title}`,
        description: "Add a short daily practice to reinforce this skill",
        reasoning: "Regular practice helps build muscle memory and confidence",
        targetStepId: step.id
      });
    }
  });
  
  return {
    isSufficient: suggestions.length === 0,
    suggestions: suggestions.slice(0, 3) // Limit to 3 suggestions
  };
};

export function GoalSufficiencyAnalyzer({ goalTitle, smallSteps, onAddSuggestion, onDismiss }: GoalSufficiencyAnalyzerProps) {
  const [analysis, setAnalysis] = useState(() => analyzeGoalSufficiency(goalTitle, smallSteps));
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const handleAcceptSuggestion = (suggestion: GoalSuggestion) => {
    onAddSuggestion(suggestion);
    setDismissedSuggestions(prev => [...prev, suggestion.id]);
    toast.success("Suggestion added to your plan!", {
      description: "Your goal plan has been enhanced with this recommendation."
    });
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions(prev => [...prev, suggestionId]);
  };

  const activeSuggestions = analysis.suggestions.filter(s => !dismissedSuggestions.includes(s.id));

  if (analysis.isSufficient || activeSuggestions.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Your goal plan looks comprehensive!</p>
              <p className="text-sm text-green-600">You have well-defined steps and actions to achieve your goal.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-blue-600" />
          Smart Suggestions
          <Badge variant="outline" className="text-xs">AI-Powered</Badge>
        </CardTitle>
        <p className="text-sm text-blue-600">
          Based on your goal, here are some suggestions to help you succeed:
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activeSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-800">{suggestion.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.type === "smaller-part" ? "Smaller Part" : "Daily Do"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  Why: {suggestion.reasoning}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismissSuggestion(suggestion.id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => handleAcceptSuggestion(suggestion)}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDismissSuggestion(suggestion.id)}
                className="text-gray-600"
              >
                Not Helpful
              </Button>
            </div>
          </div>
        ))}
        
        {activeSuggestions.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>All suggestions reviewed!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
