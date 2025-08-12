import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Circle, 
  Star, 
  Target, 
  Calendar,
  Mic,
  Users,
  Trophy,
  Zap,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DailyAction {
  id: string;
  title: string;
  description: string;
  type: 'memory-bridge' | 'goals' | 'support' | 'wellness';
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  action: () => void;
  completed?: boolean;
}

interface WeekPlan {
  week: number;
  title: string;
  focus: string;
  description: string;
  dailyActions: DailyAction[];
  color: string;
}

export function ThirtyDayRoadmap() {
  const navigate = useNavigate();
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const toggleActionComplete = (actionId: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(actionId)) {
      newCompleted.delete(actionId);
    } else {
      newCompleted.add(actionId);
    }
    setCompletedActions(newCompleted);
  };

  const weekPlans: WeekPlan[] = [
    {
      week: 1,
      title: "Foundation Week",
      focus: "Take Control of Memory Bridge Basics",
      description: "You have the power to capture every important moment",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      dailyActions: [
        {
          id: 'w1-d1',
          title: 'Record Your First Conversation',
          description: 'Experience the magic of Memory Bridge with a family conversation',
          type: 'memory-bridge',
          estimatedTime: '10 min',
          priority: 'high',
          action: () => navigate('/memory-bridge')
        },
        {
          id: 'w1-d2', 
          title: 'Invite One Support Person',
          description: 'Empower someone you trust to be part of your journey',
          type: 'support',
          estimatedTime: '5 min',
          priority: 'high',
          action: () => navigate('/support-circle')
        },
        {
          id: 'w1-d3',
          title: 'Set Your First Memory Goal',
          description: 'Take control by setting a meaningful cognitive wellness goal',
          type: 'goals',
          estimatedTime: '5 min',
          priority: 'medium',
          action: () => navigate('/goals')
        },
        {
          id: 'w1-d4',
          title: 'Complete Daily Check-in',
          description: 'Track your mood and energy - you have the power to monitor progress',
          type: 'wellness',
          estimatedTime: '2 min',
          priority: 'medium',
          action: () => navigate('/dashboard')
        }
      ]
    },
    {
      week: 2,
      title: "Empowerment Week", 
      focus: "Build Lasting Habits That Serve You",
      description: "You have the power to create routines that support your growth",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      dailyActions: [
        {
          id: 'w2-d1',
          title: 'Schedule 3 Memory Bridge Sessions',
          description: 'Take control of your week by planning important conversations',
          type: 'memory-bridge',
          estimatedTime: '15 min',
          priority: 'high',
          action: () => navigate('/memory-bridge')
        },
        {
          id: 'w2-d2',
          title: 'Invite Family Members',
          description: 'Expand your circle - you deserve support from loved ones',
          type: 'support', 
          estimatedTime: '10 min',
          priority: 'medium',
          action: () => navigate('/support-circle')
        },
        {
          id: 'w2-d3',
          title: 'Track Weekly Progress',
          description: 'Celebrate your wins - you have the power to see your growth',
          type: 'wellness',
          estimatedTime: '5 min',
          priority: 'medium',
          action: () => navigate('/analytics')
        },
        {
          id: 'w2-d4',
          title: 'Customize Your Dashboard',
          description: 'Make MyRhythm truly yours - personalize your experience',
          type: 'wellness',
          estimatedTime: '8 min',
          priority: 'low',
          action: () => navigate('/settings')
        }
      ]
    },
    {
      week: 3,
      title: "Integration Week",
      focus: "Accelerate Your Progress with Advanced Features", 
      description: "You have the power to leverage all MyRhythm tools for maximum impact",
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      dailyActions: [
        {
          id: 'w3-d1',
          title: 'Use Calendar Integration',
          description: 'Take control of your schedule with brain-friendly planning',
          type: 'wellness',
          estimatedTime: '10 min',
          priority: 'high',
          action: () => navigate('/calendar')
        },
        {
          id: 'w3-d2',
          title: 'Try Brain Training Games',
          description: 'Empower your cognitive function with fun exercises',
          type: 'wellness',
          estimatedTime: '15 min',
          priority: 'medium',
          action: () => navigate('/brain-games')
        },
        {
          id: 'w3-d3',
          title: 'Share Insights with Supporters',
          description: 'You have the power to keep your circle informed and engaged',
          type: 'support',
          estimatedTime: '5 min',
          priority: 'medium',
          action: () => navigate('/support-circle')
        },
        {
          id: 'w3-d4',
          title: 'Review Memory Bridge Analytics',
          description: 'Take control by understanding your conversation patterns',
          type: 'memory-bridge',
          estimatedTime: '8 min',
          priority: 'low',
          action: () => navigate('/analytics')
        }
      ]
    },
    {
      week: 4,
      title: "Mastery Week",
      focus: "Personalize Your Journey for Long-term Success",
      description: "You have the power to create a sustainable, empowering routine",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      dailyActions: [
        {
          id: 'w4-d1',
          title: 'Master Memory Bridge Workflows',
          description: 'Take control of advanced features like A.C.T.S. customization',
          type: 'memory-bridge',
          estimatedTime: '20 min',
          priority: 'high',
          action: () => navigate('/memory-bridge')
        },
        {
          id: 'w4-d2',
          title: 'Build Your Routine Template',
          description: 'You have the power to design your perfect daily rhythm',
          type: 'wellness',
          estimatedTime: '15 min',
          priority: 'high',
          action: () => navigate('/settings')
        },
        {
          id: 'w4-d3',
          title: 'Celebrate Your Progress',
          description: 'Acknowledge how far you\'ve come - you deserve recognition',
          type: 'wellness',
          estimatedTime: '10 min',
          priority: 'medium',
          action: () => navigate('/analytics')
        },
        {
          id: 'w4-d4',
          title: 'Plan Your Next Month',
          description: 'Take control of your future with empowered goal setting',
          type: 'goals',
          estimatedTime: '15 min',
          priority: 'medium',
          action: () => navigate('/goals')
        }
      ]
    }
  ];

  const getCurrentWeek = () => {
    const startDate = new Date(localStorage.getItem('myrhythm-roadmap-start') || Date.now());
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(Math.ceil(diffDays / 7), 4);
  };

  const currentWeek = getCurrentWeek();
  const completionRate = (completedActions.size / (weekPlans.reduce((acc, week) => acc + week.dailyActions.length, 0))) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Your 30-Day Empowerment Roadmap</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-6">
          You have the power to transform your cognitive wellness, one day at a time.
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{completedActions.size}</div>
            <div className="text-sm text-muted-foreground">Actions Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(completionRate)}%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">Week {currentWeek}</div>
            <div className="text-sm text-muted-foreground">Current Focus</div>
          </div>
        </div>

        <Progress value={completionRate} className="max-w-md mx-auto h-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {weekPlans.map((week) => {
          const weekCompleted = week.dailyActions.filter(action => completedActions.has(action.id)).length;
          const isCurrentWeek = week.week === currentWeek;
          
          return (
            <Card 
              key={week.week} 
              className={`overflow-hidden ${isCurrentWeek ? 'ring-2 ring-primary shadow-lg' : ''}`}
            >
              <div className={`h-3 ${week.color}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">Week {week.week}:</span>
                    <span>{week.title}</span>
                    {isCurrentWeek && <Badge variant="default">Current</Badge>}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {weekCompleted}/{week.dailyActions.length} completed
                    </div>
                    <Progress value={(weekCompleted / week.dailyActions.length) * 100} className="w-20 h-2" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-primary">{week.focus}</p>
                  <p className="text-sm text-muted-foreground">{week.description}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {week.dailyActions.map((action) => {
                  const isCompleted = completedActions.has(action.id);
                  const IconComponent = action.type === 'memory-bridge' ? Mic : 
                                      action.type === 'goals' ? Target :
                                      action.type === 'support' ? Users : Calendar;
                  
                  return (
                    <div 
                      key={action.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                        isCompleted ? 'bg-green-50 border-green-200' : 'bg-background hover:bg-secondary/50'
                      }`}
                      onClick={() => toggleActionComplete(action.id)}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                      
                      <IconComponent className={`w-5 h-5 ${
                        action.priority === 'high' ? 'text-red-500' :
                        action.priority === 'medium' ? 'text-orange-500' : 'text-blue-500'
                      }`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {action.title}
                          </h4>
                          <Badge variant="outline">
                            {action.estimatedTime}
                          </Badge>
                        </div>
                        <p className={`text-sm ${isCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                          {action.description}
                        </p>
                      </div>
                      
                      {!isCompleted && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            action.action();
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">You Have the Power!</h3>
          <p className="text-muted-foreground mb-4">
            This roadmap is your guide, but remember - you're in control. Take what serves you, 
            adapt what doesn't, and celebrate every step forward.
          </p>
          <Button 
            onClick={() => navigate('/memory-bridge')}
            className="bg-gradient-to-r from-primary via-blue-600 to-purple-600"
          >
            Start Today's Action
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}