import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  BarChart3,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ACTsStats {
  raised: number;
  outstanding: number;
  completed: number;
}

export function ACTsStatusPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ACTsStats>({ raised: 0, outstanding: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchACTsStats = async () => {
      if (!user) return;

      try {
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

        // Get raised this month
        const { count: raised } = await supabase
          .from('extracted_actions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', firstOfMonth)
          .lt('created_at', firstOfNextMonth);

        // Get outstanding (not completed or rejected)
        const { count: outstanding } = await supabase
          .from('extracted_actions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('status', 'in', '("completed","rejected")');

        // Get completed this month (prefer updated_at, fallback to created_at)
        const { count: completed } = await supabase
          .from('extracted_actions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('updated_at', firstOfMonth)
          .lt('updated_at', firstOfNextMonth);

        setStats({
          raised: raised || 0,
          outstanding: outstanding || 0,
          completed: completed || 0
        });
      } catch (error) {
        console.error('Error fetching ACTs stats:', error);
        setStats({ raised: 0, outstanding: 0, completed: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchACTsStats();
  }, [user]);

  const total = stats.raised + stats.outstanding + stats.completed;
  const completionRate = total > 0 ? Math.round((stats.completed / total) * 100) : 0;

  return (
    <Card className="bg-gradient-to-br from-brain-health-50 to-clarity-teal-50 border-brain-health-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold gradient-text-brand flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          ACTs Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-brain-health-100 rounded"></div>
            <div className="h-8 bg-brain-health-100 rounded"></div>
            <div className="h-8 bg-brain-health-100 rounded"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-sunrise-amber-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-sunrise-amber-600" />
                  <span className="text-sm font-medium text-sunrise-amber-800">Raised (This Month)</span>
                </div>
                <Badge variant="secondary" className="bg-sunrise-amber-100 text-sunrise-amber-800">
                  {stats.raised}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-clarity-teal-200">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-clarity-teal-600" />
                  <span className="text-sm font-medium text-clarity-teal-800">Outstanding</span>
                </div>
                <Badge variant="secondary" className="bg-clarity-teal-100 text-clarity-teal-800">
                  {stats.outstanding}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-memory-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-memory-emerald-600" />
                  <span className="text-sm font-medium text-memory-emerald-800">Completed</span>
                </div>
                <Badge variant="secondary" className="bg-memory-emerald-100 text-memory-emerald-800">
                  {stats.completed}
                </Badge>
              </div>
            </div>

            {/* Completion Rate */}
            {total > 0 && (
              <div className="p-3 bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 rounded-lg border border-brain-health-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-brain-health-800">Completion Rate</span>
                  <span className="text-sm font-bold text-brain-health-900">{completionRate}%</span>
                </div>
                <div className="w-full bg-brain-health-100 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Encouraging Message */}
            {total === 0 ? (
              <div className="text-center p-3 text-brain-health-600">
                <p className="text-sm">Ready to start your ACTs journey?</p>
                <p className="text-xs text-brain-health-500">Every step counts. You're building momentum.</p>
              </div>
            ) : (
              <div className="text-center p-3 text-brain-health-600">
                <p className="text-xs">
                  {completionRate >= 80 ? "Exceptional momentum! 🌟" : 
                   completionRate >= 60 ? "Strong progress ahead! 💪" : 
                   "Every action builds your future! 🚀"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-white/80 hover:bg-white border-brain-health-200"
                onClick={() => navigate('/calendar?view=month&filter=acts')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View ACTs in Calendar
              </Button>
              
              {stats.outstanding > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-white/80 hover:bg-white border-clarity-teal-200 text-clarity-teal-700"
                  onClick={() => navigate('/calendar?view=week&filter=acts')}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Review Outstanding ACTs
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}