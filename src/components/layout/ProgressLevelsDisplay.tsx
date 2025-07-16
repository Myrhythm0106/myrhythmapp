import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Lock, 
  CheckCircle, 
  Target,
  Calendar,
  Heart,
  Gamepad2,
  MessageCircle,
  BarChart3,
  TrendingUp,
  BookOpen,
  Users,
  Crown,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserProgress } from '@/hooks/useUserProgress';

interface ProgressLevel {
  name: string;
  range: [number, number];
  color: string;
  badge: string;
  description: string;
  features: {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    unlockLevel: number;
    description: string;
  }[];
}

const PROGRESS_LEVELS: ProgressLevel[] = [
  {
    name: 'Getting Started',
    range: [0, 34],
    color: 'from-green-500 to-emerald-600',
    badge: 'Beginner',
    description: 'Build your foundation with core features',
    features: [
      { id: 'dashboard', name: 'Dashboard', icon: Target, unlockLevel: 0, description: 'Your personalized overview' },
      { id: 'calendar', name: 'Calendar', icon: Calendar, unlockLevel: 0, description: 'Schedule and track events' },
      { id: 'accountability', name: 'Accountability', icon: Users, unlockLevel: 0, description: 'Support network features' },
    ]
  },
  {
    name: 'Growing',
    range: [35, 69],
    color: 'from-blue-500 to-indigo-600',
    badge: 'Intermediate',
    description: 'Expand your toolkit with growth features',
    features: [
      { id: 'goals', name: 'Goals', icon: Target, unlockLevel: 25, description: 'Set and track personal goals' },
      { id: 'gratitude', name: 'Gratitude', icon: BookOpen, unlockLevel: 30, description: 'Daily gratitude practice' },
      { id: 'mood-tracking', name: 'Mood Tracking', icon: Heart, unlockLevel: 35, description: 'Monitor emotional wellbeing' },
      { id: 'brain-games', name: 'Brain Games', icon: Gamepad2, unlockLevel: 40, description: 'Cognitive enhancement exercises' },
      { id: 'notes', name: 'Notes', icon: BookOpen, unlockLevel: 45, description: 'Personal knowledge management' },
    ]
  },
  {
    name: 'Power User',
    range: [70, 100],
    color: 'from-purple-500 to-pink-600',
    badge: 'Advanced',
    description: 'Master advanced features and analytics',
    features: [
      { id: 'community', name: 'Community', icon: MessageCircle, unlockLevel: 60, description: 'Connect with others' },
      { id: 'strategy', name: 'Strategy', icon: TrendingUp, unlockLevel: 65, description: 'Advanced planning tools' },
      { id: 'analytics', name: 'Analytics', icon: BarChart3, unlockLevel: 75, description: 'Deep insights and metrics' },
    ]
  }
];

export function ProgressLevelsDisplay() {
  const { metrics, unlockedFeatures } = useUserProgress();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentLevel = PROGRESS_LEVELS.find(level => 
    metrics.readinessScore >= level.range[0] && metrics.readinessScore <= level.range[1]
  ) || PROGRESS_LEVELS[0];

  const nextLevel = PROGRESS_LEVELS.find(level => 
    metrics.readinessScore < level.range[0]
  );

  const getFeatureStatus = (feature: any) => {
    if (feature.unlockLevel === 0) return 'unlocked';
    if (unlockedFeatures.includes(feature.id) || metrics.readinessScore >= feature.unlockLevel) return 'unlocked';
    return 'locked';
  };

  const unlockedCount = PROGRESS_LEVELS.flatMap(level => level.features)
    .filter(feature => getFeatureStatus(feature) === 'unlocked').length;
  
  const totalFeatures = PROGRESS_LEVELS.flatMap(level => level.features).length;

  return (
    <Card className="mx-2 mb-4 bg-gradient-to-br from-white to-purple-50/50 border-purple-200">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-purple-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-3 w-3 rounded-full bg-gradient-to-r",
                  currentLevel.color
                )} />
                <CardTitle className="text-sm font-medium">
                  Progress Journey
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn(
                  "text-xs",
                  currentLevel.name === 'Power User' && "bg-purple-50 text-purple-700 border-purple-200",
                  currentLevel.name === 'Growing' && "bg-blue-50 text-blue-700 border-blue-200",
                  currentLevel.name === 'Getting Started' && "bg-green-50 text-green-700 border-green-200"
                )}>
                  {currentLevel.badge}
                </Badge>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{unlockedCount}/{totalFeatures} features unlocked</span>
                <span>{metrics.readinessScore}/100 points</span>
              </div>
              <Progress 
                value={metrics.readinessScore} 
                className="h-2" 
                indicatorClassName={cn("bg-gradient-to-r", currentLevel.color)}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <p className="text-xs text-muted-foreground">
              {currentLevel.description}
            </p>

            {/* Current Level Features */}
            <div className="space-y-3">
              {PROGRESS_LEVELS.map((level, levelIndex) => {
                const isCurrentLevel = level.name === currentLevel.name;
                const isCompletedLevel = metrics.readinessScore > level.range[1];
                const isUpcomingLevel = metrics.readinessScore < level.range[0];

                return (
                  <div key={level.name} className={cn(
                    "rounded-lg border p-3 transition-all",
                    isCurrentLevel && "border-purple-200 bg-purple-50/50",
                    isCompletedLevel && "border-green-200 bg-green-50/30",
                    isUpcomingLevel && "border-gray-200 bg-gray-50/30"
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full bg-gradient-to-r",
                        level.color
                      )} />
                      <span className="text-sm font-medium">{level.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {level.range[0]}-{level.range[1]} points
                      </Badge>
                      {isCompletedLevel && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {level.features.map((feature) => {
                        const status = getFeatureStatus(feature);
                        const Icon = feature.icon;
                        
                        return (
                          <div key={feature.id} className={cn(
                            "flex items-center gap-2 p-2 rounded text-xs",
                            status === 'unlocked' && "bg-green-50 text-green-700 border border-green-200",
                            status === 'locked' && "bg-gray-50 text-gray-500 border border-gray-200"
                          )}>
                            <Icon className="h-3 w-3" />
                            <span className="flex-1">{feature.name}</span>
                            {status === 'unlocked' ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <div className="flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                <span className="text-xs">{feature.unlockLevel}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Milestone */}
            {nextLevel && (
              <div className="border-t pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Next Milestone</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Reach {nextLevel.range[0]} points to unlock "{nextLevel.name}" level
                </p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{metrics.readinessScore}/{nextLevel.range[0]} points</span>
                  <span>{nextLevel.range[0] - metrics.readinessScore} to go</span>
                </div>
                <Progress 
                  value={(metrics.readinessScore / nextLevel.range[0]) * 100} 
                  className="h-1 mt-1"
                  indicatorClassName="bg-gradient-to-r from-amber-400 to-orange-500"
                />
              </div>
            )}

            {/* Achievement Badge */}
            {metrics.readinessScore >= 100 && (
              <div className="text-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                <Crown className="h-6 w-6 mx-auto mb-1" />
                <p className="text-sm font-semibold">Master Achieved!</p>
                <p className="text-xs opacity-90">You've unlocked all features</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}