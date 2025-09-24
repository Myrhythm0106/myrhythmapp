
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Bell, Clock, AlertTriangle, Plus, Shield } from 'lucide-react';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { useAuth } from '@/hooks/useAuth';
import { SupportCircleManager } from './SupportCircleManager';
import { ReminderCreator } from './ReminderCreator';
import { AlertsPanel } from './AlertsPanel';
import { format } from 'date-fns';

export function AccountabilityDashboard() {
  const { user } = useAuth();
  const { 
    supportCircle, 
    reminders, 
    alerts, 
    isLoading,
    generateAlert 
  } = useAccountabilitySystem();
  
  const [activeTab, setActiveTab] = useState('overview');

  const activeMembers = supportCircle.filter(m => m.status === 'active');
  const activeReminders = reminders.filter(r => r.is_active);
  const unacknowledgedAlerts = alerts.filter(a => a.acknowledged_by.length === 0);

  const handleTestAlert = async () => {
    await generateAlert(
      'task_completed',
      'Test Alert',
      'This is a test alert to verify the accountability system is working.',
      undefined,
      'info'
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accountability Hub</h1>
          <p className="text-muted-foreground">
            Manage your support circle and stay connected with your care team
          </p>
        </div>
        <Button onClick={handleTestAlert} variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Test Alert
        </Button>
      </div>

      {/* Authentication Check */}
      {!user && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-medium">Authentication Required</p>
                <p className="text-sm">You must be signed in to use the accountability system.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Add Support Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Invite someone to your circle
            </p>
            <Button 
              onClick={() => setActiveTab('support-circle')}
              className="w-full"
              size="sm"
              disabled={!user}
            >
              <Plus className="h-4 w-4 mr-2" />
              {user ? 'Add Member' : 'Sign In Required'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Circle</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reminders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReminders.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled reminders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 20 alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unacknowledgedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Unacknowledged alerts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="support-circle">Support Circle</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(alert.created_at), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          alert.severity === 'urgent' ? 'destructive' : 
                          alert.severity === 'warning' ? 'secondary' : 'default'
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Support Circle Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Support Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeMembers.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.member_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {member.relationship} • {member.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.can_send_reminders && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Reminders
                          </Badge>
                        )}
                        {member.permissions.health && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Health
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {activeMembers.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No support circle members yet</p>
                      <p className="text-xs mt-1">Added members will appear here</p>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab('support-circle')}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Members
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support-circle">
          <SupportCircleManager />
        </TabsContent>

        <TabsContent value="reminders">
          <ReminderCreator />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
