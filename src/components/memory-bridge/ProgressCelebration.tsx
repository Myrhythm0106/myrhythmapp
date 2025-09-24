import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  Star,
  Heart,
  Zap,
  Award,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';

interface ProgressCelebrationProps {
  actions: NextStepsItem[];
  onBack: () => void;
}

export function ProgressCelebration({ actions, onBack }: ProgressCelebrationProps) {
  
  // Calculate progress metrics
  const totalActions = actions.length;
  const completedActions = actions.filter(a => ['completed', 'done', 'confirmed'].includes(a.status));
  const inProgressActions = actions.filter(a => ['doing', 'in_progress'].includes(a.status));
  const completionRate = totalActions > 0 ? (completedActions.length / totalActions) * 100 : 0;
  
  // Category breakdown
  const actionsByCategory = actions.reduce((acc, action) => {
    const category = action.category || 'other';
    if (!acc[category]) acc[category] = { total: 0, completed: 0 };
    acc[category].total++;
    if (['completed', 'done', 'confirmed'].includes(action.status)) {
      acc[category].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  // Time-based analysis
  const thisWeekActions = actions.filter(action => {
    const actionDate = new Date(action.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return actionDate >= weekAgo;
  });

  const thisMonthActions = actions.filter(action => {
    const actionDate = new Date(action.created_at);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return actionDate >= monthAgo;
  });

  // Success streaks and momentum
  const recentCompletions = completedActions
    .filter(action => {
      const completionDate = action.completion_date ? new Date(action.completion_date) : new Date(action.updated_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return completionDate >= weekAgo;
    }).length;

  // Support circle impact
  const collaborativeActions = actions.filter(action => 
    action.assigned_watchers && action.assigned_watchers.length > 0
  );
  const collaborativeCompletions = collaborativeActions.filter(a => 
    ['completed', 'done', 'confirmed'].includes(a.status)
  );

  const getProgressLevel = (rate: number) => {
    if (rate >= 80) return { level: 'Champion', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    if (rate >= 60) return { level: 'Achiever', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (rate >= 40) return { level: 'Builder', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (rate >= 20) return { level: 'Starter', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
    return { level: 'Beginning', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
  };

  const progressLevel = getProgressLevel(completionRate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Report
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-purple-800">Your Progress Celebration</h1>
              <p className="text-sm text-purple-600">Every step forward is a victory worth celebrating</p>
            </div>
            <div></div>
          </div>
        </CardHeader>
      </Card>

      {/* Achievement Level */}
      <Card className={`${progressLevel.bg} ${progressLevel.border} border-2`}>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className={`w-20 h-20 ${progressLevel.bg} border-4 ${progressLevel.border} rounded-full flex items-center justify-center`}>
                <Trophy className={`h-10 w-10 ${progressLevel.color}`} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className={`text-3xl font-bold ${progressLevel.color}`}>
                {progressLevel.level}
              </h2>
              <p className={`text-lg ${progressLevel.color}`}>
                {Math.round(completionRate)}% Completion Rate
              </p>
              <p className="text-sm text-muted-foreground">
                {completedActions.length} of {totalActions} actions completed
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <Progress value={completionRate} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center p-6 bg-green-50 border-green-200">
          <div className="space-y-2">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
            <div className="text-2xl font-bold text-green-600">
              {completedActions.length}
            </div>
            <p className="text-sm text-green-700">Actions Completed</p>
          </div>
        </Card>

        <Card className="text-center p-6 bg-blue-50 border-blue-200">
          <div className="space-y-2">
            <Zap className="h-8 w-8 text-blue-500 mx-auto" />
            <div className="text-2xl font-bold text-blue-600">
              {inProgressActions.length}
            </div>
            <p className="text-sm text-blue-700">In Progress</p>
          </div>
        </Card>

        <Card className="text-center p-6 bg-purple-50 border-purple-200">
          <div className="space-y-2">
            <Heart className="h-8 w-8 text-purple-500 mx-auto" />
            <div className="text-2xl font-bold text-purple-600">
              {collaborativeCompletions.length}
            </div>
            <p className="text-sm text-purple-700">Team Victories</p>
          </div>
        </Card>

        <Card className="text-center p-6 bg-orange-50 border-orange-200">
          <div className="space-y-2">
            <TrendingUp className="h-8 w-8 text-orange-500 mx-auto" />
            <div className="text-2xl font-bold text-orange-600">
              {recentCompletions}
            </div>
            <p className="text-sm text-orange-700">This Week</p>
          </div>
        </Card>
      </div>

      {/* Progress by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Progress by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(actionsByCategory).map(([category, data]) => {
              const categoryRate = (data.completed / data.total) * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {category.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {data.completed} of {data.total} actions
                      </span>
                    </div>
                    <span className="font-medium text-sm">
                      {Math.round(categoryRate)}%
                    </span>
                  </div>
                  <Progress value={categoryRate} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* This Week */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              This Week's Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {thisWeekActions.length}
                </div>
                <p className="text-sm text-muted-foreground">Actions This Week</p>
              </div>
              
              {thisWeekActions.slice(0, 3).map(action => (
                <div key={action.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium leading-tight flex-1">
                      {action.action_text}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ml-2 ${
                        ['completed', 'done'].includes(action.status)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {action.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {thisWeekActions.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{thisWeekActions.length - 3} more actions this week
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Monthly Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {thisMonthActions.length}
                </div>
                <p className="text-sm text-muted-foreground">Actions This Month</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    {thisMonthActions.filter(a => ['completed', 'done'].includes(a.status)).length}
                  </div>
                  <p className="text-xs text-green-700">Completed</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    {thisMonthActions.filter(a => ['doing', 'in_progress'].includes(a.status)).length}
                  </div>
                  <p className="text-xs text-blue-700">In Progress</p>
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {Math.round((thisMonthActions.filter(a => ['completed', 'done'].includes(a.status)).length / Math.max(thisMonthActions.length, 1)) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Monthly Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 border-purple-200">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Award className="h-12 w-12 text-purple-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-purple-800">
                {completionRate >= 80 
                  ? "You're absolutely crushing it! 🌟" 
                  : completionRate >= 60
                  ? "Amazing progress! Keep it up! 🚀"
                  : completionRate >= 40
                  ? "You're building great momentum! 💪"
                  : completionRate >= 20
                  ? "Every step counts! You're doing great! 🌱"
                  : "Your journey has begun! 🎯"
                }
              </h3>
              <p className="text-purple-600 max-w-2xl mx-auto">
                {completionRate >= 80 
                  ? "Your dedication is inspiring. You're not just completing actions - you're transforming your life one conversation at a time."
                  : completionRate >= 60
                  ? "Your consistency is paying off. Each completed action builds the foundation for lasting positive change."
                  : completionRate >= 40
                  ? "You're in the sweet spot of progress. Every action you complete strengthens your memory bridge to success."
                  : completionRate >= 20
                  ? "Progress isn't always linear, and that's perfectly okay. You're building habits that will serve you for life."
                  : "Remember, every great journey begins with a single step. You've already started, and that takes courage."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}