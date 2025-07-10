
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Heart, Users, TreePine, Sun, Phone, Sparkles, Clock } from "lucide-react";
import { UserType } from "../UserTypeStep";
import { AssessmentResult } from "@/utils/rhythmAnalysis";

interface PersonalizedBreakSuggestionsProps {
  assessmentResult: AssessmentResult;
  userType?: UserType | null;
  onBreaksSelected: (breaks: string[]) => void;
}

interface BreakSuggestion {
  id: string;
  type: "family" | "solo" | "movement" | "mindful" | "spiritual";
  title: string;
  description: string;
  duration: number;
  icon: React.ReactNode;
  userTypes: UserType[];
  benefits: string[];
}

const breakSuggestions: BreakSuggestion[] = [
  {
    id: "family-check-in",
    type: "family",
    title: "Family Connection Time",
    description: "Quick check-in call or text with family members",
    duration: 10,
    icon: <Phone className="h-4 w-4" />,
    userTypes: ["brain-injury", "caregiver", "wellness"],
    benefits: ["Emotional support", "Social connection", "Stress relief"]
  },
  {
    id: "mindful-breathing",
    type: "mindful",
    title: "Mindful Breathing",
    description: "Deep breathing exercises to reset your mind",
    duration: 5,
    icon: <TreePine className="h-4 w-4" />,
    userTypes: ["brain-injury", "caregiver", "cognitive-optimization", "wellness"],
    benefits: ["Stress reduction", "Mental clarity", "Focus improvement"]
  },
  {
    id: "prayer-meditation",
    type: "spiritual",
    title: "Prayer & Meditation",
    description: "Quiet time for prayer, reflection, or meditation",
    duration: 15,
    icon: <Sparkles className="h-4 w-4" />,
    userTypes: ["brain-injury", "caregiver", "wellness"],
    benefits: ["Inner peace", "Spiritual connection", "Emotional healing"]
  },
  {
    id: "gentle-movement",
    type: "movement",
    title: "Gentle Movement",
    description: "Light stretching or walking to energize",
    duration: 10,
    icon: <Sun className="h-4 w-4" />,
    userTypes: ["brain-injury", "caregiver", "wellness"],
    benefits: ["Physical wellness", "Energy boost", "Circulation"]
  },
  {
    id: "coffee-mindfulness",
    type: "solo",
    title: "Mindful Coffee/Tea",
    description: "Enjoy a warm drink without distractions",
    duration: 8,
    icon: <Coffee className="h-4 w-4" />,
    userTypes: ["cognitive-optimization", "wellness"],
    benefits: ["Mindfulness", "Relaxation", "Mental reset"]
  },
  {
    id: "family-activity",
    type: "family",
    title: "Family Activity Time",
    description: "Short activity with family members nearby",
    duration: 20,
    icon: <Users className="h-4 w-4" />,
    userTypes: ["caregiver", "wellness"],
    benefits: ["Quality time", "Joy", "Connection"]
  }
];

export function PersonalizedBreakSuggestions({ 
  assessmentResult, 
  userType, 
  onBreaksSelected 
}: PersonalizedBreakSuggestionsProps) {
  const [selectedBreaks, setSelectedBreaks] = useState<string[]>([]);

  // Filter suggestions based on user type
  const relevantSuggestions = breakSuggestions.filter(suggestion => 
    !userType || suggestion.userTypes.includes(userType)
  );

  const handleBreakToggle = (breakId: string) => {
    setSelectedBreaks(prev => 
      prev.includes(breakId) 
        ? prev.filter(id => id !== breakId)
        : [...prev, breakId]
    );
  };

  const handleContinue = () => {
    onBreaksSelected(selectedBreaks);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "family": return "bg-heart-100 text-heart-700 border-heart-200";
      case "movement": return "bg-green-100 text-green-700 border-green-200";
      case "mindful": return "bg-purple-100 text-purple-700 border-purple-200";
      case "spiritual": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Your Personalized Break Suggestions</h2>
        <p className="text-muted-foreground">
          Based on your assessment, these breaks are tailored for your {userType?.replace('-', ' ')} journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relevantSuggestions.map((suggestion) => {
          const isSelected = selectedBreaks.includes(suggestion.id);
          
          return (
            <Card 
              key={suggestion.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleBreakToggle(suggestion.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded border">
                      {suggestion.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getTypeColor(suggestion.type)}`}>
                          {suggestion.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {suggestion.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {suggestion.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestion.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Select the breaks you'd like us to suggest during your day (you can change these later)
        </p>
        <Button 
          onClick={handleContinue} 
          size="lg" 
          disabled={selectedBreaks.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue with {selectedBreaks.length} Selected Break{selectedBreaks.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
}
