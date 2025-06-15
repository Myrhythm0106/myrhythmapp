
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, CheckCircle, ArrowRight, Users } from 'lucide-react';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export function AccountabilityAlertsWidget() {
  const navigate = useNavigate();
  const { alerts, supportCircle, acknowledgeAlert } = useAccountabilitySystem();
  
  const recentAlerts = alerts.slice(0, 3);
  const unacknowledgedCount = alerts.filter(a => a.acknowledged_by.length === 0).length;
  const activeSupportMembers = supportCircle.filter(m => m.status === 'active').length;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      default:
        return <Bell className="h-3 w-3 text-blue-500" />;
    }
  };

  const handleQuickAcknowledge = async (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await acknowledgeAlert(alertId, 'current_user');
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Accountability Hub
          </div>
          <div className="flex items-center gap-2">
            {unacknowledgedCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unacknowledgedCount}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {activeSupportMembers}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {recentAlerts.length > 0 ? (
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                  alert.acknowledged_by.length === 0 
                    ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => navigate('/accountability')}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getSeverityIcon(alert.severity)}
                      <span className="text-sm font-medium truncate">
                        {alert.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(alert.created_at), 'MMM d, h:mm a')}
                      </span>
                      {alert.acknowledged_by.length === 0 && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 px-2 text-xs"
                          onClick={(e) => handleQuickAcknowledge(alert.id, e)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ack
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Bell className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground mb-2">No recent alerts</p>
            <p className="text-xs text-muted-foreground">
              Your support circle will be notified of important updates
            </p>
          </div>
        )}

        <div className="pt-2 border-t">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/accountability')}
            className="w-full justify-between"
          >
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Manage Support Circle
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
