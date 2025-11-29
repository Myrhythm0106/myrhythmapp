import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Clock,
  Target,
  Award,
  Zap,
  Heart,
  Star,
  Trophy
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';
import { EmpoweringTerm } from '@/components/ui/EmpoweringTerm';

interface ProgressInsightsProps {
  actions: NextStepsItem[];
}

export function ProgressInsights({ actions }: ProgressInsightsProps) {
  const completedActions = actions.filter(a => ['done', 'completed', 'confirmed'].includes(a.status));
  const activeActions = actions.filter(a => !['done', 'completed', 'confirmed'].includes(a.status));
  
  const completionRate = actions.length > 0 ? Math.round((completedActions.length / actions.length) * 100) : 0;
  
  // Calculate trends
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const recentCompletions = completedActions.filter(a => {
    if (!a.updated_at) return false;
    return new Date(a.updated_at) >= thisWeek;
  }).length;

  // Categories analysis
  const categoryStats = actions.reduce((acc, action) => {
    const category = action.category || 'other';
    if (!acc[category]) {
      acc[category] = { total: 0, completed: 0 };
    }
    acc[category].total++;
    if (['done', 'completed', 'confirmed'].includes(action.status)) {
      acc[category].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  // Time-based insights
  const timePatterns = completedActions.reduce((acc, action) => {
    if (action.scheduled_time) {
      const hour = parseInt(action.scheduled_time.split(':')[0]);
      if (hour >= 6 && hour < 12) acc.morning++;
      else if (hour >= 12 && hour < 18) acc.afternoon++;
      else acc.evening++;
    }
    return acc;
  }, { morning: 0, afternoon: 0, evening: 0 });

  const getBestTimeOfDay = () => {
    if (timePatterns.morning >= timePatterns.afternoon && timePatterns.morning >= timePatterns.evening) {
      return { time: 'Morning', icon: '🌅', tip: 'Your peak performance window!' };
    } else if (timePatterns.afternoon >= timePatterns.evening) {
      return { time: 'Afternoon', icon: '☀️', tip: 'Great focus during midday!' };
    } else {
      return { time: 'Evening', icon: '🌙', tip: 'You thrive in evening hours!' };
    }
  };

  const getMotivationalInsight = () => {
    if (completionRate >= 80) {
      return {
        message: "You're an absolute champion! 🏆",
        subtext: "Your consistency is building incredible neural pathways!",
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200"
      };
    } else if (completionRate >= 60) {
      return {
        message: "Fantastic momentum building! 🚀",
        subtext: "You're developing powerful success habits!",
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200"
      };
    } else if (completionRate >= 40) {
      return {
        message: "Steady progress wins the race! 🐢✨",
        subtext: "Every completed action strengthens your commitment muscle!",
        color: "text-purple-600",
        bgColor: "bg-purple-50 border-purple-200"
      };
    } else {
      return {
        message: "Every journey begins with a single step! 🌱",
        subtext: "You're building the foundation for amazing growth!",
        color: "text-orange-600",
        bgColor: "bg-orange-50 border-orange-200"
      };
    }
  };

  const bestTime = getBestTimeOfDay();
  const insight = getMotivationalInsight();

  return (
    <div className="space-y-6">
      {/* Motivational Header */}
      <Card className={`${insight.bgColor} border-2`}>
        <CardHeader>
          <CardTitle className={`${insight.color} text-2xl flex items-center gap-3`}>
            <Trophy className="h-8 w-8" />
            {insight.message}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`${insight.color} text-lg font-medium`}>
            {insight.subtext}
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <Award className="h-8 w-8 mx-auto mb-3 text-green-600" />
          <div className="text-3xl font-bold text-green-600">
            {completionRate}%
          </div>
          <p className="text-sm text-green-700 font-medium">
            <EmpoweringTerm term="Completion Rate" showIndicator={false}>
              Success Rate
            </EmpoweringTerm>
          </p>
          <p className="text-xs text-green-600 mt-1">Building trust daily!</p>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <Target className="h-8 w-8 mx-auto mb-3 text-blue-600" />
          <div className="text-3xl font-bold text-blue-600">
            {completedActions.length}
          </div>
          <p className="text-sm text-blue-700 font-medium">
            <EmpoweringTerm term="Victory Achieved" showIndicator={false}>
              Victories Achieved
            </EmpoweringTerm>
          </p>
          <p className="text-xs text-blue-600 mt-1">Neural pathways strengthened!</p>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <Zap className="h-8 w-8 mx-auto mb-3 text-purple-600" />
          <div className="text-3xl font-bold text-purple-600">
            {recentCompletions}
          </div>
          <p className="text-sm text-purple-700 font-medium">
            <EmpoweringTerm term="Momentum Streak" showIndicator={false}>
              This Week's Momentum
            </EmpoweringTerm>
          </p>
          <p className="text-xs text-purple-600 mt-1">Momentum building!</p>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <Star className="h-8 w-8 mx-auto mb-3 text-orange-600" />
          <div className="text-3xl font-bold text-orange-600">
            {activeActions.length}
          </div>
          <p className="text-sm text-orange-700 font-medium">
            <EmpoweringTerm term="Building Momentum" showIndicator={false}>
              Building Momentum
            </EmpoweringTerm>
          </p>
          <p className="text-xs text-orange-600 mt-1">Future victories!</p>
        </Card>
      </div>

      {/* Time Pattern Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Clock className="h-5 w-5" />
              <EmpoweringTerm term="Peak Performance" showIndicator={false}>
                Your Peak Performance Time
              </EmpoweringTerm>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-4xl">{bestTime.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-blue-800">{bestTime.time}</h3>
                <p className="text-blue-600 font-medium">{bestTime.tip}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-2 bg-white/60 rounded border">
                  <div className="text-lg font-bold text-blue-600">{timePatterns.morning}</div>
                  <div className="text-xs text-blue-700">Morning</div>
                </div>
                <div className="text-center p-2 bg-white/60 rounded border">
                  <div className="text-lg font-bold text-blue-600">{timePatterns.afternoon}</div>
                  <div className="text-xs text-blue-700">Afternoon</div>
                </div>
                <div className="text-center p-2 bg-white/60 rounded border">
                  <div className="text-lg font-bold text-blue-600">{timePatterns.evening}</div>
                  <div className="text-xs text-blue-700">Evening</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <BarChart3 className="h-5 w-5" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, stats]) => {
                const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                return (
                  <div key={category} className="bg-white/60 rounded p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-purple-800 capitalize">
                        {category === 'other' ? 'General' : category}
                      </span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {rate}%
                      </Badge>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      {stats.completed} of {stats.total} completed
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brain-Friendly Insights */}
      <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Heart className="h-6 w-6 text-pink-500" />
            Your Brain's Success Story
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/60 rounded-lg border border-white/40">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <h4 className="font-semibold text-indigo-800 mb-1">Neural Pathways</h4>
              <p className="text-xs text-indigo-700">Every completed action strengthens your brain's commitment patterns</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg border border-white/40">
              <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <h4 className="font-semibold text-indigo-800 mb-1">Trust Building</h4>
              <p className="text-xs text-indigo-700">You're proving to yourself and others that your word has power</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg border border-white/40">
              <Zap className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <h4 className="font-semibold text-indigo-800 mb-1">Momentum Effect</h4>
              <p className="text-xs text-indigo-700">Each success makes the next action feel more achievable</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}