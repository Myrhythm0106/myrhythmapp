
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface EmailVerificationStatusProps {
  onContinue?: () => void;
  showContinueButton?: boolean;
}

export const EmailVerificationStatus = ({ onContinue, showContinueButton = true }: EmailVerificationStatusProps) => {
  const { user, emailVerificationStatus, resendVerification } = useAuth();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (emailVerificationStatus === 'pending') {
      const timer = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          if (newTime >= 60 && !canResend) {
            setCanResend(true);
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [emailVerificationStatus, canResend]);

  const handleResendEmail = async () => {
    if (!user?.email) return;
    
    setIsResending(true);
    await resendVerification(user.email);
    setIsResending(false);
    setTimeElapsed(0);
    setCanResend(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (emailVerificationStatus === 'verified') {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Email verified!</strong> Your account is fully activated.
        </AlertDescription>
      </Alert>
    );
  }

  if (emailVerificationStatus === 'pending') {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Check your email</h3>
                <p className="text-sm text-blue-700">
                  We've sent a verification email to <strong>{user?.email}</strong>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Email delivery status: {formatTime(timeElapsed)}
                </span>
              </div>
              
              {timeElapsed < 30 && (
                <p className="text-xs text-blue-600">
                  🚀 Emails typically arrive within 10-30 seconds
                </p>
              )}
              
              {timeElapsed >= 30 && timeElapsed < 60 && (
                <p className="text-xs text-orange-600">
                  📥 Still sending... Check your spam/junk folder
                </p>
              )}
              
              {timeElapsed >= 60 && (
                <div className="space-y-2">
                  <p className="text-xs text-red-600">
                    ⚠️ Taking longer than expected
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className="w-full"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resend verification email
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="text-xs text-blue-600 space-y-1">
              <p>💡 <strong>Can't find the email?</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Check your spam/junk folder</li>
                <li>Look for emails from "MyRhythm" or "noreply@supabase"</li>
                <li>Add our email to your contacts</li>
                <li>Wait a few more minutes - sometimes delivery is delayed</li>
              </ul>
            </div>

            {showContinueButton && (
              <div className="pt-2">
                <Button 
                  onClick={onContinue}
                  className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700"
                >
                  Continue with limited access
                </Button>
                <p className="text-xs text-center text-blue-600 mt-2">
                  You can start using MyRhythm now and verify your email later
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
