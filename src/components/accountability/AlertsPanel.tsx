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
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'task_completed':
        return 'Task Completed';
      case 'task_missed':
        return 'Task Missed';
      case 'streak_milestone':
        return 'Milestone Reached';
      case 'concern_pattern':
        return 'Concern Pattern';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alerts & Notifications</h2>
          <p className="text-muted-foreground">
            Stay informed about important updates and patterns
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="unacknowledged">
            Unacknowledged ({alerts.filter(a => a.acknowledged_by.length === 0).length})
          </TabsTrigger>
          <TabsTrigger value="acknowledged">
            Acknowledged ({alerts.filter(a => a.acknowledged_by.length > 0).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
                  <p className="text-muted-foreground">
                    {filter === 'unacknowledged' 
                      ? "All alerts have been acknowledged" 
                      : "No alerts to display"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card key={alert.id} className={alert.acknowledged_by.length === 0 ? 'border-l-4 border-l-primary' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getSeverityIcon(alert.severity)}
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{getAlertTypeLabel(alert.alert_type)}</span>
                          <Badge variant={getSeverityColor(alert.severity) as "default" | "secondary" | "destructive"}>
                            {alert.severity}
                          </Badge>
                          {alert.acknowledged_by.length === 0 && (
                            <Badge variant="outline" className="text-xs">
                              Needs Attention
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{format(new Date(alert.created_at), 'MMM d, h:mm a')}</div>
                      {alert.sent_at && (
                        <div className="text-xs">Sent: {format(new Date(alert.sent_at), 'h:mm a')}</div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{alert.message}</p>
                  
                  {/* Target Members */}
                  {alert.target_members.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                        <Users className="h-4 w-4" />
                        <span>Notified members:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {alert.target_members.map((member, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Acknowledgment Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {alert.acknowledged_by.length > 0 ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">
                            Acknowledged by {alert.acknowledged_by.length} member{alert.acknowledged_by.length > 1 ? 's' : ''}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-orange-600">Waiting for acknowledgment</span>
                        </>
                      )}
                    </div>
                    
                    {alert.acknowledged_by.length === 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id, 'user')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                  </div>

                  {/* Acknowledged Members */}
                  {alert.acknowledged_by.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-xs text-muted-foreground">
                        Acknowledged by: {alert.acknowledged_by.join(', ')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}