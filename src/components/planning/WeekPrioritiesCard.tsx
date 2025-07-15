
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, ArrowRight, Trophy, Heart, Brain } from "lucide-react";
import { format, startOfWeek, endOfWeek } from "date-fns";

interface WeekPrioritiesCardProps {
  weeklyGoals: any[];
  thisWeekActions: any[];
  onViewGoals: () => void;
}

export function WeekPrioritiesCard({ 
  weeklyGoals, 
  thisWeekActions, 
  onViewGoals 
}: WeekPrioritiesCardProps) {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const completedThisWeek = thisWeekActions.filter(action => action.status === 'completed').length;
  const totalThisWeek = thisWeekActions.length;
  const weekProgress = totalThisWeek > 0 ? Math.round((completedThisWeek / totalThisWeek) * 100) : 0;

  // Top 3 priorities for this week based on goal alignment
  const weekPriorities = [
    {
      id: 1,
      title: "Morning Energy Routine",
      goalAlignment: "Energy Management",
      progress: 75,
      type: "health",
      description: "Consistent sleep & morning routine to boost daily energy"
    },
    {
      id: 2,
      title: "Cognitive Training Sessions",
      goalAlignment: "Brain Recovery",
      progress: 60,
      type: "cognitive",
      description: "3x weekly brain training to strengthen focus & memory"
    },
    {
      id: 3,
      title: "Family Connection Time",
      goalAlignment: "Relationships",
      progress: 45,
      type: "social",
      description: "Quality time with loved ones for emotional support"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'health': return <Heart className="h-4 w-4 text-green-500" />;
      case 'cognitive': return <Brain className="h-4 w-4 text-purple-500" />;
      case 'social': return <Target className="h-4 w-4 text-blue-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'health': return 'border-green-200 bg-green-50';
      case 'cognitive': return 'border-purple-200 bg-purple-50';
      case 'social': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="h-full border-2 border-clarity-teal-200 bg-gradient-to-br from-clarity-teal-50/50 to-white shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-clarity-teal-100/30 to-memory-emerald-50/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-clarity-teal-500 to-memory-emerald-600 rounded-full flex items-center justify-center">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          Week Priorities & Goals
        </CardTitle>
        <p className="text-sm text-clarity-teal-700 font-medium">Strategic focus for meaningful progress</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Week Overview */}
        <div className="text-center p-3 bg-gradient-to-r from-clarity-teal-100 to-memory-emerald-100 rounded-lg border border-clarity-teal-200">
          <p className="text-sm text-clarity-teal-700 mb-2 font-medium">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
          </p>
          <div className="flex items-center justify-center gap-6 mb-2">
            <div>
              <p className="text-2xl font-bold text-clarity-teal-600">{weekProgress}%</p>
              <p className="text-xs text-clarity-teal-700">Week Progress</p>
            </div>
            <div className="w-px h-8 bg-clarity-teal-300"></div>
            <div>
              <p className="text-2xl font-bold text-memory-emerald-600">{completedThisWeek}/{totalThisWeek}</p>
              <p className="text-xs text-clarity-teal-700">Actions Complete</p>
            </div>
          </div>
          <Progress value={weekProgress} className="h-2" />
        </div>

        {/* Top 3 Weekly Priorities */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Target className="h-4 w-4 text-clarity-teal-500" />
            Top 3 Priorities This Week
          </h4>
          {weekPriorities.map((priority, index) => (
            <div key={priority.id} className={`p-3 rounded-lg border hover:shadow-sm transition-all ${getTypeColor(priority.type)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="flex items-center justify-center w-6 h-6 bg-white rounded-full text-sm font-bold text-gray-700">
                    {index + 1}
                  </span>
                  {getTypeIcon(priority.type)}
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 text-sm">{priority.title}</span>
                    <p className="text-xs text-gray-600 mt-1">{priority.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                  {priority.progress}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <Progress value={priority.progress} className="h-1.5" />
                </div>
                <span className="text-xs text-gray-500">→ {priority.goalAlignment}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Strategy Insight */}
        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-900">This Week's Strategy</span>
          </div>
          <p className="text-sm text-purple-800">
            Focus on <strong>morning routines</strong> to build energy for cognitive tasks. Small consistent wins lead to big breakthroughs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <Button variant="outline" size="sm" className="flex-1 border-clarity-teal-300 text-clarity-teal-700 hover:bg-clarity-teal-50">
            <Calendar className="h-4 w-4 mr-1" />
            Plan Week
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-clarity-teal-500 to-memory-emerald-600 hover:from-clarity-teal-600 hover:to-memory-emerald-700"
            onClick={onViewGoals}
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            View Goals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
