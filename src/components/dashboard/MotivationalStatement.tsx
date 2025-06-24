import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, TrendingUp, Crown, Lock } from "lucide-react";
import { EnhancedAffirmationSystem } from "@/components/affirmations/EnhancedAffirmationSystem";
import { useUserData } from "@/hooks/use-user-data";

// Fallback general growth mindset statements (15 for free users)
const generalGrowthMindsetStatements = [
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
  const userData = useUserData();
  const [currentStatement, setCurrentStatement] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewedCount, setViewedCount] = useState(0);
  const [showEnhancedSystem, setShowEnhancedSystem] = useState(false);

  // Simulate premium status (in real app, this would come from user data)
  const isPremium = false; // This would be: userData.isPremium || false
  const userType = userData.userType; // Now properly typed as UserType

  const generateNewStatement = () => {
    setIsGenerating(true);
    
    // Check if user has seen all free statements
    if (!isPremium && viewedCount >= 15) {
      setTimeout(() => {
        setCurrentStatement("You've explored all 15 free growth mindset statements! Upgrade to unlock 400+ personalized affirmations.");
        setIsGenerating(false);
      }, 500);
      return;
    }

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * generalGrowthMindsetStatements.length);
      setCurrentStatement(generalGrowthMindsetStatements[randomIndex]);
      setViewedCount(prev => prev + 1);
      setIsGenerating(false);
    }, 500);
  };

  const handleUpgradeClick = () => {
    console.log("Upgrade to premium clicked");
    // Here you would integrate with your payment system
  };

  useEffect(() => {
    // Set initial statement
    generateNewStatement();
  }, []);

  // Show enhanced system if user has a specific type and hasn't seen too many
  if (userType && userType !== "wellness-productivity" || showEnhancedSystem) {
    return (
      <EnhancedAffirmationSystem
        userType={userType}
        isPremium={isPremium}
        onUpgradeClick={handleUpgradeClick}
      />
    );
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-full">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-emerald-900">Growth Mindset Moment</h3>
              {!isPremium && (
                <Badge variant="outline" className="text-xs">
                  {15 - viewedCount} free left
                </Badge>
              )}
            </div>
            
            <p className={`text-sm text-emerald-800 leading-relaxed transition-opacity duration-300 mb-3 ${
              isGenerating ? 'opacity-50' : 'opacity-100'
            }`}>
              "{currentStatement}"
            </p>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={generateNewStatement}
                disabled={isGenerating || (!isPremium && viewedCount >= 15)}
                className="h-7 text-xs text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                New Moment
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEnhancedSystem(true)}
                className="h-7 text-xs text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Personalized
              </Button>
            </div>

            {/* Upgrade prompt when free limit reached */}
            {!isPremium && viewedCount >= 15 && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">
                    Unlock 400+ Personalized Affirmations
                  </span>
                </div>
                <p className="text-xs text-amber-700 mb-2">
                  Get category-specific affirmations that adapt to your mood and journey!
                </p>
                <Button
                  size="sm"
                  onClick={handleUpgradeClick}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 h-7 text-xs"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Upgrade Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
