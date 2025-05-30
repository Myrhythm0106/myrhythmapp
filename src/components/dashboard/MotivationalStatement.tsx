
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, TrendingUp } from "lucide-react";

const growthMindsetStatements = [
  "Every challenge is an opportunity to grow stronger and wiser.",
  "My brain has the amazing ability to form new connections every day.",
  "Mistakes are proof that I'm learning and pushing my boundaries.",
  "I can improve my abilities through dedication and hard work.",
  "Challenges help me discover strengths I never knew I had.",
  "My potential for growth is limitless - I'm constantly evolving.",
  "Each small step forward builds my resilience and confidence.",
  "I embrace difficulties as chances to develop new skills.",
  "My effort and persistence are more important than natural talent.",
  "When I face setbacks, I'm building the foundation for comebacks.",
  "I choose to see obstacles as opportunities in disguise.",
  "My brain is like a muscle - the more I use it, the stronger it gets.",
  "Today's struggles are tomorrow's strengths in the making.",
  "I am not defined by my past - I am shaped by my growth.",
  "Every 'not yet' is a step closer to 'I can do this'."
];

export function MotivationalStatement() {
  const [currentStatement, setCurrentStatement] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewStatement = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * growthMindsetStatements.length);
      setCurrentStatement(growthMindsetStatements[randomIndex]);
      setIsGenerating(false);
    }, 500);
  };

  useEffect(() => {
    // Set initial statement
    generateNewStatement();
  }, []);

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-full">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-emerald-900 mb-2">Growth Mindset Moment</h3>
            <p className={`text-sm text-emerald-800 leading-relaxed transition-opacity duration-300 ${
              isGenerating ? 'opacity-50' : 'opacity-100'
            }`}>
              "{currentStatement}"
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateNewStatement}
              disabled={isGenerating}
              className="mt-2 h-7 text-xs text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
              New Growth Moment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
