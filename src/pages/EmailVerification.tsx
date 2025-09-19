
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2, Heart, Brain, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resendVerification } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'manual'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Check for custom verification parameters first (our new system)
        const token = searchParams.get('token');
        const emailParam = searchParams.get('email');
        
        if (token && emailParam) {
          setEmail(emailParam);
          await verifyWithCustomToken(emailParam, token);
          return;
        }

        // Fall back to old Supabase verification for existing users
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (token_hash && type === 'signup') {
          await verifyWithSupabaseToken(token_hash);
          return;
        }

        // No valid parameters, show manual verification
        setStatus('manual');
        
      } catch (error) {
        console.error('Unexpected verification error:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred during verification');
      }
    };

    handleEmailVerification();
  }, [searchParams]);

  const verifyWithCustomToken = async (userEmail: string, token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-email-custom', {
        body: {
          email: userEmail,
          token: token
        }
      });

      if (error) {
        console.error('Custom verification error:', error);
        setStatus('error');
        setErrorMessage('Invalid or expired verification link. Please try resending.');
        return;
      }

      if (data?.success) {
        setStatus('success');
        toast.success('Email verified successfully! Welcome to MyRhythm.');
        
        // Refresh the auth session
        await supabase.auth.refreshSession();
        
        // Auto-redirect after success
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 3000);
      }
    } catch (error) {
      console.error('Custom verification exception:', error);
      setStatus('error');
      setErrorMessage('Verification failed. Please try again.');
    }
  };

  const verifyWithSupabaseToken = async (token_hash: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'signup'
      });

      if (error) {
        console.error('Supabase verification error:', error);
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
      console.error('Supabase verification exception:', error);
      setStatus('error');
      setErrorMessage('An unexpected error occurred during verification');
    }
  };

  const handleManualVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !manualToken) {
      toast.error('Please enter both email and verification code.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-email-custom', {
        body: {
          email: email,
          token: manualToken
        }
      });

      if (error) {
        console.error('Manual verification error:', error);
        toast.error('Invalid verification code. Please check and try again.');
        return;
      }

      if (data?.success) {
        setStatus('success');
        toast.success('Email verified successfully! Welcome to MyRhythm.');
        
        // Refresh the auth session
        await supabase.auth.refreshSession();
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 3000);
      }
    } catch (error) {
      console.error('Manual verification exception:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    const emailToUse = email || localStorage.getItem('pendingVerificationEmail');
    if (!emailToUse) {
      toast.error('Please enter your email address first.');
      return;
    }

    const { error } = await resendVerification(emailToUse);
    if (!error) {
      toast.success('Verification email sent! Check your inbox and spam folder.');
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

            {status === 'manual' && (
              <>
                <Mail className="h-12 w-12 mx-auto text-primary" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Verify Your Email</h3>
                    <p className="text-gray-600 text-sm">
                      Enter your email and the verification code sent to you.
                    </p>
                  </div>
                  
                  <form onSubmit={handleManualVerification} className="space-y-4">
                    <div className="text-left">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="text-left">
                      <Label htmlFor="token">Verification Code</Label>
                      <Input
                        id="token"
                        type="text"
                        placeholder="Enter verification code from email"
                        value={manualToken}
                        onChange={(e) => setManualToken(e.target.value)}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting || !email || !manualToken}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        'Verify Email'
                      )}
                    </Button>
                  </form>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Didn't receive the email?</p>
                    <Button 
                      variant="outline" 
                      onClick={handleResendEmail}
                      disabled={!email}
                      className="w-full"
                    >
                      Resend Verification Email
                    </Button>
                  </div>
                </div>
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
                    You will be redirected to your dashboard in a few seconds...
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                >
                  Continue to Dashboard
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
                  <div className="space-y-2">
                    <Label htmlFor="resend-email">Email Address</Label>
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleResendEmail}
                    variant="outline"
                    className="w-full"
                    disabled={!email}
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
