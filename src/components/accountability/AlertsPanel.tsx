
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, AlertTriangle, Info, Clock, Users } from 'lucide-react';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { format } from 'date-fns';

export function AlertsPanel() {
  const { alerts, acknowledgeAlert } = useAccountabilitySystem();
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unacknowledged':
        return alert.acknowledged_by.length === 0;
      case 'acknowledged':
        return alert.acknowledged_by.length > 0;
      default:
        return true;
    }
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getAlertTypeDisplay = (type: string) => {
    switch (type) {
      case 'task_completed':
        return 'Task Completed';
      case 'task_missed':
        return 'Task Missed';
      case 'streak_milestone':
        return 'Streak Milestone';
      case 'concern_pattern':
        return 'Concern Pattern';
      default:
        return type.replace('_', ' ');
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    await acknowledgeAlert(alertId, 'current_user');
  };

  const unacknowledgedCount = alerts.filter(a => a.acknowledged_by.length === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">Alerts & Notifications</h2>
          <p className="text-muted-foreground">
            Stay informed about your progress and accountability updates
          </p>
        </div>
        
        {unacknowledgedCount > 0 && (
          <Badge variant="destructive" className="px-3 py-1">
            {unacknowledgedCount} unacknowledged
          </Badge>
        )}
      </div>

      <Tabs value={filter} onValueChange={(value: any) => setFilter(value)} className="space-y-4">
        <TabsList className="border-emerald-300/20">
          <TabsTrigger value="all">All Alerts ({alerts.length})</TabsTrigger>
          <TabsTrigger value="unacknowledged">
            Unacknowledged ({alerts.filter(a => a.acknowledged_by.length === 0).length})
          </TabsTrigger>
          <TabsTrigger value="acknowledged">
            Acknowledged ({alerts.filter(a => a.acknowledged_by.length > 0).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`${alert.acknowledged_by.length === 0 ? 'ring-2 ring-primary/20' : ''} border-purple-200/30 border-l border-emerald-300/20 shadow-sm shadow-emerald-300/5`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {getAlertTypeDisplay(alert.alert_type)}
                        </Badge>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(alert.created_at), 'MMM d, h:mm a')}
                        </div>
                        
                        {alert.target_members.length > 0 && (
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Sent to {alert.target_members.length} member{alert.target_members.length !== 1 ? 's' : ''}
                          </div>
                        )}
                        
                        {alert.acknowledged_by.length > 0 && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledged by {alert.acknowledged_by.length} member{alert.acknowledged_by.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {alert.acknowledged_by.length === 0 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>

                {alert.target_members.length > 0 && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-purple-50/40 via-blue-50/30 to-teal-50/40 rounded-lg border-l border-emerald-300/20">
                    <div className="text-xs text-muted-foreground mb-1">Notification sent to:</div>
                    <div className="flex flex-wrap gap-1">
                      {alert.target_members.map((member, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredAlerts.length === 0 && (
            <Card className="border-purple-200/30 border-l border-emerald-300/20">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  {filter === 'all' ? 'No Alerts' : 
                   filter === 'unacknowledged' ? 'No Unacknowledged Alerts' : 
                   'No Acknowledged Alerts'}
                </h3>
                <p className="text-muted-foreground">
                  {filter === 'all' ? 'Your alerts will appear here when activities are tracked.' :
                   filter === 'unacknowledged' ? 'All alerts have been acknowledged.' :
                   'No alerts have been acknowledged yet.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
