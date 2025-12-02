import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  brainBoostData, 
  getRandomBrainBoost, 
  getCategoryEmoji, 
  getCategoryLabel,
  BrainBoostItem 
} from '@/data/brainBoostData';
import { RefreshCw, Info, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const STORAGE_KEY = 'brain-boost-history';
const DAILY_KEY = 'brain-boost-daily';

interface BrainBoostWidgetProps {
  className?: string;
}

export function BrainBoostWidget({ className = '' }: BrainBoostWidgetProps) {
  const [currentItem, setCurrentItem] = useState<BrainBoostItem | null>(null);
  const [showBenefit, setShowBenefit] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load daily item or get new one
  useEffect(() => {
    const loadDailyItem = () => {
      const stored = localStorage.getItem(DAILY_KEY);
      if (stored) {
        const { date, itemId, completed } = JSON.parse(stored);
        const today = new Date().toDateString();
        
        if (date === today) {
          const item = brainBoostData.find(i => i.id === itemId);
          if (item) {
            setCurrentItem(item);
            setIsCompleted(completed);
            return;
          }
        }
      }
      
      // New day or no stored item
      const newItem = getRandomBrainBoost();
      setCurrentItem(newItem);
      setIsCompleted(false);
      saveDailyItem(newItem.id, false);
    };

    loadDailyItem();
  }, []);

  const saveDailyItem = (itemId: string, completed: boolean) => {
    localStorage.setItem(DAILY_KEY, JSON.stringify({
      date: new Date().toDateString(),
      itemId,
      completed
    }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setShowBenefit(false);
    
    // Get viewed items to avoid repeats
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let available = brainBoostData.filter(item => !history.includes(item.id));
    
    // Reset history if we've seen everything
    if (available.length === 0) {
      localStorage.setItem(STORAGE_KEY, '[]');
      available = brainBoostData;
    }
    
    const newItem = available[Math.floor(Math.random() * available.length)];
    
    setTimeout(() => {
      setCurrentItem(newItem);
      setIsCompleted(false);
      setIsRefreshing(false);
      saveDailyItem(newItem.id, false);
      
      // Update history
      const updatedHistory = [...history, newItem.id].slice(-50); // Keep last 50
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    }, 300);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setShowBenefit(true);
    if (currentItem) {
      saveDailyItem(currentItem.id, true);
    }
    toast.success("Great job! 🎉", {
      description: "You engaged with your daily brain boost!"
    });
  };

  if (!currentItem) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 overflow-hidden">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryEmoji(currentItem.category)}</span>
              <div>
                <h3 className="font-semibold text-sm">Daily Brain Boost</h3>
                <Badge variant="secondary" className="text-xs mt-0.5">
                  {getCategoryLabel(currentItem.category)}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-muted-foreground hover:text-primary"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-foreground leading-relaxed mb-4">
                {currentItem.content}
              </p>

              {/* Source (for facts/trivia) */}
              {currentItem.source && (
                <p className="text-xs text-muted-foreground mb-3">
                  — {currentItem.source}
                </p>
              )}

              {/* Difficulty badge for challenges */}
              {currentItem.difficulty && (
                <Badge 
                  variant="outline" 
                  className={`mb-3 ${
                    currentItem.difficulty === 'easy' ? 'border-green-500 text-green-600' :
                    currentItem.difficulty === 'medium' ? 'border-yellow-500 text-yellow-600' :
                    'border-red-500 text-red-600'
                  }`}
                >
                  {currentItem.difficulty.charAt(0).toUpperCase() + currentItem.difficulty.slice(1)}
                </Badge>
              )}

              {/* Benefit Section - Discreet Toggle */}
              <div className="mt-3">
                <button
                  onClick={() => setShowBenefit(!showBenefit)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>Why this helps</span>
                  {showBenefit ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
                
                <AnimatePresence>
                  {showBenefit && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {currentItem.benefit}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                {currentItem.category === 'challenge' && !isCompleted && (
                  <Button
                    onClick={handleComplete}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    I Did It!
                  </Button>
                )}
                
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-green-600"
                  >
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium">Completed!</span>
                  </motion.div>
                )}

                {currentItem.category !== 'challenge' && !isCompleted && (
                  <Button
                    onClick={handleComplete}
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    Got it!
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
