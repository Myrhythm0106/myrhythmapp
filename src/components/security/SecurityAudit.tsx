
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Trash2, Info, Eye, EyeOff } from "lucide-react";
import { SecureStorage } from "@/utils/secureStorage";
import { toast } from "sonner";

interface SecurityIssue {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
}

export function SecurityAudit() {
  const [auditResults, setAuditResults] = useState<{
    sensitiveDatatFound: boolean;
    keys: string[];
    issues: SecurityIssue[];
    score: number;
  } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const runComprehensiveAudit = () => {
    const storageResults = SecureStorage.auditStorage();
    const issues: SecurityIssue[] = [];
    let score = 100;

    // Check for sensitive data in localStorage
    if (storageResults.sensitiveDatatFound) {
      issues.push({
        type: 'critical',
        title: 'Sensitive Data in Local Storage',
        description: `Found ${storageResults.keys.length} items containing sensitive data in browser storage`,
        recommendation: 'Remove sensitive data from client-side storage immediately'
      });
      score -= 30;
    }

    // Check for session security
    const sessionData = sessionStorage.getItem('userSession');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        if (session.password || session.token) {
          issues.push({
            type: 'critical',
            title: 'Session Data Security Risk',
            description: 'Authentication tokens or passwords found in session storage',
            recommendation: 'Use secure HTTP-only cookies for authentication'
          });
          score -= 25;
        }
      } catch (e) {
        // Invalid session data
      }
    }

    // Check for HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      issues.push({
        type: 'critical',
        title: 'Insecure Connection',
        description: 'Application is not served over HTTPS',
        recommendation: 'Enable HTTPS to encrypt data in transit'
      });
      score -= 40;
    }

    // Check for mixed content
    const hasInsecureContent = Array.from(document.querySelectorAll('img, script, link')).some(
      (element) => {
        const src = element.getAttribute('src') || element.getAttribute('href');
        return src && src.startsWith('http://') && location.protocol === 'https:';
      }
    );

    if (hasInsecureContent) {
      issues.push({
        type: 'warning',
        title: 'Mixed Content Detected',
        description: 'Some resources are loaded over HTTP on an HTTPS page',
        recommendation: 'Ensure all resources use HTTPS'
      });
      score -= 15;
    }

    // Check for console logs (potential information disclosure)
    const hasConsoleOverride = console.log.toString().includes('[native code]');
    if (!hasConsoleOverride) {
      issues.push({
        type: 'info',
        title: 'Console Logging Enabled',
        description: 'Console logging may expose sensitive information in production',
        recommendation: 'Disable console logs in production builds'
      });
      score -= 5;
    }

    // Check for inline scripts (CSP violation potential)
    const inlineScripts = document.querySelectorAll('script:not([src])');
    if (inlineScripts.length > 0) {
      issues.push({
        type: 'warning',
        title: 'Inline Scripts Detected',
        description: `Found ${inlineScripts.length} inline script(s) which may violate CSP`,
        recommendation: 'Move scripts to external files and implement Content Security Policy'
      });
      score -= 10;
    }

    // Check for autocomplete on sensitive forms
    const sensitiveInputs = document.querySelectorAll('input[type="password"], input[name*="card"], input[name*="ssn"]');
    const hasInsecureAutocomplete = Array.from(sensitiveInputs).some(
      (input) => input.getAttribute('autocomplete') !== 'off'
    );

    if (hasInsecureAutocomplete) {
      issues.push({
        type: 'warning',
        title: 'Autocomplete Security Risk',
        description: 'Sensitive form fields allow autocomplete',
        recommendation: 'Disable autocomplete on sensitive form fields'
      });
      score -= 10;
    }

    // Check for local development indicators in production
    if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      const devIndicators = document.querySelectorAll('[data-testid], [data-cy]');
      if (devIndicators.length > 0) {
        issues.push({
          type: 'info',
          title: 'Development Artifacts',
          description: 'Test attributes found in production build',
          recommendation: 'Remove test attributes from production builds'
        });
        score -= 5;
      }
    }

    const finalScore = Math.max(0, score);
    
    setAuditResults({
      sensitiveDatatFound: storageResults.sensitiveDatatFound,
      keys: storageResults.keys,
      issues,
      score: finalScore
    });
    
    if (issues.length === 0) {
      toast.success(`Security audit complete! Score: ${finalScore}/100`);
    } else {
      const criticalIssues = issues.filter(i => i.type === 'critical').length;
      if (criticalIssues > 0) {
        toast.error(`Security audit found ${criticalIssues} critical issue(s)! Score: ${finalScore}/100`);
      } else {
        toast.warning(`Security audit found ${issues.length} issue(s). Score: ${finalScore}/100`);
      }
    }
  };

  const cleanupSensitiveData = () => {
    SecureStorage.clearSensitiveData();
    setAuditResults(null);
    toast.success("Sensitive data cleared from local storage");
    runComprehensiveAudit(); // Re-run audit
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getIssueIcon = (type: SecurityIssue['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getIssueColor = (type: SecurityIssue['type']) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
    }
  };

  useEffect(() => {
    runComprehensiveAudit();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Comprehensive Security Audit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runComprehensiveAudit} variant="outline" size="sm">
            Run Full Audit
          </Button>
          {auditResults?.sensitiveDatatFound && (
            <Button 
              onClick={cleanupSensitiveData} 
              variant="destructive" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear Sensitive Data
            </Button>
          )}
          <Button 
            onClick={() => setShowDetails(!showDetails)} 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1"
          >
            {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>

        {auditResults && (
          <div className="space-y-4">
            {/* Security Score */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold text-lg">Security Score</h3>
                <p className="text-sm text-gray-600">Overall security assessment</p>
              </div>
              <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${getScoreColor(auditResults.score)}`}>
                {auditResults.score}/100
              </div>
            </div>

            {/* Issues Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium">Critical Issues</p>
                  <p className="text-sm text-gray-600">
                    {auditResults.issues.filter(i => i.type === 'critical').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Warnings</p>
                  <p className="text-sm text-gray-600">
                    {auditResults.issues.filter(i => i.type === 'warning').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Info className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Info</p>
                  <p className="text-sm text-gray-600">
                    {auditResults.issues.filter(i => i.type === 'info').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Issues */}
            {showDetails && auditResults.issues.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Security Issues Found:</h4>
                {auditResults.issues.map((issue, index) => (
                  <Alert key={index} className={getIssueColor(issue.type)}>
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{issue.title}</span>
                          <Badge variant={issue.type === 'critical' ? 'destructive' : issue.type === 'warning' ? 'secondary' : 'default'}>
                            {issue.type.toUpperCase()}
                          </Badge>
                        </div>
                        <AlertDescription className="mb-2">
                          {issue.description}
                        </AlertDescription>
                        <div className="text-sm font-medium text-gray-700">
                          <strong>Recommendation:</strong> {issue.recommendation}
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}

            {/* Storage Audit Results */}
            {auditResults.sensitiveDatatFound && showDetails && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Sensitive Data in Storage:</strong>
                  <ul className="mt-2 ml-4 list-disc">
                    {auditResults.keys.map((key, index) => (
                      <li key={index} className="text-sm font-mono">{key}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* All Clear Message */}
            {auditResults.issues.length === 0 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Excellent!</strong> No security issues detected in this audit.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Security Best Practices */}
        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <h4 className="font-medium mb-3">Security Best Practices:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
            <div>
              <p>• Never store sensitive data in browser storage</p>
              <p>• Use HTTPS for all communications</p>
              <p>• Implement proper authentication & authorization</p>
              <p>• Validate and sanitize all user inputs</p>
              <p>• Use Content Security Policy (CSP)</p>
            </div>
            <div>
              <p>• Implement rate limiting on forms</p>
              <p>• Keep dependencies updated</p>
              <p>• Use secure session management</p>
              <p>• Log security events for monitoring</p>
              <p>• Regular security audits and penetration testing</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
