
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Heart, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the tokens from URL parameters
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (!token_hash || type !== 'signup') {
          setStatus('error');
          setErrorMessage('Invalid verification link. Please check your email for the correct link.');
          return;
        }

        // Verify the email with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'signup'
        });

        if (error) {
          console.error('Email verification error:', error);
          setStatus('error');
          setErrorMessage(error.message || 'Failed to verify email address');
          toast.error(error.message);
        } else if (data.user) {
          setStatus('success');
          toast.success('Email verified successfully! Welcome to MyRhythm.');
          
          // Clear any pending verification email from localStorage
          localStorage.removeItem('pendingVerificationEmail');
          
          // Auto-redirect to onboarding after 3 seconds
          setTimeout(() => {
            navigate('/onboarding', { replace: true });
          }, 3000);
        }
      } catch (error) {
        console.error('Unexpected verification error:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred during verification');
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate]);

  const handleResendEmail = async () => {
    const email = localStorage.getItem('pendingVerificationEmail');
    if (!email) {
      toast.error('No email found for resending verification. Please sign up again.');
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      toast.error('Failed to resend verification email');
    }
  };

  const handleBackToAuth = () => {
    navigate('/auth');
  };

  const handleGoToOnboarding = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">MyRhythm</h1>
          </div>
          <p className="text-sm text-gray-600">Professional Brain Recovery Platform</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <p className="text-gray-600">Verifying your email address...</p>
                <p className="text-sm text-gray-500">This should only take a moment</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-800">Email Verified Successfully!</h3>
                  <p className="text-green-700">
                    Welcome to MyRhythm! Your account is now active and ready to use.
                  </p>
                  <p className="text-sm text-gray-600">
                    You will be redirected to complete your setup in a few seconds...
                  </p>
                </div>
                <Button 
                  onClick={handleGoToOnboarding}
                  className="w-full"
                >
                  Continue to Setup
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="h-12 w-12 mx-auto text-red-600" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-800">Verification Failed</h3>
                  <p className="text-red-700 text-sm">
                    {errorMessage}
                  </p>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={handleResendEmail}
                    variant="outline"
                    className="w-full"
                  >
                    Resend Verification Email
                  </Button>
                  <Button 
                    onClick={handleBackToAuth}
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Having trouble? Contact support for assistance.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
