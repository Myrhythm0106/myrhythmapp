import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Shield, 
  Download, 
  Trash2, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  FileText,
  Lock,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DataProtectionCompliance } from '@/utils/security/dataProtectionCompliance';
import { BreachDetection } from '@/utils/security/breachDetection';
import { SecurityHeaders } from '@/utils/security/securityHeaders';
import { DeviceFingerprinting } from '@/utils/security/deviceFingerprinting';
import { toast } from 'sonner';

export function ComprehensiveSecurityDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [securityReport, setSecurityReport] = useState<any>(null);
  const [breachAnalysis, setBreachAnalysis] = useState<any>(null);
  const [complianceReport, setComplianceReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const runSecurityAnalysis = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Run breach detection
      const breach = await BreachDetection.analyzeUserActivity(user.id);
      setBreachAnalysis(breach);

      // Generate security report
      const report = await BreachDetection.generateSecurityReport(user.id);
      setSecurityReport(report);

      // Generate compliance report
      const compliance = await DataProtectionCompliance.generateComplianceReport(user.id);
      setComplianceReport(compliance);

      // Check for suspicious device activity
      const isSuspicious = await DeviceFingerprinting.detectSuspiciousActivity(user.id);
      if (isSuspicious) {
        toast.error('Suspicious device activity detected!');
      }

    } catch (error) {
      toast.error('Security analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const exportUserData = async () => {
    if (!user) return;
    
    try {
      const exportData = await DataProtectionCompliance.exportUserData(user.id, 'json');
      
      // Download as file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('User data exported successfully');
    } catch (error) {
      toast.error('Failed to export user data');
    }
  };

  const deleteUserData = async () => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return;
    }
    
    try {
      await DataProtectionCompliance.deleteUserData(user.id, true);
      toast.success('User data deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user data');
    }
  };

  const validateSecurityHeaders = () => {
    const validation = SecurityHeaders.validateCSP();
    
    if (validation.violations.length === 0) {
      toast.success(`Security headers validated successfully (Score: ${validation.score}/100)`);
    } else {
      toast.warning(`Security issues found (Score: ${validation.score}/100)`);
    }
    
    return validation;
  };

  useEffect(() => {
    if (user) {
      runSecurityAnalysis();
      SecurityHeaders.applySecurityHeaders();
    }
  }, [user]);

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600">Please log in to access the security dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Comprehensive Security Dashboard
            </CardTitle>
            <Button onClick={runSecurityAnalysis} disabled={loading}>
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breach">Threat Detection</TabsTrigger>
          <TabsTrigger value="compliance">Data Protection</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="actions">Security Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Security Score */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {breachAnalysis?.riskLevel === 'low' ? '95' : 
                   breachAnalysis?.riskLevel === 'medium' ? '75' : 
                   breachAnalysis?.riskLevel === 'high' ? '45' : '25'}/100
                </div>
                <Badge variant={breachAnalysis?.riskLevel === 'low' ? 'default' : 'destructive'}>
                  {breachAnalysis?.riskLevel || 'Unknown'} Risk
                </Badge>
              </CardContent>
            </Card>

            {/* Recent Threats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Threats Detected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {securityReport?.summary?.suspiciousEvents || 0}
                </div>
                <p className="text-xs text-gray-600">In last 7 days</p>
              </CardContent>
            </Card>

            {/* Data Compliance */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {complianceReport ? 'Compliant' : 'Unknown'}
                </div>
                <p className="text-xs text-gray-600">GDPR/CCPA Ready</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breach">
          <Card>
            <CardHeader>
              <CardTitle>Threat Detection Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {breachAnalysis ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={breachAnalysis.isSuspicious ? 'destructive' : 'default'}
                      className="flex items-center gap-1"
                    >
                      {breachAnalysis.isSuspicious ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      {breachAnalysis.isSuspicious ? 'Threats Detected' : 'No Threats'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Risk Level: {breachAnalysis.riskLevel}
                    </span>
                  </div>

                  {breachAnalysis.indicators.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Security Indicators:</h4>
                      {breachAnalysis.indicators.map((indicator: string, index: number) => (
                        <Alert key={index} className="border-orange-200 bg-orange-50">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{indicator}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {breachAnalysis.recommendedActions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Recommended Actions:</h4>
                      <ul className="space-y-1">
                        {breachAnalysis.recommendedActions.map((action: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Run analysis to view threat detection results.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Data Protection & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button onClick={exportUserData} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export My Data (GDPR)
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete My Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Personal Data</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        This will permanently delete all your personal data in compliance with GDPR Article 17 (Right to be Forgotten).
                      </p>
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          This action cannot be undone. All your data including goals, memories, and account information will be permanently deleted.
                        </AlertDescription>
                      </Alert>
                      <Button onClick={deleteUserData} variant="destructive" className="w-full">
                        Confirm Deletion
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {complianceReport && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium">Data Summary:</h4>
                  <div className="grid gap-2 text-sm">
                    {Object.entries(complianceReport.userDataSummary || {}).map(([table, count]) => (
                      <div key={table} className="flex justify-between">
                        <span className="capitalize">{table.replace('_', ' ')}:</span>
                        <span className="font-medium">{count as number} records</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Security Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              {securityReport ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{securityReport.summary.totalEvents}</div>
                      <div className="text-sm text-gray-600">Total Events</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{securityReport.summary.suspiciousEvents}</div>
                      <div className="text-sm text-gray-600">Suspicious</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{securityReport.summary.criticalEvents}</div>
                      <div className="text-sm text-gray-600">Critical</div>
                    </div>
                  </div>

                  {securityReport.recentIncidents.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Recent Security Incidents:</h4>
                      {securityReport.recentIncidents.map((incident: any, index: number) => (
                        <Alert key={index} className="border-red-200 bg-red-50">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="flex justify-between">
                              <span>{incident.event_type}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(incident.created_at).toLocaleString()}
                              </span>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Run analysis to view monitoring data.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Security Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button onClick={validateSecurityHeaders} variant="outline" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Validate Security Headers
                </Button>
                
                <Button onClick={() => DeviceFingerprinting.clearDeviceFingerprint(user.id)} variant="outline" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear Device Fingerprint
                </Button>
                
                <Button onClick={runSecurityAnalysis} variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Run Full Security Scan
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2" disabled>
                  <Lock className="h-4 w-4" />
                  Force Session Refresh
                </Button>
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Best Practices:</strong> Regularly monitor your account activity, 
                  keep your browser updated, use strong passwords, and enable MFA for maximum protection.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}