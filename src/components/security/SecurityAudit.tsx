import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Info
} from "lucide-react";
import { SecureStorage } from "@/utils/secureStorage";
import { SecurityAudit as SecurityAuditService, SecurityAuditResult } from '@/utils/security/securityAudit';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

export function SecurityAudit() {
  const { user } = useAuth();
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const runServerAudit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await SecurityAuditService.performAudit(user.id);
      setAuditResult(result);
    } catch (error) {
      toast.error('Security audit failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      runServerAudit();
    }
  }, [user]);

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600">Please log in to view comprehensive security audit.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Score Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Security Score
            </CardTitle>
            <Button
              onClick={runServerAudit}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Scanning...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {auditResult ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  <span className={SecurityAuditService.getScoreColor(auditResult.score)}>
                    {auditResult.score}
                  </span>
                  <span className="text-gray-400">/{auditResult.maxScore}</span>
                </div>
                <Badge 
                  variant={auditResult.score >= 70 ? 'default' : 'destructive'}
                  className="text-sm"
                >
                  {SecurityAuditService.getScoreLabel(auditResult.score)}
                </Badge>
              </div>
              
              <Progress 
                value={auditResult.score} 
                max={auditResult.maxScore}
                className="h-3"
              />
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-green-600">
                    {auditResult.issues.filter(i => i.severity === 'low').length}
                  </div>
                  <div className="text-gray-600">Low Issues</div>
                </div>
                <div>
                  <div className="font-semibold text-yellow-600">
                    {auditResult.issues.filter(i => ['medium', 'high'].includes(i.severity)).length}
                  </div>
                  <div className="text-gray-600">Med/High Issues</div>
                </div>
                <div>
                  <div className="font-semibold text-red-600">
                    {auditResult.issues.filter(i => i.severity === 'critical').length}
                  </div>
                  <div className="text-gray-600">Critical Issues</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Run a security audit to see your score</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Issues */}
      {auditResult && auditResult.issues.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Security Issues</CardTitle>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                size="sm"
              >
                {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditResult.issues.map((issue, index) => (
                <Alert key={index} className="border-l-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{issue.description}</span>
                        <Badge variant="outline">
                          {issue.severity.toUpperCase()}
                        </Badge>
                      </div>
                      {showDetails && issue.fix && (
                        <AlertDescription>
                          <p className="text-sm text-blue-600">
                            <strong>Fix:</strong> {issue.fix}
                          </p>
                        </AlertDescription>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {auditResult && auditResult.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {auditResult.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}