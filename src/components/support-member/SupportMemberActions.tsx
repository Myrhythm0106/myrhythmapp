import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  Calendar,
  Target,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface DailyAction {
  id: string;
  title: string;
  description: string;
  status: string;
  is_daily_win: boolean;
  start_time: string;
  completed_at: string;
  date: string;
}

interface SupportMemberActionsProps {
  userId: string;
  permissions: any;
}

export function SupportMemberActions({ userId, permissions }: SupportMemberActionsProps) {
  const [actions, setActions] = useState<DailyAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadActions();
  }, [userId, selectedDate]);

  const loadActions = async () => {
    if (!permissions?.calendar) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', userId)
        .eq('date', selectedDate)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setActions(data || []);
    } catch (error) {
      console.error('Error loading actions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string, completed_at: string) => {
    if (status === 'completed' || completed_at) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusBadge = (status: string, completed_at: string) => {
    if (status === 'completed' || completed_at) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
    }
    if (status === 'in_progress') {
      return <Badge variant="secondary">In Progress</Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  if (!permissions?.calendar) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to view calendar activities. You can still send messages of support!
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            >
              Today
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions List */}
      {actions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No activities for this date</h3>
            <p className="text-sm text-muted-foreground">
              {selectedDate === new Date().toISOString().split('T')[0] 
                ? "No activities planned for today."
                : "No activities were planned for this date."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {actions.map((action) => (
            <Card key={action.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(action.status, action.completed_at)}
                      <h3 className="font-medium">{action.title}</h3>
                      {action.is_daily_win && (
                        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                          Daily Win
                        </Badge>
                      )}
                    </div>
                    
                    {action.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {action.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {action.start_time && (
                        <span>Scheduled: {action.start_time}</span>
                      )}
                      {action.completed_at && (
                        <span>
                          Completed: {format(new Date(action.completed_at), 'h:mm a')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(action.status, action.completed_at)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Progress Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {actions.filter(a => a.status === 'completed' || a.completed_at).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {actions.filter(a => a.is_daily_win && (a.status === 'completed' || a.completed_at)).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Daily Wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {actions.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}