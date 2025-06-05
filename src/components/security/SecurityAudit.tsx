
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { SecureStorage } from "@/utils/secureStorage";
import { toast } from "sonner";

export function SecurityAudit() {
  const [auditResults, setAuditResults] = useState<{
    sensitiveDatatFound: boolean;
    keys: string[];
  } | null>(null);

  const runAudit = () => {
    const results = SecureStorage.auditStorage();
    setAuditResults(results);
    
    if (results.sensitiveDatatFound) {
      toast.warning(`Found ${results.keys.length} sensitive data items in local storage`);
    } else {
      toast.success("No sensitive data found in local storage");
    }
  };

  const cleanupSensitiveData = () => {
    SecureStorage.clearSensitiveData();
    setAuditResults(null);
    toast.success("Sensitive data cleared from local storage");
    runAudit(); // Re-run audit
  };

  useEffect(() => {
    runAudit();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Security Audit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runAudit} variant="outline" size="sm">
            Run Audit
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
        </div>

        {auditResults && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {auditResults.sensitiveDatatFound ? (
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <span className="font-medium">
                Local Storage Security Status
              </span>
              <Badge 
                variant={auditResults.sensitiveDatatFound ? "destructive" : "secondary"}
              >
                {auditResults.sensitiveDatatFound ? "Issues Found" : "Clean"}
              </Badge>
            </div>

            {auditResults.sensitiveDatatFound && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Issue:</strong> Sensitive data found in local storage.
                  <ul className="mt-2 ml-4 list-disc">
                    {auditResults.keys.map((key, index) => (
                      <li key={index} className="text-sm font-mono">{key}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {!auditResults.sensitiveDatatFound && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Good:</strong> No sensitive data found in local storage.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <h4 className="font-medium mb-2">Security Recommendations:</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• Never store payment information in browser storage</li>
            <li>• Use secure session management</li>
            <li>• Clear sensitive data on logout</li>
            <li>• Implement proper encryption for temporary data</li>
            <li>• Use server-side storage for sensitive information</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
