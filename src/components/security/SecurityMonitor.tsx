
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import { SessionSecurity } from '@/utils/security/sessionSecurity';
import { useAuth } from '@/contexts/AuthContext';

export function SecurityMonitor() {
  const { user } = useAuth();
  const [sessionInfo, setSessionInfo] = useState(SessionSecurity.getSessionInfo());
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const info = SessionSecurity.getSessionInfo();
      setSessionInfo(info);
      
      // Show warning when 5 minutes remaining
      const fiveMinutes = 5 * 60 * 1000;
      setShowWarning(info.timeRemaining <= fiveMinutes && info.timeRemaining > 0);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleExtendSession = () => {
    SessionSecurity.extendSession();
    setShowWarning(false);
  };

  if (!user || !showWarning) return null;

  const minutesRemaining = Math.ceil(sessionInfo.timeRemaining / (60 * 1000));

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="flex items-center justify-between">
            <span>Session expires in {minutesRemaining} minutes</span>
            <button
              onClick={handleExtendSession}
              className="ml-2 text-orange-700 underline hover:no-underline"
            >
              Extend
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
