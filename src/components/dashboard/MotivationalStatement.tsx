
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

const motivationalStatements = [
  "I am stronger than my challenges and capable of amazing things.",
  "Every small step I take today moves me closer to my goals.",
  "I have the power to create positive change in my life.",
  "My brain is healing and growing stronger every day.",
  "I choose to focus on progress, not perfection.",
  "I am resilient, and I can handle whatever comes my way.",
  "Today is a new opportunity to be the best version of myself.",
  "I trust in my ability to overcome obstacles and thrive.",
  "My journey is unique, and I celebrate every victory along the way.",
  "I am worthy of love, success, and happiness.",
  "I have the courage to face challenges with confidence.",
  "Each day brings new possibilities for growth and healing.",
  "I am building a life filled with purpose and joy.",
  "My strength comes from within, and it grows every day.",
  "I choose to see opportunities where others see obstacles."
];

export function MotivationalStatement() {
  const [currentStatement, setCurrentStatement] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewStatement = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * motivationalStatements.length);
      setCurrentStatement(motivationalStatements[randomIndex]);
      setIsGenerating(false);
    }, 500);
  };

  useEffect(() => {
    // Set initial statement
    generateNewStatement();
  }, []);

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 mb-2">Your Daily Affirmation</h3>
            <p className={`text-sm text-blue-800 leading-relaxed transition-opacity duration-300 ${
              isGenerating ? 'opacity-50' : 'opacity-100'
            }`}>
              "{currentStatement}"
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateNewStatement}
              disabled={isGenerating}
              className="mt-2 h-7 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
              New Affirmation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
