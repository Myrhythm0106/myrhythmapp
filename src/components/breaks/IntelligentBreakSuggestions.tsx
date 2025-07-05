
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Coffee, Heart, Users, Phone, TreePine, Sun } from "lucide-react";
import { toast } from "sonner";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

interface BreakSuggestion {
  id: string;
  type: "family" | "solo" | "movement" | "mindful";
  title: string;
  description: string;
  duration: number; // minutes
  icon: React.ReactNode;
  timeOfDay?: "morning" | "afternoon" | "evening";
  energyLevel?: "low" | "medium" | "high";
}

const breakSuggestions: BreakSuggestion[] = [
  {
    id: "family-chat",
    type: "family",
    title: "Quick Family Check-in",
    description: "Call or text a family member to see how they're doing",
    duration: 10,
    icon: <Phone className="h-4 w-4" />,
    timeOfDay: "afternoon"
  },
  {
    id: "family-walk",
    type: "family", 
    title: "Family Walk",
    description: "Take a short walk together, even just around the block",
    duration: 15,
    icon: <Users className="h-4 w-4" />,
    energyLevel: "medium"
  },
  {
    id: "mindful-breathing",
    type: "mindful",
    title: "Breathing Exercise", 
    description: "3 minutes of deep breathing to reset your mind",
    duration: 3,
    icon: <TreePine className="h-4 w-4" />,
    energyLevel: "low"
  },
  {
    id: "coffee-break",
    type: "solo",
    title: "Mindful Coffee/Tea",
    description: "Enjoy a warm drink without distractions",
    duration: 5,
    icon: <Coffee className="h-4 w-4" />
  },
  {
    id: "sunshine-break",
    type: "movement",
    title: "Step Outside",
    description: "Get some fresh air and natural light",
    duration: 8,
    icon: <Sun className="h-4 w-4" />,
    timeOfDay: "morning"
  }
];

export function IntelligentBreakSuggestions() {
  const [currentSuggestions, setCurrentSuggestions] = useState<BreakSuggestion[]>([]);
  const [lastBreakTime, setLastBreakTime] = useState<Date | null>(null);
  const { state } = usePomodoroContext();

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
    
    // Filter suggestions based on time of day and current context
    const contextualSuggestions = breakSuggestions.filter(suggestion => {
      if (suggestion.timeOfDay && suggestion.timeOfDay !== timeOfDay) return false;
      return true;
    }).slice(0, 3);
    
    setCurrentSuggestions(contextualSuggestions);
  }, []);

  const handleTakeBreak = (suggestion: BreakSuggestion) => {
    setLastBreakTime(new Date());
    
    toast.success(`Break Started: ${suggestion.title}`, {
      description: `Take ${suggestion.duration} minutes for: ${suggestion.description}`,
      duration: 5000
    });

    // Set a timer to check back in
    setTimeout(() => {
      toast.info("How was your break?", {
        description: "Rate how refreshed you feel to help us suggest better breaks next time!",
        duration: 8000,
        action: (
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => recordBreakQuality(suggestion.id, "good")}>
              😊 Great
            </Button>
            <Button size="sm" variant="outline" onClick={() => recordBreakQuality(suggestion.id, "okay")}>
              😐 Okay  
            </Button>
          </div>
        )
      });
    }, suggestion.duration * 60 * 1000);
  };

  const recordBreakQuality = (suggestionId: string, quality: "good" | "okay") => {
    console.log(`Break quality recorded: ${suggestionId} - ${quality}`);
    toast.success("Thanks for the feedback! 🙏", {
      description: "We'll use this to suggest better breaks for you.",
      duration: 3000
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "family": return "bg-heart-100 text-heart-700 border-heart-200";
      case "movement": return "bg-green-100 text-green-700 border-green-200"; 
      case "mindful": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <Card className="border-clarity-teal-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-clarity-teal-600" />
          Smart Break Suggestions
        </CardTitle>
        <p className="text-sm text-gray-600">
          Based on your current activity and time of day
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {currentSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded border">
                {suggestion.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{suggestion.title}</p>
                  <Badge className={`text-xs ${getTypeColor(suggestion.type)}`}>
                    {suggestion.type}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{suggestion.description}</p>
                <p className="text-xs text-gray-500 mt-1">{suggestion.duration} minutes</p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={() => handleTakeBreak(suggestion)}
              className="bg-clarity-teal-500 hover:bg-clarity-teal-600"
            >
              Take Break
            </Button>
          </div>
        ))}
        
        {lastBreakTime && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800 font-medium">
                Last break: {lastBreakTime.toLocaleTimeString()}
              </p>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Great job taking care of yourself! 🌟
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
