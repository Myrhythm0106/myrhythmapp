import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { SecurityIncidentHandler } from '@/utils/security';
import { toast } from 'sonner';

interface SecurityIncidentPanelProps {
  userId: string;
}

export function SecurityIncidentPanel({ userId }: SecurityIncidentPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAudit, setLastAudit] = useState<any>(null);

  const handleEmergencyLockout = async () => {
    if (!confirm('This will immediately sign out the user from all devices and force a password reset. Continue?')) {
      return;
    }

    setIsProcessing(true);
    try {
      await SecurityIncidentHandler.handleIncident({
        type: 'unauthorized_access',
        severity: 'critical',
        userId,
        details: {
          manual_lockout: true,
          initiated_by: 'admin_panel'
        },
        reason: 'Manual security lockout initiated'
      });

      toast.success('Emergency lockout completed');
    } catch (error) {
      toast.error(`Failed to execute lockout: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAuditUser = async () => {
    setIsProcessing(true);
    try {
      const auditData = await SecurityIncidentHandler.auditUserActivity(userId);
      setLastAudit(auditData);
      toast.success('User audit completed');
    } catch (error) {
      toast.error(`Audit failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearClientData = () => {
    SecurityIncidentHandler.clearClientSession();
    toast.success('Client session data cleared');
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Shield className="h-5 w-5" />
          Security Incident Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Use these tools only for confirmed security incidents. All actions are logged.
          </AlertDescription>
        </Alert>

        <div className="grid gap-3">
          <Button
            onClick={handleEmergencyLockout}
            disabled={isProcessing}
            variant="destructive"
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Emergency Lockout'}
          </Button>

          <Button
            onClick={handleAuditUser}
            disabled={isProcessing}
            variant="outline"
            className="w-full"
          >
            {isProcessing ? 'Auditing...' : 'Audit User Activity'}
          </Button>

          <Button
            onClick={handleClearClientData}
            variant="outline"
            className="w-full"
          >
            Clear Client Session Data
          </Button>
        </div>

        {lastAudit && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Last Audit Results
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>Security Events:</strong> {lastAudit.security_events?.length || 0}</p>
              <p><strong>MFA Attempts:</strong> {lastAudit.mfa_attempts?.length || 0}</p>
              <p><strong>Audit Time:</strong> {new Date(lastAudit.audit_timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Next Steps:</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Check Supabase Dashboard for additional logs</li>
            <li>• Consider rotating JWT secret if widespread compromise</li>
            <li>• Monitor for unusual activity patterns</li>
            <li>• Update security policies if needed</li>
          </ul>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2"
            onClick={() => window.open('https://supabase.com/dashboard/project/bomjibcivwxbcwfmkrnv/auth/users', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Supabase Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}