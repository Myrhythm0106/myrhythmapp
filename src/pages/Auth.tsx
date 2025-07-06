
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ResendVerificationForm } from '@/components/auth/ResendVerificationForm';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendVerificationEmail, setResendVerificationEmail] = useState('');
  
  // Check if this is a password reset
  const isPasswordReset = searchParams.get('reset') === 'true';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      // Get the intended destination from location state, or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('Auth: Redirecting authenticated user to:', from);
      navigate(from, { replace: true });
      toast.success('Welcome back to MyRhythm!');
    }
  }, [user, loading, navigate, location.state]);

  // Show password reset message if coming from reset link
  useEffect(() => {
    if (isPasswordReset) {
      toast.info('You can now update your password');
    }
  }, [isPasswordReset]);

  const handleSignInSuccess = () => {
    // Navigation will be handled by the useEffect above
    console.log('Auth: Sign in successful, navigation will be handled by useEffect');
    toast.success('Welcome to MyRhythm!');
  };

  const handleSignUpSuccess = (email: string) => {
    console.log('Auth: Sign up successful for:', email);
    toast.success('Account created successfully! Welcome to MyRhythm.');
    
    // Since we're not requiring email verification, redirect directly to onboarding
    setTimeout(() => {
      navigate('/onboarding', { replace: true });
    }, 1500);
  };

  const handleResendVerificationRequest = (email: string) => {
    setShowResendVerification(true);
    setResendVerificationEmail(email);
  };

  const handleBackToAuth = () => {
    setShowForgotPassword(false);
    setShowResendVerification(false);
    setResendVerificationEmail('');
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render auth forms if user is already authenticated (redirect will happen via useEffect)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (showResendVerification) {
    return (
      <AuthLayout title="Verify your email address">
        <ResendVerificationForm
          onBack={handleBackToAuth}
          initialEmail={resendVerificationEmail}
        />
      </AuthLayout>
    );
  }

  if (showForgotPassword) {
    return (
      <AuthLayout title="Reset your password">
        <ForgotPasswordForm onBack={handleBackToAuth} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Your personal brain recovery companion">
      <AuthTabs
        onForgotPassword={() => setShowForgotPassword(true)}
        onResendVerification={handleResendVerificationRequest}
        onSignInSuccess={handleSignInSuccess}
        onSignUpSuccess={handleSignUpSuccess}
      />
    </AuthLayout>
  );
};

export default Auth;
