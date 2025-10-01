import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart, Sparkles, Target, Brain } from "lucide-react";
import { getRandomIChooseStatement } from "@/data/premiumAffirmations";
import { useAffirmationTracker } from "@/hooks/useAffirmationTracker";

interface MonthlyIChooseWidgetProps {
  onUpgradeClick?: () => void;
  userType?: string;
  monthlyTheme?: string;
}

export function MonthlyIChooseWidget({ 
  onUpgradeClick, 
  userType = "recovery", 
  monthlyTheme 
}: MonthlyIChooseWidgetProps) {
  const [currentStatement, setCurrentStatement] = useState(() =>
    getRandomIChooseStatement(userType, false, 'great', [], monthlyTheme)
  );

  const { dayCount, showReinforcement, isRepeating } = useAffirmationTracker(
    currentStatement?.text || ''
  );

  const refreshStatement = () => {
    const newStatement = getRandomIChooseStatement(
      userType, 
      false, 
      'great', 
      currentStatement ? [currentStatement.id] : [],
      monthlyTheme
    );
    setCurrentStatement(newStatement);
  };

  if (!currentStatement) {
    return null;
  }

  const getThemeIcon = () => {
    if (currentStatement.category === 'confidence') return Target;
    if (currentStatement.category === 'strength') return Heart;
    return Sparkles;
  };

  const ThemeIcon = getThemeIcon();

  return (
    <Card className="premium-card border-2 border-primary/30 bg-gradient-to-br from-brain-health-400/15 via-clarity-teal-400/15 to-memory-emerald-400/15 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with enhanced prominence */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white shadow-lg">
                <ThemeIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text-brand">
                  Today's #IChoose
                </h2>
                <p className="text-sm text-muted-foreground">
                  {monthlyTheme ? `Aligned with: ${monthlyTheme}` : 'Daily empowerment'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshStatement}
              className="h-8 w-8 p-0 hover:bg-brain-health-100"
            >
              <RefreshCw className="h-4 w-4 text-brain-health-600" />
            </Button>
          </div>

          {/* Statement */}
          <div className="text-center py-4">
            <blockquote className="text-lg font-medium text-brain-health-700 leading-relaxed">
              "{currentStatement.text}"
            </blockquote>
            
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-brain-health-600">
              <div className="w-1 h-1 bg-brain-health-400 rounded-full"></div>
              <span className="uppercase tracking-wide font-medium">
                {currentStatement.theme} • {currentStatement.category}
              </span>
              <div className="w-1 h-1 bg-brain-health-400 rounded-full"></div>
            </div>

            {/* Subtle repetition indicator */}
            {isRepeating && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-brain-health-500">
                <Brain className="h-3 w-3" />
                <span>Day {dayCount} of building this neural pathway</span>
              </div>
            )}
          </div>

          {/* Action with optional reinforcement message */}
          <div className="text-center">
            <p className="text-xs text-brain-health-600 mb-2">
              Speak it. Believe it. Live it.
            </p>
            {showReinforcement && (
              <p className="text-xs text-brain-health-500/80 italic mt-1">
                Repetition builds neural pathways for success
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}