
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Crown, Zap } from "lucide-react";

interface DailyIChooseWidgetProps {
  onUpgradeClick: () => void;
}

export function DailyIChooseWidget({ onUpgradeClick }: DailyIChooseWidgetProps) {
  const todaysStatement = {
    text: "I choose to embrace each moment with courage and celebrate every small victory on my healing journey.",
    category: "Self-Compassion",
    tier: "premium"
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <div className="animate-bounce">
            <Crown className="h-6 w-6 text-amber-500" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Today's #IChoose Statement
          </span>
          <div className="animate-bounce">
            <Sparkles className="h-6 w-6 text-purple-500" />
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Statement */}
        <div className="text-center p-6 bg-white/80 rounded-xl border-2 border-dashed border-purple-300">
          <div className="text-2xl mb-4">💜</div>
          <blockquote className="text-lg font-medium text-gray-800 leading-relaxed italic">
            "{todaysStatement.text}"
          </blockquote>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              {todaysStatement.category}
            </Badge>
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Heart className="h-4 w-4 mr-2" />
            Save to Favorites
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={onUpgradeClick}
          >
            <Zap className="h-4 w-4 mr-2" />
            Get More Statements
          </Button>
        </div>

        {/* Daily Tip */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Morning Ritual Tip</span>
          </div>
          <p className="text-sm text-blue-800">
            Read your #IChoose statement aloud 3 times while taking deep breaths. This activates both your conscious and subconscious mind for lasting positive change.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
