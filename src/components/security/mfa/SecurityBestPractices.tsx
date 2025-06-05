
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export function SecurityBestPractices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-600" />
          Security Best Practices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Recommended Setup:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Enable at least one authenticator app (TOTP)</li>
              <li>• Set up SMS as a backup method</li>
              <li>• Generate and store backup codes securely</li>
              <li>• Use a password manager</li>
              <li>• Enable account recovery options</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Security Tips:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Never share your backup codes</li>
              <li>• Regularly review active sessions</li>
              <li>• Use strong, unique passwords</li>
              <li>• Keep your devices updated</li>
              <li>• Be cautious of phishing attempts</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
