import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Target,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  path: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export function QuickAccessWidget() {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'daily-checkin',
      title: 'Complete Daily Check-in',
      description: 'Start your day with a mood and energy assessment',
      timeEstimate: '2 minutes',
      path: '/dashboard',
      completed: false,
      priority: 'high'
    },
    {
      id: 'brain-exercise',
      title: 'Brain Training Session',
      description: 'Strengthen your cognitive abilities with a quick game',
      timeEstimate: '10 minutes',
      path: '/brain-games',
      completed: false,
      priority: 'medium'
    },
    {
      id: 'review-goals',
      title: 'Review Your Goals',
      description: 'Check progress and plan your next steps',
      timeEstimate: '5 minutes',
      path: '/goals',
      completed: true,
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-primary" />
          Quick Actions
          <Badge variant="secondary" className="ml-auto text-xs">
            Coach's Pick
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => (
          <div 
            key={action.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
              action.completed ? 'border-green-200 bg-green-50' : getPriorityColor(action.priority)
            }`}
            onClick={() => navigate(action.path)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{action.title}</h4>
              {action.completed ? (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {action.timeEstimate}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
            <Button 
              size="sm" 
              variant={action.completed ? "outline" : "default"}
              className="w-full text-xs"
              onClick={(e) => {
                e.stopPropagation();
                navigate(action.path);
              }}
            >
              {action.completed ? 'Review' : 'Start Now'}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        ))}

        <div className="pt-3 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full text-xs gap-2"
            onClick={() => navigate('/user-guide')}
          >
            <BookOpen className="w-3 h-3" />
            Open Full Guide
          </Button>
        </div>

        <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-primary">Coach's Tip</p>
              <p className="text-xs text-muted-foreground">
                Start with your daily check-in - it sets a positive tone for your entire day!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}