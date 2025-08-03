import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Calendar, Trophy } from 'lucide-react';
import { MemoryEntry } from '@/hooks/useMemoryBank';

interface ConfidenceTrackerProps {
  memories: MemoryEntry[];
}

export function ConfidenceTracker({ memories }: ConfidenceTrackerProps) {
  const today = new Date().toDateString();
  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const todayMemories = memories.filter(m => 
    new Date(m.created_at).toDateString() === today
  ).length;
  
  const weekMemories = memories.filter(m => 
    new Date(m.created_at) >= thisWeek
  ).length;
  
  const favorites = memories.filter(m => m.is_favorite).length;
  const totalMemories = memories.length;
  
  const confidenceScore = Math.min(100, Math.round(
    (totalMemories * 10) + (favorites * 5) + (weekMemories * 2)
  ));

  const getConfidenceMessage = () => {
    if (confidenceScore >= 80) return "You're building amazing confidence! 🌟";
    if (confidenceScore >= 60) return "Great progress on your memory journey! 💪";
    if (confidenceScore >= 40) return "You're doing wonderful! Keep going! 🎯";
    if (confidenceScore >= 20) return "Every memory counts! You're on your way! 🌱";
    return "Welcome to your confidence journey! 💙";
  };

  const getConfidenceColor = () => {
    if (confidenceScore >= 80) return "text-memory-emerald";
    if (confidenceScore >= 60) return "text-brain-health";
    if (confidenceScore >= 40) return "text-purple-500";
    return "text-blue-500";
  };

  return (
    <Card className="border-2 border-memory-emerald/20 bg-gradient-trust shadow-glow">
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-memory shadow-glow">
              <span className="text-2xl font-bold text-white">{confidenceScore}</span>
            </div>
            <h3 className={`text-xl font-bold ${getConfidenceColor()}`}>
              {getConfidenceMessage()}
            </h3>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-memory-emerald/20 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6 text-memory-emerald" />
              </div>
              <div className="text-2xl font-bold text-memory-emerald">{todayMemories}</div>
              <div className="text-sm text-muted-foreground">Today</div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-brain-health/20 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-brain-health" />
              </div>
              <div className="text-2xl font-bold text-brain-health">{weekMemories}</div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-500">{favorites}</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-yellow-500">{totalMemories}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {totalMemories >= 1 && (
              <Badge className="bg-memory-emerald/20 text-memory-emerald border-memory-emerald/30">
                🌟 First Memory
              </Badge>
            )}
            {totalMemories >= 10 && (
              <Badge className="bg-brain-health/20 text-brain-health border-brain-health/30">
                🚀 Memory Builder
              </Badge>
            )}
            {favorites >= 5 && (
              <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                ❤️ Memory Lover
              </Badge>
            )}
            {weekMemories >= 7 && (
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                🔥 Week Streak
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}