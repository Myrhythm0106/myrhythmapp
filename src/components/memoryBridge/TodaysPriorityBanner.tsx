import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Flame, Target, Zap, Crown, ArrowRight, Sparkles, TrendingUp, Heart } from 'lucide-react';

interface TodaysPriorityBannerProps {
  className?: string;
}

interface TodaysPriority {
  id: string;
  title: string;
  priority: number;
  emotionalStakes?: string;
  category: 'growth' | 'relationships' | 'health' | 'achievement';
}

const priorityIcons = {
  1: Target,
  2: Target, 
  3: Zap,
  4: Star,
  5: Flame
};

const categoryGradients = {
  growth: 'from-memory-emerald-500 to-brain-health-500',
  relationships: 'from-heart-pink-400 to-memory-emerald-500', 
  health: 'from-clarity-teal-500 to-sunrise-amber-400',
  achievement: 'from-sunrise-amber-500 to-memory-emerald-600'
};

const motivationalMessages = [
  "You're building something incredible - one priority at a time! 💪",
  "Every focused action creates ripples of positive change 🌊",
  "Your commitment to growth inspires everyone around you ✨",
  "Progress over perfection - you're exactly where you need to be 🎯",
  "The journey of a thousand miles begins with this one priority 🚀",
  "Your future self is cheering you on right now! 📈"
];

export function TodaysPriorityBanner({ className }: TodaysPriorityBannerProps) {
  const [todaysPriority, setTodaysPriority] = useState<TodaysPriority | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    // Load from localStorage or set default
    const stored = localStorage.getItem('todays-priority');
    if (stored) {
      setTodaysPriority(JSON.parse(stored));
    } else {
      // Default inspiring priority
      setTodaysPriority({
        id: 'default',
        title: 'Focus on meaningful progress',
        priority: 4,
        emotionalStakes: 'Every small step builds unstoppable momentum',
        category: 'growth'
      });
    }
    
    // Random motivational message
    setMotivationalMessage(
      motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
    );
  }, []);

  const handleUpdatePriority = () => {
    // For now, cycle through sample priorities
    const samplePriorities: TodaysPriority[] = [
      {
        id: '1',
        title: 'Connect authentically with someone important',
        priority: 5,
        emotionalStakes: 'Relationships are the foundation of a fulfilling life',
        category: 'relationships'
      },
      {
        id: '2', 
        title: 'Take one step toward your biggest goal',
        priority: 4,
        emotionalStakes: 'Progress compounds - today\'s action is tomorrow\'s breakthrough',
        category: 'achievement'
      },
      {
        id: '3',
        title: 'Practice self-care and energy renewal',
        priority: 3,
        emotionalStakes: 'You can\'t pour from an empty cup',
        category: 'health'
      },
      {
        id: '4',
        title: 'Learn something that expands your perspective', 
        priority: 4,
        emotionalStakes: 'Growth mindset creates infinite possibilities',
        category: 'growth'
      }
    ];
    
    const currentIndex = samplePriorities.findIndex(p => p.id === todaysPriority?.id);
    const nextPriority = samplePriorities[(currentIndex + 1) % samplePriorities.length];
    
    setTodaysPriority(nextPriority);
    localStorage.setItem('todays-priority', JSON.stringify(nextPriority));
    
    // New motivational message
    setMotivationalMessage(
      motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
    );
  };

  if (!todaysPriority) return null;

  const PriorityIcon = priorityIcons[todaysPriority.priority as keyof typeof priorityIcons];
  const gradient = categoryGradients[todaysPriority.category];

  return (
    <Card className={`border-2 border-memory-emerald-200/50 bg-gradient-to-r ${gradient}/10 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Header with icon */}
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-full bg-gradient-to-r ${gradient} shadow-lg`}>
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-brain-health-900">
                  Today's Life Priority
                </h3>
                <Badge className={`bg-gradient-to-r ${gradient} text-white px-2 py-1 gap-1`}>
                  <PriorityIcon className="h-3 w-3" />
                  Level {todaysPriority.priority}
                </Badge>
              </div>
            </div>

            {/* Priority content */}
            <div className="space-y-2">
              <p className="text-base font-semibold text-memory-emerald-800 leading-relaxed">
                {todaysPriority.title}
              </p>
              {todaysPriority.emotionalStakes && (
                <p className="text-sm text-brain-health-700 italic flex items-start gap-2">
                  <Heart className="h-4 w-4 text-heart-pink-500 mt-0.5 flex-shrink-0" />
                  {todaysPriority.emotionalStakes}
                </p>
              )}
            </div>

            {/* Motivational message */}
            <div className="bg-white/70 rounded-lg p-3 border border-memory-emerald-200/30">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-memory-emerald-600" />
                <p className="text-sm text-memory-emerald-700 font-medium">
                  {motivationalMessage}
                </p>
              </div>
            </div>

            {/* Action indicators */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-brain-health-600">
                <TrendingUp className="h-3 w-3" />
                <span>Growth Mindset Active</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brain-health-600">
                <Target className="h-3 w-3" />
                <span>Life-Empowering Focus</span>
              </div>
            </div>
          </div>

          {/* Update button */}
          <Button
            onClick={handleUpdatePriority}
            variant="outline"
            size="sm"
            className="ml-4 border-memory-emerald-300 text-memory-emerald-700 hover:bg-memory-emerald-50 gap-2"
          >
            <ArrowRight className="h-3 w-3" />
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}