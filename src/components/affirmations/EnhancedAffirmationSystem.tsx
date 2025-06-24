
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Crown, RefreshCw, Lock, TrendingUp, Heart } from "lucide-react";
import { toast } from "sonner";
import { 
  CategoryAffirmation, 
  getAffirmationsByCategory, 
  getAffirmationByMoodAndCategory,
  getFreeAffirmationsCount,
  getPremiumAffirmationsCount 
} from "@/data/categoryAffirmations";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";

interface EnhancedAffirmationSystemProps {
  userType: UserType;
  currentMood?: "great" | "okay" | "struggling";
  isPremium?: boolean;
  onUpgradeClick?: () => void;
}

export function EnhancedAffirmationSystem({ 
  userType, 
  currentMood, 
  isPremium = false,
  onUpgradeClick 
}: EnhancedAffirmationSystemProps) {
  const [currentAffirmation, setCurrentAffirmation] = useState<CategoryAffirmation | null>(null);
  const [viewedAffirmations, setViewedAffirmations] = useState<string[]>([]);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const availableAffirmations = isPremium 
    ? getAffirmationsByCategory(userType, true)
    : getAffirmationsByCategory(userType, false);

  const freeCount = getFreeAffirmationsCount(userType);
  const premiumCount = getPremiumAffirmationsCount(userType);
  const totalAvailable = isPremium ? freeCount + premiumCount : freeCount;

  // Get mood-specific affirmations if mood is provided
  const getMoodAffirmations = () => {
    if (!currentMood) return availableAffirmations;
    
    const moodSpecific = currentMood 
      ? getAffirmationByMoodAndCategory(userType, currentMood, isPremium)
      : [];
    
    // If no mood-specific affirmations, fall back to general ones
    return moodSpecific.length > 0 ? moodSpecific : availableAffirmations;
  };

  const generateNewAffirmation = () => {
    const moodAffirmations = getMoodAffirmations();
    
    if (moodAffirmations.length === 0) return;

    // For free users, check if they've seen all available affirmations
    if (!isPremium && viewedAffirmations.length >= freeCount) {
      setShowUpgradePrompt(true);
      toast.info("You've seen all your free affirmations! 💎", {
        description: `Unlock ${premiumCount}+ more personalized affirmations with Premium`,
        duration: 6000
      });
      return;
    }

    // Get unviewed affirmations first
    const unviewedAffirmations = moodAffirmations.filter(
      aff => !viewedAffirmations.includes(aff.text)
    );

    let selectedAffirmation: CategoryAffirmation;
    
    if (unviewedAffirmations.length > 0) {
      // Select from unviewed affirmations
      const randomIndex = Math.floor(Math.random() * unviewedAffirmations.length);
      selectedAffirmation = unviewedAffirmations[randomIndex];
    } else {
      // All affirmations have been viewed, start over
      const randomIndex = Math.floor(Math.random() * moodAffirmations.length);
      selectedAffirmation = moodAffirmations[randomIndex];
      setViewedAffirmations([]); // Reset viewed list
    }

    setCurrentAffirmation(selectedAffirmation);
    setViewedAffirmations(prev => [...prev, selectedAffirmation.text]);
  };

  // Initialize with first affirmation
  useEffect(() => {
    if (availableAffirmations.length > 0 && !currentAffirmation) {
      generateNewAffirmation();
    }
  }, [userType, isPremium]);

  // Update affirmation when mood changes
  useEffect(() => {
    if (currentMood && currentAffirmation) {
      generateNewAffirmation();
    }
  }, [currentMood]);

  const handleUpgrade = () => {
    onUpgradeClick?.();
    toast.success("Ready to unlock your full potential! 🚀", {
      description: "Premium affirmations will help accelerate your growth journey"
    });
  };

  const getCategoryTitle = (category: UserType): string => {
    const titles = {
      'brain-injury-recovery': 'Recovery & Growth Affirmations',
      'cognitive-optimization': 'Peak Performance Affirmations', 
      'caregiver-support': 'Caregiver Strength Affirmations',
      'wellness-productivity': 'Life Optimization Affirmations'
    };
    return titles[category];
  };

  const getCategoryIcon = (category: UserType) => {
    const icons = {
      'brain-injury-recovery': <Heart className="h-5 w-5" />,
      'cognitive-optimization': <TrendingUp className="h-5 w-5" />,
      'caregiver-support': <Heart className="h-5 w-5" />,
      'wellness-productivity': <Sparkles className="h-5 w-5" />
    };
    return icons[category];
  };

  if (!availableAffirmations.length) {
    return (
      <Card className="text-center p-6">
        <CardContent>
          <p className="text-muted-foreground">No affirmations available for your category.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getCategoryIcon(userType)}
              <span className="text-lg">{getCategoryTitle(userType)}</span>
            </div>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </CardTitle>
          
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Affirmations Explored</span>
              <span>{Math.min(viewedAffirmations.length, totalAvailable)}/{totalAvailable}</span>
            </div>
            <Progress 
              value={(Math.min(viewedAffirmations.length, totalAvailable) / totalAvailable) * 100} 
              className="h-2"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentAffirmation && (
            <div className="bg-white/70 rounded-lg p-6 border border-white/50">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <blockquote className="text-lg font-medium italic text-gray-800 leading-relaxed">
                  "{currentAffirmation.text}"
                </blockquote>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {currentAffirmation.subcategory}
                  </Badge>
                  {currentAffirmation.mood && (
                    <Badge variant="outline" className="text-xs">
                      {currentAffirmation.mood} mood
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={generateNewAffirmation}
              className="flex-1"
              disabled={!isPremium && viewedAffirmations.length >= freeCount}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              New Affirmation
            </Button>
          </div>

          {/* Upgrade prompt for free users */}
          {showUpgradePrompt && !isPremium && (
            <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
              <CardContent className="p-4 text-center space-y-3">
                <div className="flex justify-center">
                  <Lock className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900">Unlock Your Full Potential</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    You've explored all {freeCount} free affirmations. 
                    Get access to {premiumCount}+ more personalized affirmations with Premium!
                  </p>
                </div>
                <Button 
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Free user progress reminder */}
          {!isPremium && !showUpgradePrompt && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {freeCount - viewedAffirmations.length} free affirmations remaining
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Unlock {premiumCount}+ more with Premium
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
