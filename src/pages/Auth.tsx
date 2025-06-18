
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
    // Just show a success message here
    console.log('Sign in successful, navigation will be handled by useEffect');
  };

  const handleSignUpSuccess = (email: string) => {
    setShowResendVerification(true);
    setResendVerificationEmail(email);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render auth forms if user is already authenticated
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showResendVerification) {
    return (
      <AuthLayout title="Resend verification email">
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
