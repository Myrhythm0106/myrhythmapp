import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Heart, Crown, Zap, Share2, BookOpen, RefreshCw } from "lucide-react";
import { useEmpowermentStatements } from "@/hooks/useEmpowermentStatements";
import { useAuth } from "@/contexts/AuthContext";
import { useMobileGestures } from "@/hooks/use-mobile-gestures";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface DailyIChooseWidgetProps {
  onUpgradeClick: () => void;
  userType?: string;
}

export function DailyIChooseWidget({ onUpgradeClick, userType = 'brain-injury' }: DailyIChooseWidgetProps) {
  const { user } = useAuth();
  const [currentStatement, setCurrentStatement] = useState<any>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const {
    statements,
    favorites,
    isLoading,
    selectDailyStatement,
    recordStatementShown,
    toggleFavorite,
    recordInteraction,
    isTogglingFavorite
  } = useEmpowermentStatements(userType, true);

  const { triggerHapticFeedback } = useMobileGestures({
    enableShakeToRefresh: false,
    enableEdgeSwipe: false,
    enableBackGesture: false
  });

  // Initialize with daily statement
  useEffect(() => {
    if (statements.length > 0 && !currentStatement) {
      const dailyStatement = selectDailyStatement();
      if (dailyStatement) {
        setCurrentStatement(dailyStatement);
        if (user) {
          recordStatementShown({
            statementId: dailyStatement.id,
            userMood: undefined,
            userEnergy: undefined
          });
        }
      }
    }
  }, [statements, currentStatement, selectDailyStatement, recordStatementShown, user]);

  const getNewStatement = () => {
    if (statements.length === 0) return;
    
    setIsAnimating(true);
    triggerHapticFeedback('light');
    
    // Get monthly theme from localStorage
    const monthlyTheme = localStorage.getItem("myrhythm_monthly_theme");
    
    let availableStatements = statements.filter(s => s.id !== currentStatement?.id);
    
    // If monthly theme is set, try to find theme-aligned statements first
    if (monthlyTheme && availableStatements.length > 1) {
      const themeAlignedStatements = availableStatements.filter(s => 
        s.tags?.some(tag => 
          tag.toLowerCase().includes(monthlyTheme.toLowerCase()) ||
          s.theme?.toLowerCase().includes(monthlyTheme.toLowerCase()) ||
          s.category?.toLowerCase().includes(monthlyTheme.toLowerCase())
        )
      );
      
      if (themeAlignedStatements.length > 0) {
        availableStatements = themeAlignedStatements;
      }
    }
    
    if (availableStatements.length === 0) return;
    
    const newStatement = availableStatements[Math.floor(Math.random() * availableStatements.length)];
    
    setTimeout(() => {
      setCurrentStatement(newStatement);
      if (user) {
        recordStatementShown({
          statementId: newStatement.id,
          userMood: undefined,
          userEnergy: undefined
        });
      }
      setIsAnimating(false);
    }, 300);

    recordInteraction({
      statementId: currentStatement?.id || '',
      interactionType: 'swipe_new_statement'
    });
  };

  const handleFavorite = () => {
    if (!currentStatement || !user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    triggerHapticFeedback('medium');
    toggleFavorite(currentStatement.id);
    
    const isFavorited = favorites.some(f => f.statement_id === currentStatement.id);
    if (isFavorited) {
      toast.success("Removed from favorites");
    } else {
      toast.success("Added to favorites");
    }

    recordInteraction({
      statementId: currentStatement.id,
      interactionType: 'favorite_toggle',
      interactionData: { favorited: !isFavorited }
    });
  };

  const handleShare = async () => {
    if (!currentStatement) return;

    triggerHapticFeedback('light');
    const shareText = `"${currentStatement.text}" - Daily empowerment from MyRhythm App 💜`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily #IChoose Statement",
          text: shareText,
        });
        toast.success("Statement shared successfully!");
      } catch (error) {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Statement copied to clipboard!");
      } catch (error) {
        toast.error("Unable to copy statement");
      }
    }

    recordInteraction({
      statementId: currentStatement.id,
      interactionType: 'share'
    });
  };

  const handleReflectionToggle = () => {
    setShowReflection(!showReflection);
    triggerHapticFeedback('light');
    
    if (!showReflection) {
      recordInteraction({
        statementId: currentStatement?.id || '',
        interactionType: 'reflection_start'
      });
    }
  };

  const handleReflectionSave = () => {
    if (!reflectionText.trim() || !currentStatement) return;

    recordInteraction({
      statementId: currentStatement.id,
      interactionType: 'reflection_save',
      interactionData: { reflection: reflectionText.trim() }
    });

    toast.success("Reflection saved - Your thoughts have been captured for your journey");

    setReflectionText("");
    setShowReflection(false);
    triggerHapticFeedback('medium');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touchStart.x - touch.clientX;
    const deltaY = Math.abs(touchStart.y - touch.clientY);

    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      if (deltaX > 0) {
        getNewStatement();
      }
    }
    setTouchStart(null);
  };

  const getUserTypeTitle = () => {
    return 'Be Empowered! #IChoose';
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gradient-to-r from-purple-200 to-teal-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gradient-to-r from-purple-200 to-teal-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentStatement) {
    return (
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 shadow-lg">
        <CardContent className="p-8 text-center">
          <p className="text-purple-700">No empowerment statements available for your profile. Please check back later.</p>
        </CardContent>
      </Card>
    );
  }

  const isFavorited = favorites.some(f => f.statement_id === currentStatement?.id);

  return (
    <Card 
      className="border border-purple-200/60 bg-gradient-to-br from-purple-50/40 via-blue-50/30 to-teal-50/40 shadow-md touch-pan-y select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <CardHeader className="text-center pb-3">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <Crown className="h-5 w-5 text-amber-500" />
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            {getUserTypeTitle()}
          </span>
          <Sparkles className="h-5 w-5 text-purple-500" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Compact Statement */}
        <motion.div 
          className="text-center p-4 bg-white/70 rounded-lg border border-purple-200/50"
          animate={isAnimating ? { scale: 0.95, opacity: 0.7 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <blockquote className="text-base font-medium text-gray-800 leading-relaxed italic mb-3">
            "{currentStatement.text}"
          </blockquote>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="clarity" className="text-xs px-2 py-1">
              {currentStatement.category}
            </Badge>
            {currentStatement.tier === 'premium' && (
              <Badge variant="premium" className="text-xs px-2 py-1">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Compact Action Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-4">
            <button
              onClick={handleFavorite}
              disabled={isTogglingFavorite}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <Heart className={`h-3 w-3 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
              <span>{isFavorited ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <Share2 className="h-3 w-3" />
              <span>Share</span>
            </button>

            <button
              onClick={handleReflectionToggle}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <BookOpen className="h-3 w-3" />
              <span>Reflect</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={getNewStatement}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>New</span>
            </button>

            <Button 
              size="sm"
              variant="premium"
              className="text-xs px-2 py-1 h-6"
              onClick={onUpgradeClick}
            >
              <Zap className="h-2 w-2 mr-1" />
              More
            </Button>
          </div>
        </div>

        {/* Expandable Reflection */}
        <AnimatePresence>
          {showReflection && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-blue-50/60 via-purple-50/50 to-teal-50/60 rounded-lg border border-blue-200 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Your Reflection</span>
                </div>
                <Textarea
                  placeholder="How does this statement resonate with you today? What actions will you take?"
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  className="min-h-[80px] bg-white/80 border-blue-200 focus:border-blue-400"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-600">{reflectionText.length}/500 characters</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowReflection(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleReflectionSave}
                      disabled={!reflectionText.trim()}
                      className="text-xs bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700"
                    >
                      Save Reflection
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Daily Tip */}
        {!showReflection && (
          <div className="p-3 bg-gradient-to-r from-blue-50/40 via-purple-50/30 to-teal-50/40 rounded-md border border-blue-100/50">
            <p className="text-xs text-blue-700 text-center">
              💡 Read aloud 3x while breathing deeply. Swipe left for new statement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
