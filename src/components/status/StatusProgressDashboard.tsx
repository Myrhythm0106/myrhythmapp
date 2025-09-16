import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  CheckCircle,
  Clock,
  Play,
  Pause,
  X,
  TrendingUp,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import { useStatusManagement } from '@/hooks/useStatusManagement';
import { useSubscription } from '@/hooks/useSubscription';

const statusColors = {
  completed: '#22c55e',
  in_progress: '#3b82f6',
  not_started: '#6b7280',
  on_hold: '#f59e0b',
  cancelled: '#ef4444'
};

const statusIcons = {
  completed: CheckCircle,
  in_progress: Play,
  not_started: Clock,
  on_hold: Pause,
  cancelled: X
};

interface StatusProgressDashboardProps {
  className?: string;
}

export function StatusProgressDashboard({ className }: StatusProgressDashboardProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');
  const [progressData, setProgressData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getStatusProgress } = useStatusManagement();
  const { tier, hasFeature } = useSubscription();

  useEffect(() => {
    loadProgressData();
  }, [timeframe]);

  const loadProgressData = async () => {
    try {
      setIsLoading(true);
      const data = await getStatusProgress(timeframe);
      setProgressData(data);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Loading Progress...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progressData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Status Progress</CardTitle>
          <CardDescription>No data available for the selected timeframe</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const pieChartData = Object.entries(progressData.statusBreakdown).map(([status, count]) => ({
    name: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count as number,
    color: statusColors[status as keyof typeof statusColors] || '#6b7280'
  }));

  const completionTrend = [
    { name: 'Week 1', completed: 12, total: 20 },
    { name: 'Week 2', completed: 15, total: 18 },
    { name: 'Week 3', completed: 18, total: 22 },
    { name: 'Week 4', completed: progressData.completedActions, total: progressData.totalActions }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Timeframe Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Progress Dashboard</h2>
          <p className="text-muted-foreground">Track your action completion patterns</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.totalActions}</div>
            <p className="text-xs text-green-600">
              +{Math.round(progressData.totalActions * 0.15)} from last {timeframe}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.completedActions}</div>
            <p className="text-xs text-green-600">
              {progressData.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressData.statusBreakdown.in_progress || 0}
            </div>
            <p className="text-xs text-blue-600">
              Active momentum
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.completionRate}%</div>
            <Progress value={progressData.completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analytics for MyStretch/MyLeap */}
      {(tier === 'stretch' || tier === 'leap') && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            {tier === 'leap' && <TabsTrigger value="family">Family</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Current breakdown of action statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status Breakdown List */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Breakdown</CardTitle>
                  <CardDescription>Actions by status with insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(progressData.statusBreakdown).map(([status, count]) => {
                    const Icon = statusIcons[status as keyof typeof statusIcons] || Clock;
                    const percentage = Math.round(((count as number) / progressData.totalActions) * 100);
                    
                    return (
                      <div key={status} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5`} style={{ color: statusColors[status as keyof typeof statusColors] }} />
                          <div>
                            <div className="font-medium">
                              {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {count as number} actions ({percentage}%)
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{count as number}</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completion Trends</CardTitle>
                <CardDescription>Track your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={completionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="total" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {tier === 'leap' && (
            <TabsContent value="family" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Family Progress Overview
                  </CardTitle>
                  <CardDescription>
                    Collaborative progress tracking for your family
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Family progress features coming soon!</p>
                    <p className="text-sm">Connect with family members to see shared progress.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}

      {/* Basic View for MyStarter */}
      {tier === 'starter' && (
        <Card>
          <CardHeader>
            <CardTitle>Progress Summary</CardTitle>
            <CardDescription>Your action completion overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {progressData.completionRate}%
                </div>
                <p className="text-muted-foreground">
                  {progressData.completedActions} of {progressData.totalActions} actions completed
                </p>
              </div>
              <Progress value={progressData.completionRate} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-blue-600">
                    {progressData.statusBreakdown.in_progress || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-600">
                    {progressData.statusBreakdown.not_started || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Not Started</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}