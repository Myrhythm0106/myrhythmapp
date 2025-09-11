import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  Calendar,
  Target,
  Trophy,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmpowerment } from '@/contexts/EmpowermentContext';

interface DailyBriefProps {
  userName?: string;
  todaysActions: Array<{
    id: string;
    title: string;
    scheduled_time?: string;
    status: string;
    priority_level: number;
  }>;
  completedToday: number;
  streakCount: number;
  onQuickCapture: () => void;
}

export function DailyBrief({ 
  userName, 
  todaysActions = [], 
  completedToday = 0, 
  streakCount = 0, 
  onQuickCapture 
}: DailyBriefProps) {
  const navigate = useNavigate();
  const { dailyStatement, refreshStatement } = useEmpowerment();

  const pendingActions = todaysActions.filter(a => a.status === 'pending');
  const upcomingActions = pendingActions.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Back Header */}
      <Card className="border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50 via-brain-health-50 to-clarity-teal-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-memory-emerald-900">
                Welcome back{userName ? `, ${userName}` : ''}! 👋
              </h2>
              <p className="text-memory-emerald-700 mt-1">
                Ready to capture new commitments and complete today's actions?
              </p>
            </div>
            <Button
              onClick={onQuickCapture}
              size="lg"
              className="bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700"
            >
              <Zap className="h-5 w-5 mr-2" />
              Quick Capture
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily IChoose Statement */}
      {dailyStatement && (
        <Card className="border-brain-health-200 bg-gradient-to-r from-brain-health-50 to-clarity-teal-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-brain-health-900">Today's Empowerment</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={refreshStatement}
                className="text-brain-health-600 hover:text-brain-health-800"
              >
                <Target className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-brain-health-800 font-medium text-lg leading-relaxed">
              {dailyStatement.text}
            </p>
            {dailyStatement.category && (
              <Badge variant="secondary" className="mt-3 bg-brain-health-100 text-brain-health-800">
                {dailyStatement.category}
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-memory-emerald-600" />
            <div className="text-2xl font-bold text-memory-emerald-600">{completedToday}</div>
            <p className="text-sm text-muted-foreground">Completed Today</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Clock className="h-8 w-8 mx-auto mb-2 text-brain-health-600" />
            <div className="text-2xl font-bold text-brain-health-600">{pendingActions.length}</div>
            <p className="text-sm text-muted-foreground">Actions Pending</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-clarity-teal-600" />
            <div className="text-2xl font-bold text-clarity-teal-600">{streakCount}</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Actions */}
      {upcomingActions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Actions
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/calendar')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    action.priority_level >= 4 ? 'bg-red-500' :
                    action.priority_level === 3 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium">{action.title}</p>
                    {action.scheduled_time && (
                      <p className="text-sm text-muted-foreground">{action.scheduled_time}</p>
                    )}
                  </div>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => navigate('/memory-bridge')}
        >
          <CardContent className="pt-6 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-memory-emerald-600" />
            <h3 className="font-semibold">Memory Bridge</h3>
            <p className="text-sm text-muted-foreground">Record & extract actions</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => navigate('/dashboard')}
        >
          <CardContent className="pt-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-brain-health-600" />
            <h3 className="font-semibold">Full Dashboard</h3>
            <p className="text-sm text-muted-foreground">Complete overview</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}