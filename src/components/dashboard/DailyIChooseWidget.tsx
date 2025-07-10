
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Heart, Share2, Crown, Lock } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useUserData } from "@/hooks/use-user-data";
import { getRandomIChooseStatement, type PremiumIChooseStatement } from "@/data/premiumAffirmations";
import { toast } from "sonner";

interface DailyIChooseWidgetProps {
  onUpgradeClick?: () => void;
}

export function DailyIChooseWidget({ onUpgradeClick }: DailyIChooseWidgetProps) {
  const { hasFeature, tier } = useSubscription();
  const userData = useUserData();
  const [currentStatement, setCurrentStatement] = useState<PremiumIChooseStatement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [streak, setStreak] = useState(1);
  const [hasSharedToday, setHasSharedToday] = useState(false);

  const canAccessPremium = hasFeature('personalizedInsights');
  const userType = userData.userType || 'wellness';

  useEffect(() => {
    // Load today's statement
    loadTodaysStatement();
    
    // Check if user has shared today
    const sharedToday = localStorage.getItem(`ichoose_shared_${new Date().toDateString()}`);
    setHasSharedToday(!!sharedToday);
    
    // Load streak
    const savedStreak = localStorage.getItem('ichoose_streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, [userType, canAccessPremium]);

  const loadTodaysStatement = () => {
    const today = new Date().toDateString();
    const savedStatement = localStorage.getItem(`ichoose_statement_${today}`);
    
    if (savedStatement) {
      setCurrentStatement(JSON.parse(savedStatement));
    } else {
      // Get used statement IDs from the last 20 days (or 3 years for premium)
      const maxDays = canAccessPremium ? 1000 : 20;
      const usedIds: string[] = [];
      
      for (let i = 1; i <= maxDays; i++) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - i);
        const pastStatement = localStorage.getItem(`ichoose_statement_${pastDate.toDateString()}`);
        if (pastStatement) {
          const parsed = JSON.parse(pastStatement);
          usedIds.push(parsed.id);
        }
      }
      
      // Get user's current mood (simplified for demo)
      const mood = getUserMood();
      
      const statement = getRandomIChooseStatement(userType, canAccessPremium, mood, usedIds);
      if (statement) {
        setCurrentStatement(statement);
        localStorage.setItem(`ichoose_statement_${today}`, JSON.stringify(statement));
      }
    }
  };

  const getUserMood = (): "great" | "okay" | "struggling" => {
    // In a real app, this would come from mood tracking
    const moods: ("great" | "okay" | "struggling")[] = ["great", "okay", "struggling"];
    return moods[Math.floor(Math.random() * moods.length)];
  };

  const refreshStatement = () => {
    if (!canAccessPremium) {
      toast.error("Upgrade to premium to refresh your daily #IChoose statement!");
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      const usedIds = [currentStatement?.id].filter(Boolean) as string[];
      const mood = getUserMood();
      const newStatement = getRandomIChooseStatement(userType, canAccessPremium, mood, usedIds);
      
      if (newStatement) {
        setCurrentStatement(newStatement);
        const today = new Date().toDateString();
        localStorage.setItem(`ichoose_statement_${today}`, JSON.stringify(newStatement));
        toast.success("New #IChoose statement selected!");
      }
      setIsAnimating(false);
    }, 300);
  };

  const shareStatement = () => {
    if (!currentStatement) return;
    
    const shareText = `${currentStatement.text}\n\n#IChoose #MyRhythm #DailyEmpowerment`;
    
    if (navigator.share) {
      navigator.share({
        title: "My Daily #IChoose Statement",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Statement copied to clipboard!");
    }
    
    // Mark as shared today
    const today = new Date().toDateString();
    localStorage.setItem(`ichoose_shared_${today}`, 'true');
    setHasSharedToday(true);
    
    // Increment streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('ichoose_streak', newStreak.toString());
  };

  const loveStatement = () => {
    if (!currentStatement) return;
    
    toast.success("💙 Statement saved to your favorites!");
    
    // Save to favorites (in real app, this would go to database)
    const favorites = JSON.parse(localStorage.getItem('ichoose_favorites') || '[]');
    if (!favorites.find((f: any) => f.id === currentStatement.id)) {
      favorites.push(currentStatement);
      localStorage.setItem('ichoose_favorites', JSON.stringify(favorites));
    }
  };

  if (!currentStatement) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your daily #IChoose...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-8 text-6xl">✨</div>
        <div className="absolute top-12 right-12 text-4xl">💫</div>
        <div className="absolute bottom-8 left-16 text-5xl">🌟</div>
        <div className="absolute bottom-4 right-8 text-3xl">⚡</div>
      </div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-full animate-pulse">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Today's #IChoose
              </h3>
              <div className="flex items-center gap-2">
                {canAccessPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                <Badge variant="outline" className="bg-white/80">
                  Day {streak} Streak
                </Badge>
              </div>
            </div>
            
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/50">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {currentStatement.theme === 'courage' ? '🦁' : 
                     currentStatement.theme === 'growth' ? '🌱' :
                     currentStatement.theme === 'love' ? '❤️' :
                     currentStatement.theme === 'strength' ? '💪' :
                     currentStatement.theme === 'balance' ? '⚖️' : '✨'}
                  </span>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    "{currentStatement.text}"
                  </p>
                </div>
                
                {currentStatement.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {currentStatement.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {canAccessPremium ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshStatement}
                    disabled={isAnimating}
                    className="text-purple-600 hover:bg-purple-50"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isAnimating ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onUpgradeClick}
                    className="text-purple-600 hover:bg-purple-50"
                  >
                    <Lock className="h-4 w-4 mr-1" />
                    Unlock More
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loveStatement}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Love This
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={shareStatement}
                  className="text-green-600 hover:bg-green-50"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  {hasSharedToday ? 'Shared!' : 'Share'}
                </Button>
              </div>
              
              <div className="text-xs text-gray-500">
                {canAccessPremium ? '1000+ statements available' : `${20 - (streak % 20)} free statements left`}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
