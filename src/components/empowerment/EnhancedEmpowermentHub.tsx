
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  RefreshCw, 
  Sparkles, 
  Star, 
  Share2, 
  BookOpen,
  Crown,
  Lock,
  Zap
} from 'lucide-react';
import { useEmpowermentStatements } from '@/hooks/useEmpowermentStatements';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface EnhancedEmpowermentHubProps {
  userType?: string;
  hasPremiumAccess?: boolean;
  currentStreak?: number;
  mood?: 'great' | 'okay' | 'struggling';
}

export function EnhancedEmpowermentHub({ 
  userType = 'brain-injury',
  hasPremiumAccess = false,
  currentStreak = 0,
  mood
}: EnhancedEmpowermentHubProps) {
  const [currentStatement, setCurrentStatement] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

  const {
    statements,
    favorites,
    selectDailyStatement,
    recordInteraction,
    recordStatementShown,
    toggleFavorite,
    isRecordingInteraction,
    isTogglingFavorite
  } = useEmpowermentStatements(userType, hasPremiumAccess, mood);

  // Select initial statement
  useEffect(() => {
    if (statements.length > 0 && !currentStatement) {
      const statement = selectDailyStatement();
      if (statement) {
        setCurrentStatement(statement);
        recordStatementShown({ 
          statementId: statement.id, 
          userMood: mood,
          userEnergy: 8 // Default energy level
        });
      }
    }
  }, [statements, currentStatement, selectDailyStatement, recordStatementShown, mood]);

  const handleRefreshStatement = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      const newStatement = selectDailyStatement();
      if (newStatement) {
        setCurrentStatement(newStatement);
        recordStatementShown({ 
          statementId: newStatement.id, 
          userMood: mood 
        });
        recordInteraction({ 
          statementId: newStatement.id, 
          interactionType: 'refreshed' 
        });
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleFavorite = () => {
    if (!currentStatement) return;
    
    toggleFavorite(currentStatement.id);
    recordInteraction({ 
      statementId: currentStatement.id, 
      interactionType: 'favorited' 
    });
    
    toast.success('Statement saved to favorites!');
  };

  const handleShare = async () => {
    if (!currentStatement) return;
    
    try {
      await navigator.share({
        title: 'Daily Empowerment',
        text: currentStatement.text,
        url: window.location.href
      });
      
      recordInteraction({ 
        statementId: currentStatement.id, 
        interactionType: 'shared' 
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(currentStatement.text);
      toast.success('Statement copied to clipboard!');
    }
  };

  const handleReflection = () => {
    if (!currentStatement) return;
    
    if (showReflection && reflectionText.trim()) {
      recordInteraction({ 
        statementId: currentStatement.id, 
        interactionType: 'reflected',
        interactionData: { reflection: reflectionText }
      });
      toast.success('Reflection saved!');
      setReflectionText('');
    }
    
    setShowReflection(!showReflection);
  };

  const isFavorited = currentStatement && favorites.some(f => f.statement_id === currentStatement.id);
  const freeStatementsUsed = Math.min(currentStreak * 2, 60); // 2 per day for 30 days
  const premiumStatementsAvailable = Math.max(700 - freeStatementsUsed, 0);

  if (!currentStatement) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <Sparkles className="h-12 w-12 mx-auto text-purple-500 mb-4" />
            <p className="text-lg text-gray-600">Loading your daily empowerment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Empowerment Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-8 text-6xl">🚀</div>
          <div className="absolute top-12 right-12 text-4xl">⚡</div>
          <div className="absolute bottom-8 left-16 text-5xl">🌟</div>
          <div className="absolute bottom-4 right-8 text-3xl">💪</div>
        </div>

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-full animate-pulse">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Your Daily #IChoose Empowerment
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Day {currentStreak + 1} of your empowerment journey
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {currentStatement.tier !== 'free' && (
                <Badge variant="outline" className="bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300">
                  <Crown className="h-3 w-3 mr-1 text-amber-600" />
                  {currentStatement.tier === 'premium' ? 'Premium' : 'Family'}
                </Badge>
              )}
              <Badge variant="outline" className="bg-white/80">
                {currentStatement.category}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          {/* Statement Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStatement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
            >
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-white/50 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">
                    {currentStatement.theme === 'growth' ? '🌱' :
                     currentStatement.theme === 'strength' ? '💪' :
                     currentStatement.theme === 'love' ? '❤️' :
                     currentStatement.theme === 'wisdom' ? '🧠' :
                     currentStatement.theme === 'peace' ? '🕊️' : '✨'}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-800 leading-relaxed mb-3">
                      "{currentStatement.text}"
                    </p>
                    {currentStatement.tags && (
                      <div className="flex flex-wrap gap-2">
                        {currentStatement.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Reflection Section */}
          <AnimatePresence>
            {showReflection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/50"
              >
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="How does this statement resonate with you today? What actions will you take?"
                  className="w-full h-24 p-3 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshStatement}
                disabled={isAnimating}
                className="text-purple-600 hover:bg-purple-50"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isAnimating ? 'animate-spin' : ''}`} />
                New #IChoose
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                disabled={isTogglingFavorite}
                className={`${isFavorited ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Heart className={`h-4 w-4 mr-1 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Favorite'}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-blue-600 hover:bg-blue-50"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReflection}
                className="text-green-600 hover:bg-green-50"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                {showReflection ? 'Save Reflection' : 'Reflect'}
              </Button>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Memory1st → LEAP Empowerment</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Upgrade Teaser */}
      {!hasPremiumAccess && freeStatementsUsed >= 50 && (
        <Card className="border-2 border-gradient-to-r from-amber-200 to-yellow-200 bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-amber-800">
                    Unlock {premiumStatementsAvailable}+ Premium Empowerment Statements
                  </h4>
                  <p className="text-sm text-amber-700">
                    Personalized for your journey with advanced features
                  </p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                <Lock className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{freeStatementsUsed}</div>
            <div className="text-sm text-gray-600">Statements Experienced</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{favorites.length}</div>
            <div className="text-sm text-gray-600">Favorites Saved</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{currentStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
