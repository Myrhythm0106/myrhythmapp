
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle, Eye, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SecurityEvent {
  id: string;
  event_type: 'login' | 'failed_login' | 'password_change' | 'mfa_setup' | 'data_access';
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export function SecurityAuditLog() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSecurityEvents = async () => {
      try {
        // Fetch MFA verification attempts as security events
        const { data: mfaAttempts } = await supabase
          .from('mfa_verification_attempts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        const securityEvents: SecurityEvent[] = (mfaAttempts || []).map(attempt => ({
          id: attempt.id,
          event_type: attempt.success ? 'login' : 'failed_login',
          timestamp: attempt.created_at,
          ip_address: attempt.ip_address?.toString(),
          user_agent: attempt.user_agent || undefined,
          severity: attempt.success ? 'low' : 'medium',
          description: attempt.success 
            ? `Successful ${attempt.factor_type} verification`
            : `Failed ${attempt.factor_type} verification attempt`
        }));

        setEvents(securityEvents);
      } catch (error) {
        console.error('Error fetching security events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityEvents();
  }, [user]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Eye className="h-4 w-4 text-yellow-500" />;
      default: return <Shield className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            Loading security events...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {events.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No security events recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(event.severity)}
                      <span className="font-medium">{event.description}</span>
                    </div>
                    <Badge variant={getSeverityVariant(event.severity) as any}>
                      {event.severity}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                    {event.ip_address && (
                      <span>IP: {event.ip_address}</span>
                    )}
                  </div>
                  
                  {event.user_agent && (
                    <div className="text-xs text-muted-foreground truncate">
                      {event.user_agent}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
